import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { UserService } from "../../../../services/user/user.service";
import { BranchService } from "../../../../services/branch/branch.service";
import { UserRequest } from "../../../../DTO/user.dto";
import { CrudComponent } from "../../../../model/Domain/crud-component";
import { PosPanelComponent } from "../../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../../wrappers/page-shell/page-shell.component";

@Component({
  selector: "app-edit-user",
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    ButtonModule,
    SelectModule,
    PosPanelComponent,
    PosPageShellComponent,
  ],
  templateUrl: "./edit-user.component.html",
  styleUrl: "./edit-user.component.scss",
})
export class EditUserComponent implements OnInit, CrudComponent {
  private readonly svc = inject(UserService);
  private readonly branches = inject(BranchService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = this.svc.model.loading;
  ready = signal(false);
  userId = 0;

  // Ventana flotante abierta desde UserComponent.openPreview() — sin menú.
  // Igual que en sisbatch: sin botón interno de cerrar, se autocierra sola al
  // guardar (afterSave) y para cancelar se usa el cerrar nativo del navegador.
  isPreview = false;
  branchList = this.branches.model.list;
  readonly roleOptions = [
    { label: "Cajero", value: "CASHIER" },
    { label: "Manager", value: "MANAGER" },
    { label: "Admin", value: "ADMIN" },
  ];
  form: UserRequest = {
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "CASHIER",
    branchId: null,
  };

  constructor() {
    effect(() => {
      const user = this.svc.model.editing();
      if (!user) return;
      this.form = {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        branchId: user.branchId ?? null,
      };
      this.ready.set(true);
    });
  }

  ngOnInit() {
    this.branches.retrieveList();
    this.userId = Number(this.route.snapshot.paramMap.get("id"));
    this.isPreview =
      this.route.snapshot.queryParamMap.get("isPreview") === "true";
    this.svc.retrieveDetail(this.userId);
  }

  onSubmit() {
    this.svc.save(this.form, this.userId, this);
  }

  afterSave() {
    if (this.isPreview) {
      window.close();
      return;
    }
    this.router.navigateByUrl("/admin/users");
  }
  closePreview() {
    window.close();
  }
}
