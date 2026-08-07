import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { SelectModule } from "primeng/select";
import { ButtonModule } from "primeng/button";
import { CashRegisterService } from "../../../services/cash-register/cash-register.service";
import { BranchService } from "../../../services/branch/branch.service";
import { AuthService } from "../../../services/auth/auth.service";
import { OpenRegisterRequest } from "../../../DTO/cash-register.dto";
import { CrudComponent } from "../../../model/Domain/crud-component";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";
@Component({
  selector: "app-open-register", standalone: true,
  imports: [FormsModule, RouterLink, SelectModule, ButtonModule, PosPanelComponent, PosPageShellComponent],
  templateUrl: "./open-register.component.html", styleUrl: "./open-register.component.scss",
})
export class OpenRegisterComponent implements OnInit, CrudComponent {
  private readonly cash = inject(CashRegisterService);
  private readonly branches = inject(BranchService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  loading = this.cash.model.loading;
  error = this.cash.model.error;
  branchList = this.branches.model.list;
  assignedBranchId = this.auth.model.branchId;
  assignedBranchName = this.auth.model.branchName;
  form: OpenRegisterRequest = { openingBalance: 0 };
  ngOnInit() {
    if (this.assignedBranchId() == null) this.branches.retrieveList();
  }
  onSubmit() {
    if (this.form.openingBalance < 0) return;
    if (this.assignedBranchId() == null && !this.form.branchId) return;
    const body: OpenRegisterRequest =
      this.assignedBranchId() != null
        ? { openingBalance: this.form.openingBalance }
        : { branchId: this.form.branchId, openingBalance: this.form.openingBalance };
    this.cash.open(body, this);
  }
  afterSave() { this.router.navigateByUrl("/cashier/dashboard"); }
}
