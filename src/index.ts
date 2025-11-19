import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { config, validateConfig } from './config';
import { MemoryDatabase } from './database/memory';
import { ClaudeService } from './services/claude';
import { WhatsAppService } from './services/whatsapp';

// Validate environment variables
validateConfig();

// Initialize services
const memoryDb = new MemoryDatabase();
const claudeService = new ClaudeService(config.anthropic.apiKey, memoryDb);
const whatsappService = new WhatsAppService(
  config.twilio.accountSid,
  config.twilio.authToken,
  config.twilio.whatsappNumber
);

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    memoryCount: memoryDb.getAllMemories().length
  });
});

// WhatsApp webhook endpoint
app.post('/webhook/whatsapp', async (req: Request, res: Response) => {
  try {
    const { From, Body } = req.body;

    // Validate payload
    if (!From || Body === undefined || Body === null) {
      console.log('Invalid webhook payload: missing From or Body');
      return res.sendStatus(400);
    }

    console.log(`Received message from ${From}: ${Body}`);

    // Security: Only respond to authorized number
    if (config.security.authorizedNumber && From !== config.security.authorizedNumber) {
      console.log(`Rejected message from unauthorized number: ${From}`);
      return res.sendStatus(403);
    }

    // Acknowledge receipt immediately
    res.sendStatus(200);

    // Process message asynchronously
    processMessage(From, Body).catch(err => {
      console.error('Error in async message processing:', err);
    });
  } catch (error) {
    console.error('Error in webhook:', error);
    res.sendStatus(500);
  }
});

async function processMessage(from: string, message: string): Promise<void> {
  try {
    // Trim and validate message
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return; // Ignore empty messages
    }

    // Check for special commands
    if (trimmedMessage.toLowerCase().startsWith('/memory')) {
      await handleMemoryCommand(from, trimmedMessage);
      return;
    }

    // Get response from Claude
    const response = await claudeService.chat(trimmedMessage);

    // Send response via WhatsApp
    await whatsappService.sendMessage(from, response);
  } catch (error) {
    console.error('Error processing message:', error);
    try {
      await whatsappService.sendMessage(
        from,
        'Sorry, I encountered an error processing your message. Please try again.'
      );
    } catch (sendError) {
      console.error('Failed to send error message:', sendError);
    }
  }
}

async function handleMemoryCommand(from: string, message: string): Promise<void> {
  const parts = message.split(' ');
  const command = parts[1]?.toLowerCase();

  switch (command) {
    case 'list':
      const memories = memoryDb.getAllMemories();
      if (memories.length === 0) {
        await whatsappService.sendMessage(from, 'No memories stored yet.');
      } else {
        const summary = memoryDb.getMemorySummary();
        await whatsappService.sendMessage(from, summary);
      }
      break;

    case 'search':
      const query = parts.slice(2).join(' ');
      if (!query) {
        await whatsappService.sendMessage(from, 'Usage: /memory search <query>');
        return;
      }
      const results = memoryDb.searchMemories(query);
      if (results.length === 0) {
        await whatsappService.sendMessage(from, `No memories found for "${query}"`);
      } else {
        let response = `Found ${results.length} memories:\n\n`;
        results.forEach(mem => {
          response += `[${mem.category}] ${mem.content}\n`;
        });
        await whatsappService.sendMessage(from, response);
      }
      break;

    case 'add':
      // Format: /memory add <category> <content>
      if (parts.length < 4) {
        await whatsappService.sendMessage(
          from,
          'Usage: /memory add <category> <content>\nExample: /memory add Preferences I love coffee'
        );
        return;
      }
      const category = parts[2];
      const content = parts.slice(3).join(' ');
      memoryDb.addMemory(category, content);
      await whatsappService.sendMessage(
        from,
        `✓ Added to ${category}: ${content}`
      );
      break;

    case 'help':
    default:
      await whatsappService.sendMessage(
        from,
        `Memory Commands:

/memory list - Show all memories
/memory search <query> - Search memories
/memory add <category> <content> - Add a memory
/memory help - Show this help

Note: I also automatically remember important things you tell me during our conversations!`
      );
      break;
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  memoryDb.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down gracefully...');
  memoryDb.close();
  process.exit(0);
});

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`🤖 WhatsApp Claude Agent is running on port ${PORT}`);
  console.log(`📱 Authorized WhatsApp: ${config.security.authorizedNumber}`);
  console.log(`💾 Memory database initialized`);
  console.log(`🌐 Webhook URL: http://your-domain.com/webhook/whatsapp`);
});

export { app };
