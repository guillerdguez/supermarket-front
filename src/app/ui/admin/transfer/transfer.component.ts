import { Component, inject, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ButtonModule } from "primeng/button";
import { ContextMenuModule } from "primeng/contextmenu";
import { MenuItem } from "primeng/api";
import { TransferService } from "../../../services/transfer/transfer.service";
import { TransferResponse } from "../../../DTO/transfer.dto";
import { transferStatusSeverity } from "../../../model/Domain/transfer.model";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";
import { PosTableFooterComponent } from "../../wrappers/table-footer/table-footer.component";
import { PosReasonDialogComponent } from "../../wrappers/reason-dialog/reason-dialog.component";

@Component({
  selector: "app-transfer",
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    TableModule,
    TagModule,
    ButtonModule,
    ContextMenuModule,
    PosPanelComponent,
    PosPageShellComponent,
    PosTableFooterComponent,
    PosReasonDialogComponent,
  ],
  templateUrl: "./transfer.component.html",
  styleUrl: "./transfer.component.scss",
})
export class TransferComponent implements OnInit {
  private readonly svc = inject(TransferService);
  items = this.svc.model.list;
  loading = this.svc.model.loading;
  selected: TransferResponse | null = null;
  rejectDialogVisible = false;
  private rejectTargetId: number | null = null;

  menuItems: MenuItem[] = [];

  ngOnInit() {
    this.svc.retrieveList();
  }

  refresh() {
    this.svc.retrieveList();
  }

  severity(s: string) {
    return transferStatusSeverity(s);
  }

  buildMenu(row: TransferResponse) {
    this.selected = row;
    const items: MenuItem[] = [];
    if (row.status === "PENDING") {
      items.push(
        { label: "Aprobar", icon: "pi pi-check", command: () => this.approve(row.id) },
        { label: "Rechazar", icon: "pi pi-times", command: () => this.reject(row.id) },
        { label: "Cancelar", icon: "pi pi-ban", command: () => this.cancel(row.id) },
      );
    }
    if (row.status === "APPROVED") {
      items.push({ label: "Completar", icon: "pi pi-check-circle", command: () => this.complete(row.id) });
    }
    this.menuItems = items;
  }

  approve(id: number) {
    this.svc.approve(id);
  }
  complete(id: number) {
    this.svc.complete(id);
  }
  cancel(id: number) {
    this.svc.cancel(id);
  }
  reject(id: number) {
    this.rejectTargetId = id;
    this.rejectDialogVisible = true;
  }

  confirmReject(reason: string) {
    if (this.rejectTargetId == null) return;
    this.svc.reject(this.rejectTargetId, reason);
    this.rejectTargetId = null;
  }
}
