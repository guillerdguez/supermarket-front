import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { ContextMenuModule } from "primeng/contextmenu";
import { ConfirmationService, MenuItem } from "primeng/api";
import { UserService } from "../../../services/user/user.service";
import { UserResponse } from "../../../DTO/user.dto";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";
import { PosTableFooterComponent } from "../../wrappers/table-footer/table-footer.component";
import { ListUiStateService } from "../../../../util/listUiState/list-ui-state.service";

@Component({
  selector: "app-user",
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    TableModule,
    TagModule,
    ButtonModule,
    InputTextModule,
    ContextMenuModule,
    PosPanelComponent,
    PosPageShellComponent,
    PosTableFooterComponent,
  ],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.scss",
})
export class UserComponent implements OnInit, OnDestroy {
  private readonly svc = inject(UserService);
  private readonly confirm = inject(ConfirmationService);
  private readonly router = inject(Router);
  private readonly listUiState = inject(ListUiStateService);
  private readonly stateKey = "users";
  private readonly host = inject(ElementRef<HTMLElement>);
  items = this.svc.model.list;
  loading = this.svc.model.loading;
  search = signal("");
  selected: UserResponse | null = null;
  selectedRows: UserResponse[] = [];

  menuItems: MenuItem[] = [
    {
      label: "Vista rápida",
      icon: "pi pi-external-link",
      command: () => {
        if (this.selected) this.openPreview(this.selected.id);
      },
    },
    {
      label: "Editar",
      icon: "pi pi-pencil",
      command: () => {
        if (this.selected)
          this.router.navigate(["/admin/users/edit", this.selected.id]);
      },
    },
    {
      label: "Desactivar",
      icon: "pi pi-user-minus",
      command: () => {
        if (this.selected)
          this.onDelete(this.selected.id, this.selected.username);
      },
    },
  ];

  ngOnInit() {
    const saved = this.listUiState.get(this.stateKey);
    if (saved) {
      this.search.set(saved.search);
    }
    this.svc.retrieveList(this.search() || undefined);
  }

  ngOnDestroy() {
    this.listUiState.set(this.stateKey, {
      search: this.search(),
    });
  }

  onSearch() {
    this.svc.retrieveList(this.search() || undefined);
  }

  clearSearch() {
    this.search.set("");
    this.onSearch();
  }

  refresh() {
    this.svc.retrieveList(this.search() || undefined);
  }

  // Mismo mecanismo de ventana flotante que ProductComponent.openPreview.
  openPreview(id: number) {
    const width = Math.round(window.screen.width * 0.75);
    const height = Math.round(window.screen.height * 0.75);
    const left = Math.round((window.screen.width - width) / 2);
    const top = Math.round((window.screen.height - height) / 2);
    window.open(
      `/admin/users/edit/${id}?isPreview=true`,
      "userPreview",
      `width=${width},height=${height},left=${left},top=${top}`,
    );
  }

  onDelete(id: number, name: string) {
    this.confirm.confirm({
      header: "Desactivar usuario",
      message: `¿Desactivar al usuario «${name}»?`,
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Desactivar",
      rejectLabel: "Cancelar",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => this.svc.delete(id),
    });
  }

  onDeleteSelected() {
    const ids = this.selectedRows.map((r) => r.id);
    if (ids.length === 0) return;
    this.confirm.confirm({
      header: "Desactivar usuarios",
      message: `¿Desactivar ${ids.length} usuario${ids.length === 1 ? "" : "s"} seleccionado${ids.length === 1 ? "" : "s"}?`,
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Desactivar",
      rejectLabel: "Cancelar",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.svc.delete(ids);
        this.selectedRows = [];
      },
    });
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent) {
    const table = this.host.nativeElement.querySelector(".table-wrap");
    if (table && !table.contains(event.target as Node)) {
      this.selectedRows = [];
    }
  }

  roleSeverity(role: string): "danger" | "warn" | "info" | "success" {
    if (role === "ADMIN") return "danger";
    if (role === "MANAGER") return "warn";
    return "info";
  }
}
