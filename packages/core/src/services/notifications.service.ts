export interface NotificationsService {
  sendPriceAlert(input: {
    userId: string;
    alertId: string;
    productId: string;
    targetPrice: number;
    matchedPrice: number;
  }): Promise<void>;
}
