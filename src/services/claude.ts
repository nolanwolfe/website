import Anthropic from '@anthropic-ai/sdk';
import { MemoryDatabase } from '../database/memory';

export class ClaudeService {
  private client: Anthropic;
  private memoryDb: MemoryDatabase;

  constructor(apiKey: string, memoryDb: MemoryDatabase) {
    this.client = new Anthropic({ apiKey });
    this.memoryDb = memoryDb;
  }

  async chat(userMessage: string): Promise<string> {
    try {
      // Get context from memory and recent conversations
      const systemPrompt = this.buildSystemPrompt();
      const conversationHistory = this.memoryDb.getRecentConversations(10);

      // Build messages array
      const messages: Anthropic.MessageParam[] = conversationHistory.map(conv => ({
        role: conv.role,
        content: conv.content
      }));

      // Add current user message
      messages.push({
        role: 'user',
        content: userMessage
      });

      // Call Claude API
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        system: systemPrompt,
        messages: messages
      });

      const assistantMessage = response.content[0].type === 'text'
        ? response.content[0].text
        : '';

      // Store conversation in database
      this.memoryDb.addConversation('user', userMessage);
      this.memoryDb.addConversation('assistant', assistantMessage);

      // Check if the user is sharing new personal information to remember
      await this.extractAndStoreMemories(userMessage, assistantMessage);

      return assistantMessage;
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw error;
    }
  }

  private buildSystemPrompt(): string {
    const memorySummary = this.memoryDb.getMemorySummary();

    return `You are a personal AI assistant integrated into WhatsApp, serving as a "second brain" for your user. Your role is to:

1. **Remember personal information**: You have access to a memory bank of personal details, preferences, experiences, and important information about the user.

2. **Help with decisions**: Use your knowledge of the user's past experiences, preferences, and values to help them make tough decisions.

3. **Remind and recall**: Help the user remember things from the past, recall conversations, and keep track of important details.

4. **Learn continuously**: When the user shares new information about themselves, their life, preferences, or experiences, you should acknowledge it and remember it for future conversations.

5. **Be personal and warm**: You know this user personally. Be friendly, supportive, and personalized in your responses.

## Memory Extraction Guidelines

When the user shares information that should be remembered, look for:
- Personal preferences (favorite things, dislikes)
- Important relationships (family, friends, colleagues)
- Goals and aspirations
- Past experiences and stories
- Health information
- Work/career details
- Hobbies and interests
- Important dates and events
- Decisions they've made and why

When you identify such information in the conversation, you can suggest: "I'll remember that..." or "Got it, I've noted that..."

## Current Memory Bank

${memorySummary}

Remember to reference this information naturally when it's relevant to the conversation. If the user asks you to remember something specific, acknowledge it clearly.`;
  }

  private async extractAndStoreMemories(
    userMessage: string,
    assistantResponse: string
  ): Promise<void> {
    // Use Claude to analyze if there's new information to remember
    const extractionPrompt = `Analyze this conversation exchange and determine if the user shared any personal information that should be stored in their memory bank.

User message: "${userMessage}"
Assistant response: "${assistantResponse}"

If there is information to remember, respond with a JSON array of memories in this format:
[
  {
    "category": "Category name (e.g., Preferences, Family, Work, Health, Goals, etc.)",
    "content": "Brief, clear statement of the fact to remember"
  }
]

If there's nothing new to remember, respond with an empty array: []

Only extract factual information about the user, not general conversation or questions. Focus on lasting personal details, not temporary states.`;

    try {
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: extractionPrompt
        }]
      });

      const extractedText = response.content[0].type === 'text'
        ? response.content[0].text
        : '[]';

      // Parse and store memories
      const memories = JSON.parse(extractedText.trim());
      if (Array.isArray(memories) && memories.length > 0) {
        for (const memory of memories) {
          if (memory.category && memory.content) {
            this.memoryDb.addMemory(memory.category, memory.content);
            console.log(`Stored new memory - ${memory.category}: ${memory.content}`);
          }
        }
      }
    } catch (error) {
      // Silently fail memory extraction - don't interrupt the main conversation
      console.error('Memory extraction error:', error);
    }
  }

  // Manual memory management
  addMemory(category: string, content: string): number {
    return this.memoryDb.addMemory(category, content);
  }

  searchMemories(query: string) {
    return this.memoryDb.searchMemories(query);
  }

  getAllMemories() {
    return this.memoryDb.getAllMemories();
  }
}
