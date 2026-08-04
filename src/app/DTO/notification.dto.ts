export interface NotificationResponse {
  id: number;
  message: string;
  read: boolean;
  type?: string;
  createdAt?: string;
  /** Si el backend lo envía, filtramos por el usuario logueado */
  userId?: number;
  username?: string;
}
