import { Injectable, computed, signal } from "@angular/core";
import { UserResponse } from "../../DTO/auth.dto";

@Injectable({ providedIn: "root" })
export class AuthModel {
  readonly currentUser = signal<UserResponse | null>(null);
  readonly loading = signal(false);
  readonly isAuthenticated = computed(() => !!this.currentUser());

  
  readonly branchId = computed(() => this.currentUser()?.branchId ?? null);
  readonly branchName = computed(() => this.currentUser()?.branchName ?? null);
}
