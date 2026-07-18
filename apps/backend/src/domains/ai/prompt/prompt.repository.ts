import fs from 'fs/promises';
import path from 'path';

export interface PromptTemplate {
  name: string;
  content: string;
  version: string;
}

export interface IPromptRepository {
  getPrompt(name: string): Promise<PromptTemplate>;
}

export class MarkdownPromptRepository implements IPromptRepository {
  private promptsDir: string;

  constructor() {
    this.promptsDir = path.join(__dirname, '../prompts');
  }

  async getPrompt(name: string): Promise<PromptTemplate> {
    const filePath = path.join(this.promptsDir, `${name}.md`);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return {
        name,
        content,
        version: '1.0.0' // In a production app, we would parse YAML frontmatter for version info
      };
    } catch (error) {
      throw new Error(`Prompt template ${name} not found at ${filePath}.`);
    }
  }
}

export const promptRepository = new MarkdownPromptRepository();
