export type EmailNotificationMessage = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export type TelegramNotificationMessage = {
  chatId: string;
  text: string;
};
