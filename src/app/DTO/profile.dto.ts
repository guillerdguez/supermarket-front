export interface ProfileUpdateRequest { username: string; firstName: string; lastName: string; email: string; branchId?: number | null; }
export interface ChangePasswordRequest { currentPassword: string; newPassword: string; }
