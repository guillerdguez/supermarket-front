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
  selector: "app-edit-branch",
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    ButtonModule,
    PosPanelComponent,
    PosPageShellComponent,
  ],
  templateUrl: "./edit-branch.component.html",
  styleUrl: "./edit-branch.component.scss",
})
export class EditBranchComponent implements OnInit, CrudComponent {
  private readonly svc = inject(BranchService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = this.svc.model.loading;
  ready = signal(false);
  branchId = 0;
  form: BranchRequest = { name: "", address: "", isWarehouse: false };

  // Ventana flotante abierta desde BranchComponent.openPreview() — sin menú.
  // Igual que en sisbatch: sin botón interno de cerrar, se autocierra sola al
  // guardar (afterSave) y para cancelar se usa el cerrar nativo del navegador.
  isPreview = false;

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
    this.branchId = Number(this.route.snapshot.paramMap.get("id"));
    this.isPreview =
      this.route.snapshot.queryParamMap.get("isPreview") === "true";
    this.svc.retrieveDetail(this.branchId);
  }

  onSubmit() {
    if (!this.form.name.trim() || !this.form.address.trim()) return;
    this.svc.save(this.form, this.branchId, this);
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
