import { Injectable, signal } from "@angular/core";
import { SaleResponse } from "../../DTO/sale.dto";

@Injectable({ providedIn: "root" })
export class SaleModel {
  readonly list = signal<SaleResponse[]>([]);
  readonly mySales = signal<SaleResponse[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
