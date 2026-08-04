import { Injectable, signal } from "@angular/core";
import { UserResponse } from "../../DTO/user.dto";

@Injectable({ providedIn: "root" })
export class UserModel {
  readonly list = signal<UserResponse[]>([]);
  readonly editing = signal<UserResponse | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
