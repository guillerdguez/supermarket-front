import { Component, inject, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ButtonModule } from "primeng/button";
import { ConfirmationService } from "primeng/api";
import { TransferService } from "../../../services/transfer/transfer.service";
import { TransferResponse } from "../../../DTO/transfer.dto";
import { transferStatusSeverity } from "../../../model/Domain/transfer.model";
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
  private readonly confirm = inject(ConfirmationService);
  items = this.svc.model.mine;
  loading = this.svc.model.loading;

  ngOnInit() { this.svc.retrieveMine(); }
  refresh() { this.svc.retrieveMine(); }

  severity = transferStatusSeverity;

  cancel(row: TransferResponse) {
    this.confirm.confirm({
      header: "Cancelar transferencia",
      message: `¿Cancelar la solicitud de «${row.productName}»?`,
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí, cancelar",
      rejectLabel: "No",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => this.svc.cancel(row.id),
    });
  }
}
