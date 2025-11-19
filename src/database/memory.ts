import Database from 'better-sqlite3';
import path from 'path';

export interface Memory {
  id?: number;
  category: string;
  content: string;
  metadata?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Conversation {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export class MemoryDatabase {
  private db: Database.Database;

  constructor(dbPath: string = path.join(process.cwd(), 'memory.db')) {
    this.db = new Database(dbPath);
    this.initialize();
  }

  private initialize() {
    // Create memories table - stores long-term personal information
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        content TEXT NOT NULL,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create conversations table - stores recent conversation history
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_memories_category ON memories(category);
      CREATE INDEX IF NOT EXISTS idx_conversations_created ON conversations(created_at);
    `);
  }

  // Memory management
  addMemory(category: string, content: string, metadata?: any): number {
    const stmt = this.db.prepare(
      'INSERT INTO memories (category, content, metadata) VALUES (?, ?, ?)'
    );
    const result = stmt.run(
      category,
      content,
      metadata ? JSON.stringify(metadata) : null
    );
    return result.lastInsertRowid as number;
  }

  searchMemories(query: string): Memory[] {
    const stmt = this.db.prepare(`
      SELECT * FROM memories
      WHERE content LIKE ? OR category LIKE ?
      ORDER BY updated_at DESC
      LIMIT 50
    `);
    return stmt.all(`%${query}%`, `%${query}%`) as Memory[];
  }

  getMemoriesByCategory(category: string): Memory[] {
    const stmt = this.db.prepare(
      'SELECT * FROM memories WHERE category = ? ORDER BY updated_at DESC'
    );
    return stmt.all(category) as Memory[];
  }

  getAllMemories(): Memory[] {
    const stmt = this.db.prepare(
      'SELECT * FROM memories ORDER BY category, updated_at DESC'
    );
    return stmt.all() as Memory[];
  }

  updateMemory(id: number, content: string): void {
    const stmt = this.db.prepare(
      'UPDATE memories SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    stmt.run(content, id);
  }

  deleteMemory(id: number): void {
    const stmt = this.db.prepare('DELETE FROM memories WHERE id = ?');
    stmt.run(id);
  }

  // Conversation history management
  addConversation(role: 'user' | 'assistant', content: string): void {
    const stmt = this.db.prepare(
      'INSERT INTO conversations (role, content) VALUES (?, ?)'
    );
    stmt.run(role, content);
  }

  getRecentConversations(limit: number = 20): Conversation[] {
    const stmt = this.db.prepare(`
      SELECT * FROM conversations
      ORDER BY created_at DESC
      LIMIT ?
    `);
    return (stmt.all(limit) as Conversation[]).reverse();
  }

  clearOldConversations(daysToKeep: number = 7): void {
    const stmt = this.db.prepare(`
      DELETE FROM conversations
      WHERE created_at < datetime('now', '-' || ? || ' days')
    `);
    stmt.run(daysToKeep);
  }

  // Get memory summary for context
  getMemorySummary(): string {
    const memories = this.getAllMemories();
    if (memories.length === 0) {
      return 'No personal memories stored yet.';
    }

    const grouped = memories.reduce((acc, mem) => {
      if (!acc[mem.category]) {
        acc[mem.category] = [];
      }
      acc[mem.category].push(mem.content);
      return acc;
    }, {} as Record<string, string[]>);

    let summary = '# Personal Memory Bank\n\n';
    for (const [category, items] of Object.entries(grouped)) {
      summary += `## ${category}\n`;
      items.forEach(item => {
        summary += `- ${item}\n`;
      });
      summary += '\n';
    }

    return summary;
  }

  close(): void {
    this.db.close();
  }
}
