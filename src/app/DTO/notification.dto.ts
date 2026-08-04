export interface NotificationResponse {
  id: number;
  message: string;
  read: boolean;
  type?: string;
  createdAt?: string;
  
  userId?: number;
  username?: string;
}
