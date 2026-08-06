import { Component, inject, OnInit, signal } from "@angular/core";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { TagModule } from "primeng/tag";
import { ConfirmationService } from "primeng/api";
import { NotificationService } from "../../../services/notification/notification.service";
import { NotificationResponse } from "../../../DTO/notification.dto";
import { SaleService } from "../../../services/sale/sale.service";
import { TransferService } from "../../../services/transfer/transfer.service";
import { PAYMENT_TYPE_LABELS } from "../../../model/Domain/sale.model";
import { transferStatusSeverity } from "../../../model/Domain/transfer.model";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";

@Component({
  selector: "app-notification",
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    ButtonModule,
    DialogModule,
    TagModule,
    PosPanelComponent,
    PosPageShellComponent,
  ],
  templateUrl: "./notification.component.html",
  styleUrl: "./notification.component.scss",
})
export class NotificationComponent implements OnInit {
  private readonly svc = inject(NotificationService);
  private readonly confirm = inject(ConfirmationService);
  private readonly saleSvc = inject(SaleService);
  private readonly transferSvc = inject(TransferService);

  items = this.svc.model.list;
  loading = this.svc.model.loading;
  unreadCount = this.svc.model.unreadCount;

  saleDetail = this.saleSvc.model.detail;
  transferDetail = this.transferSvc.model.detail;
  saleDialogVisible = signal(false);
  transferDialogVisible = signal(false);

  ngOnInit() {
    this.svc.retrieveList();
  }

  onMarkAll() {
    this.svc.markAllRead();
  }

  onMarkRead(id: number) {
    this.svc.markRead(id);
  }

  openReference(n: NotificationResponse) {
    if (!n.read) this.onMarkRead(n.id);
    if (n.referenceType === "SALE" && n.referenceId != null) {
      this.transferDialogVisible.set(false);
      this.saleDialogVisible.set(true);
      this.saleSvc.retrieveSaleDetail(n.referenceId);
    } else if (n.referenceType === "TRANSFER" && n.referenceId != null) {
      this.saleDialogVisible.set(false);
      this.transferDialogVisible.set(true);
      this.transferSvc.retrieveDetail(n.referenceId);
    }
  }

  paymentLabel(type: string): string {
    return PAYMENT_TYPE_LABELS[type] || type;
  }

  transferSeverity(status: string) {
    return transferStatusSeverity(status);
  }

  onDelete(id: number) {
    this.confirm.confirm({
      message: "¿Eliminar esta notificación?",
      header: "Confirmar",
      icon: "pi pi-trash",
      acceptLabel: "Sí",
      rejectLabel: "No",
      acceptButtonStyleClass: "p-button-danger",
      rejectButtonStyleClass: "p-button-text",
      accept: () => this.svc.delete(id),
    });
  }
}
