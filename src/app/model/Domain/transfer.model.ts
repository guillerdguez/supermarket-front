import { Injectable, signal } from "@angular/core";
import { TransferResponse } from "../../DTO/transfer.dto";

@Injectable({ providedIn: "root" })
export class TransferModel {
  readonly list = signal<TransferResponse[]>([]);
  readonly mine = signal<TransferResponse[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
