import { Injectable, signal } from "@angular/core";
import { BranchResponse } from "../../DTO/branch.dto";

@Injectable({ providedIn: "root" })
export class BranchModel {
  readonly list = signal<BranchResponse[]>([]);
  readonly editing = signal<BranchResponse | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
