export interface UserResponse {
  id: number; username: string; email: string; firstName: string; lastName: string;
  role: string; active?: boolean;
  branchId?: number | null; branchName?: string | null;
}
export interface UserRequest {
  username: string; email: string; password?: string;
  firstName: string; lastName: string; role?: string;
  branchId?: number | null;
}
