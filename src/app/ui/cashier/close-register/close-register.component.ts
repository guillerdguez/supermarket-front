import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CurrencyPipe } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CashRegisterService } from "../../../services/cash-register/cash-register.service";
import { AuthService } from "../../../services/auth/auth.service";
import { CrudComponent } from "../../../model/Domain/crud-component";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";
@Component({
  selector: "app-close-register", standalone: true,
  imports: [FormsModule, RouterLink, CurrencyPipe, ButtonModule, PosPanelComponent, PosPageShellComponent],
  templateUrl: "./close-register.component.html", styleUrl: "./close-register.component.scss",
})
export class CloseRegisterComponent implements OnInit, CrudComponent {
  private readonly cash = inject(CashRegisterService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  loading = this.cash.model.loading;
  current = this.cash.model.current;
  closingBalance = 0;
  ngOnInit() {
    const branch = this.auth.model.branchId();
    if (!this.current() && branch != null) this.cash.retrieveCurrent(branch);
  }
  onSubmit() {
    const reg = this.current();
    if (!reg || this.closingBalance < 0) return;
    this.cash.close(reg.id, { closingBalance: this.closingBalance }, this);
  }
  afterSave() { this.router.navigateByUrl("/cashier/dashboard"); }
}
