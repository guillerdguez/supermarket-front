import { Injectable, signal } from "@angular/core";
import { UserResponse } from "../../DTO/auth.dto";

@Injectable({ providedIn: "root" })
export class ProfileModel {
  readonly profile = signal<UserResponse | null>(null);
  readonly loading = signal(false);
}
