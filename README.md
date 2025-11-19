# WhatsApp Claude Agent - Your Personal Second Brain 🧠

A personal AI assistant powered by Claude that lives in WhatsApp, capable of remembering your personal information, helping with decisions, and acting as your second brain.

## Features

- 💬 **WhatsApp Integration**: Chat with Claude directly through WhatsApp
- 🧠 **Persistent Memory**: Automatically learns and remembers personal information you share
- 📝 **Conversation History**: Maintains context across conversations
- 🔍 **Memory Search**: Search through your stored memories
- 🎯 **Decision Support**: Helps make tough decisions based on your past preferences and values
- 🔒 **Secure**: Only responds to your authorized WhatsApp number
- 🤖 **Powered by Claude Sonnet 4.5**: The latest and most capable Claude model

## Architecture

```
┌─────────────┐
│  WhatsApp   │
└──────┬──────┘
       │
       │ (Twilio API)
       │
┌──────▼──────────────────────────┐
│  Express Server                 │
│  - Webhook endpoint             │
│  - Message routing              │
└──────┬──────────────────────────┘
       │
       ├──────────┬──────────────┐
       │          │              │
┌──────▼──────┐  │  ┌───────────▼─────┐
│   Claude    │  │  │  Memory Database│
│   Service   │◄─┴─►│    (SQLite)     │
│             │     │                 │
│ - Chat      │     │ - Memories      │
│ - Memory    │     │ - Conversations │
│   Extract   │     │                 │
└─────────────┘     └─────────────────┘
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- A Twilio account (for WhatsApp integration)
- An Anthropic API key (for Claude)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Twilio WhatsApp

1. Create a [Twilio account](https://www.twilio.com/try-twilio)
2. Get your **Account SID** and **Auth Token** from the Twilio Console
3. Set up WhatsApp Sandbox:
   - Go to Messaging → Try it out → Send a WhatsApp message
   - Follow instructions to connect your WhatsApp to Twilio
   - Note your Twilio WhatsApp number (format: `whatsapp:+14155238886`)

### 3. Get Anthropic API Key

1. Sign up at [Anthropic Console](https://console.anthropic.com/)
2. Create an API key
3. Make sure you have credits available

### 4. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Server Configuration
PORT=3000
NODE_ENV=development

# Your WhatsApp number (security - only you can use the bot)
AUTHORIZED_WHATSAPP_NUMBER=whatsapp:+1234567890
```

### 5. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

### 6. Expose Your Server (for Webhook)

For development, use [ngrok](https://ngrok.com/):

```bash
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### 7. Configure Twilio Webhook

1. Go to Twilio Console → Messaging → Settings → WhatsApp Sandbox Settings
2. Set "When a message comes in" to: `https://your-ngrok-url.ngrok.io/webhook/whatsapp`
3. HTTP method: `POST`
4. Save

### 8. Start Chatting!

Send a WhatsApp message to your Twilio number and start chatting with your personal Claude agent!

## Usage

### Normal Conversations

Just chat naturally! The agent will:
- Answer your questions
- Help with decisions
- Remember important things you tell it
- Recall information from past conversations

Example:
```
You: Hey, I'm thinking about switching careers to data science
Claude: That's a big decision! I'd love to help you think through it...
```

### Memory Commands

Special commands to manage your memory bank:

- `/memory list` - Show all stored memories
- `/memory search <query>` - Search for specific memories
- `/memory add <category> <content>` - Manually add a memory
- `/memory help` - Show help for memory commands

Examples:
```
/memory add Preferences I love hiking on weekends
/memory search coffee
/memory list
```

### What Gets Remembered?

The agent automatically extracts and remembers:
- Personal preferences (likes, dislikes)
- Important relationships
- Goals and aspirations
- Past experiences and stories
- Health information
- Work/career details
- Hobbies and interests
- Important dates and events
- Decisions and the reasoning behind them

## Deployment

### Deploy to Production

For production deployment, you'll need a server with a public IP or domain. Popular options:

1. **Railway.app** (easiest)
   - Connect your GitHub repo
   - Add environment variables
   - Deploy automatically

2. **Heroku**
   ```bash
   heroku create your-app-name
   heroku config:set ANTHROPIC_API_KEY=xxx
   # ... set other env vars
   git push heroku main
   ```

3. **DigitalOcean / AWS / GCP**
   - Set up a VPS
   - Install Node.js
   - Clone repo and run with PM2
   - Set up nginx as reverse proxy

### Important for Production

1. **Use HTTPS**: Twilio webhooks require HTTPS
2. **Set up monitoring**: Use services like UptimeRobot
3. **Database backups**: Regularly backup your `memory.db` file
4. **Security**: Keep your API keys secure, never commit `.env`

## Project Structure

```
.
├── src/
│   ├── database/
│   │   └── memory.ts          # SQLite database for memories
│   ├── services/
│   │   ├── claude.ts          # Claude API integration
│   │   └── whatsapp.ts        # Twilio WhatsApp service
│   ├── config.ts              # Configuration management
│   └── index.ts               # Main Express server
├── .env.example               # Example environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Database Schema

### Memories Table
Stores long-term personal information:
```sql
- id: INTEGER PRIMARY KEY
- category: TEXT (e.g., "Preferences", "Family", "Goals")
- content: TEXT (the actual memory)
- metadata: TEXT (optional JSON data)
- created_at: DATETIME
- updated_at: DATETIME
```

### Conversations Table
Stores recent conversation history for context:
```sql
- id: INTEGER PRIMARY KEY
- role: TEXT ('user' or 'assistant')
- content: TEXT (message content)
- created_at: DATETIME
```

## Customization

### Adjust System Prompt

Edit the `buildSystemPrompt()` method in `src/services/claude.ts` to customize how Claude behaves.

### Change Memory Extraction Logic

Modify `extractAndStoreMemories()` in `src/services/claude.ts` to change what information gets automatically remembered.

### Add New Commands

Add new command handlers in the `handleMemoryCommand()` function in `src/index.ts`.

## Troubleshooting

### Messages not being received

1. Check webhook URL is correct in Twilio console
2. Verify ngrok/server is running
3. Check server logs for errors
4. Ensure AUTHORIZED_WHATSAPP_NUMBER matches your number exactly

### Claude not responding

1. Verify ANTHROPIC_API_KEY is valid
2. Check you have API credits
3. Look for error messages in console

### Memory not being saved

1. Check file permissions for `memory.db`
2. Verify SQLite database is being created
3. Check console logs for database errors

## Security Notes

- The agent only responds to the number specified in `AUTHORIZED_WHATSAPP_NUMBER`
- Keep your `.env` file secure and never commit it to git
- Regularly backup your `memory.db` file
- Consider encrypting the database for sensitive information

## Privacy

All data is stored locally in your `memory.db` SQLite database. Conversations are sent to:
- Anthropic's API (for Claude responses) - see [Anthropic's privacy policy](https://www.anthropic.com/legal/privacy)
- Twilio (for WhatsApp messaging) - see [Twilio's privacy policy](https://www.twilio.com/legal/privacy)

## Contributing

This is a personal project, but feel free to fork and customize for your own use!

## License

MIT

---

Built with ❤️ using Claude Sonnet 4.5
