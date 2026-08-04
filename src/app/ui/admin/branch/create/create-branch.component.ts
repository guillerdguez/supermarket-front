import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { BranchService } from "../../../../services/branch/branch.service";
import { BranchRequest } from "../../../../DTO/branch.dto";
import { CrudComponent } from "../../../../model/Domain/crud-component";
import { PosPanelComponent } from "../../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../../wrappers/page-shell/page-shell.component";

@Component({
  selector: "app-create-branch",
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonModule, PosPanelComponent, PosPageShellComponent],
  templateUrl: "./create-branch.component.html",
  styleUrl: "./create-branch.component.scss",
})
export class CreateBranchComponent implements CrudComponent {
  private readonly svc = inject(BranchService);
  private readonly router = inject(Router);

  loading = this.svc.model.loading;
  form: BranchRequest = { name: "", address: "", isWarehouse: false };

  onSubmit() {
    if (!this.form.name.trim() || !this.form.address.trim()) return;
    this.svc.save(this.form, undefined, this);
  }

  afterSave() {
    this.router.navigateByUrl("/admin/branches");
  }
}
