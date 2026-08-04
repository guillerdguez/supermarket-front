export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "MANAGER" | "CASHIER" | string;
  branchId?: number | null;
  branchName?: string | null;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}
