import type { EmailNotificationMessage, TelegramNotificationMessage } from './messages.js';

export interface EmailNotificationProvider {
  send(message: EmailNotificationMessage): Promise<void>;
}

export interface TelegramNotificationProvider {
  send(message: TelegramNotificationMessage): Promise<void>;
}
