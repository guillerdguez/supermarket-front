import { Component, inject, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { AuthService } from "../../../services/auth/auth.service";
import { CashRegisterService } from "../../../services/cash-register/cash-register.service";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";

@Component({
  selector: "app-cashier-dashboard",
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    ButtonModule,
    PosPanelComponent,
    PosPageShellComponent,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class CashierDashboardComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly cash = inject(CashRegisterService);
  private readonly confirm = inject(ConfirmationService);

  user = this.auth.model.currentUser;
  branchId = this.auth.model.branchId;
  branchName = this.auth.model.branchName;
  current = this.cash.model.current;
  isOpen = this.cash.model.isOpen;
  loading = this.cash.model.loading;

  ngOnInit() {
    const branch = this.branchId();
    if (branch != null) this.cash.retrieveCurrent(branch);
  }

  logout() {
    this.confirm.confirm({
      message: "¿Seguro que quieres cerrar sesión?",
      header: "Salir",
      icon: "pi pi-sign-out",
      acceptLabel: "Sí, salir",
      rejectLabel: "No",
      acceptButtonStyleClass: "p-button-danger",
      rejectButtonStyleClass: "p-button-text",
      accept: () => this.auth.logout(),
    });
  }
}
