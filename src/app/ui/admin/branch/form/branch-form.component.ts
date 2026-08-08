import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { BranchService } from "../../../../services/branch/branch.service";
import { BranchRequest } from "../../../../DTO/branch.dto";
import { CrudComponent } from "../../../../model/Domain/crud-component";
import { PosPanelComponent } from "../../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../../wrappers/page-shell/page-shell.component";

@Component({
  selector: "app-branch-form",
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    ButtonModule,
    PosPanelComponent,
    PosPageShellComponent,
  ],
  templateUrl: "./branch-form.component.html",
  styleUrl: "./branch-form.component.scss",
})
export class BranchFormComponent implements OnInit, CrudComponent {
  private readonly svc = inject(BranchService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = this.svc.model.loading;
  ready = signal(false);
  id: number | null = null;
  form: BranchRequest = { name: "", address: "", isWarehouse: false };

  isPreview = false;

  get isEdit(): boolean {
    return this.id != null;
  }

  constructor() {
    effect(() => {
      const branch = this.svc.model.editing();
      if (!branch) return;
      this.form = {
        name: branch.name,
        address: branch.address || "",
        isWarehouse: branch.isWarehouse ?? false,
      };
      this.ready.set(true);
    });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get("id");
    this.id = idParam ? Number(idParam) : null;
    this.isPreview =
      this.route.snapshot.queryParamMap.get("isPreview") === "true";

    if (this.isEdit) {
      this.svc.retrieveDetail(this.id!);
    } else {
      this.ready.set(true);
    }
  }

  onSubmit() {
    if (!this.form.name.trim() || !this.form.address.trim()) return;
    this.svc.save(this.form, this.id ?? undefined, this);
  }

  afterSave() {
    if (this.isPreview) {
      window.close();
      return;
    }
    this.router.navigateByUrl("/admin/branches");
  }
  closePreview() {
    window.close();
  }
}
