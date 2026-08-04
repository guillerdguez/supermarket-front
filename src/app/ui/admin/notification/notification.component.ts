import { Component, inject, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { ConfirmationService } from "primeng/api";
import { NotificationService } from "../../../services/notification/notification.service";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";

@Component({
  selector: "app-notification",
  standalone: true,
  imports: [
    DatePipe,
    ButtonModule,
    PosPanelComponent,
    PosPageShellComponent,
  ],
  templateUrl: "./notification.component.html",
  styleUrl: "./notification.component.scss",
})
export class NotificationComponent implements OnInit {
  private readonly svc = inject(NotificationService);
  private readonly confirm = inject(ConfirmationService);

  items = this.svc.model.list;
  loading = this.svc.model.loading;
  unreadCount = this.svc.model.unreadCount;

  ngOnInit() {
    this.svc.retrieveList();
  }

  onMarkAll() {
    this.svc.markAllRead();
  }

  onMarkRead(id: number) {
    this.svc.markRead(id);
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
