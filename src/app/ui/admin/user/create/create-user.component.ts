import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { UserService } from "../../../../services/user/user.service";
import { BranchService } from "../../../../services/branch/branch.service";
import { UserRequest } from "../../../../DTO/user.dto";
import { CrudComponent } from "../../../../model/Domain/crud-component";
import { PosPanelComponent } from "../../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../../wrappers/page-shell/page-shell.component";

@Component({
  selector: "app-create-user",
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonModule, SelectModule, PosPanelComponent, PosPageShellComponent],
  templateUrl: "./create-user.component.html",
  styleUrl: "./create-user.component.scss",
})
export class CreateUserComponent implements OnInit, CrudComponent {
  private readonly svc = inject(UserService);
  private readonly branches = inject(BranchService);
  private readonly router = inject(Router);

  loading = this.svc.model.loading;
  branchList = this.branches.model.list;
  readonly roleOptions = [
    { label: "Cajero", value: "CASHIER" },
    { label: "Manager", value: "MANAGER" },
    { label: "Admin", value: "ADMIN" },
  ];
  form: UserRequest = {
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "CASHIER",
    branchId: null,
  };

  ngOnInit() {
    this.branches.retrieveList();
  }

  onSubmit() {
    if (!this.form.username.trim() || !this.form.email.trim() || !this.form.password) return;
    this.svc.save(this.form, undefined, this);
  }

  afterSave() {
    this.router.navigateByUrl("/admin/users");
  }
}
