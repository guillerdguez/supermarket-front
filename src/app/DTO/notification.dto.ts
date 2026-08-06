export type ReferenceType = "SALE" | "TRANSFER";

export interface NotificationResponse {
  id: number;
  message: string;
  read: boolean;
  type?: string;
  createdAt?: string;
  referenceType?: ReferenceType;
  referenceId?: number;

  userId?: number;
  username?: string;
}
