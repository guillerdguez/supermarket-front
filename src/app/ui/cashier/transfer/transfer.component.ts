import { Component, inject, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ButtonModule } from "primeng/button";
import { TransferService } from "../../../services/transfer/transfer.service";
import { TransferResponse } from "../../../DTO/transfer.dto";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";
import { PosTableFooterComponent } from "../../wrappers/table-footer/table-footer.component";

@Component({
  selector: "app-cashier-transfer", standalone: true,
  imports: [RouterLink, DatePipe, TableModule, TagModule, ButtonModule, PosPanelComponent, PosPageShellComponent, PosTableFooterComponent],
  templateUrl: "./transfer.component.html", styleUrl: "./transfer.component.scss",
})
export class CashierTransferComponent implements OnInit {
  private readonly svc = inject(TransferService);
  items = this.svc.model.mine;
  loading = this.svc.model.loading;

  ngOnInit() { this.svc.retrieveMine(); }
  refresh() { this.svc.retrieveMine(); }

  severity(s: string): "success" | "info" | "warn" | "danger" | "secondary" {
    const map: Record<string, "success" | "info" | "warn" | "danger" | "secondary"> = {
      COMPLETED: "success",
      APPROVED: "info",
      PENDING: "warn",
      REJECTED: "danger",
      CANCELLED: "danger",
    };
    return map[s] || "secondary";
  }

  cancel(row: TransferResponse) {
    this.svc.cancel(row.id);
  }
}
