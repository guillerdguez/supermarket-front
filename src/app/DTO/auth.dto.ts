export type { UserResponse } from "./user.dto";
import type { UserResponse } from "./user.dto";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}
