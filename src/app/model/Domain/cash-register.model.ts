import { Injectable, computed, signal } from "@angular/core";
import { CashRegisterResponse } from "../../DTO/cash-register.dto";

@Injectable({ providedIn: "root" })
export class CashRegisterModel {
  readonly current = signal<CashRegisterResponse | null>(null);
  readonly list = signal<CashRegisterResponse[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly isOpen = computed(() => this.current()?.status === "OPEN");
}
