export interface AuditLogResponse {
  id: number;
  username?: string;
  action: string;
  details?: string;
  ipAddress?: string;
  timestamp?: string;
  status?: string;
}
