import { Injectable, signal } from "@angular/core";
import { UserResponse } from "../../DTO/user.dto";

export const USER_ROLE_OPTIONS = [
  { label: "Cajero", value: "CASHIER" },
  { label: "Manager", value: "MANAGER" },
  { label: "Admin", value: "ADMIN" },
];

@Injectable({ providedIn: "root" })
export class UserModel {
  readonly list = signal<UserResponse[]>([]);
  readonly editing = signal<UserResponse | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
