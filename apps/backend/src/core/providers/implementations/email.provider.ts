import { IEmailProvider } from '../interfaces';
import { logger } from '../../../core/logging/logger';

export class MockEmailProvider implements IEmailProvider {
  async sendEmail(to: string, subject: string, body: string, isHtml: boolean = false): Promise<boolean> {
    logger.info(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
    logger.debug(`[MOCK EMAIL BODY]\n${body}`);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  }
}

// Export a singleton instance. In a real app, this might be injected via DI.
export const emailProvider = new MockEmailProvider();
