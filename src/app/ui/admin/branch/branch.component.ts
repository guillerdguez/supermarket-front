import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
} from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ButtonModule } from "primeng/button";
import { ContextMenuModule } from "primeng/contextmenu";
import { ConfirmationService, MenuItem } from "primeng/api";
import { BranchService } from "../../../services/branch/branch.service";
import { BranchResponse } from "../../../DTO/branch.dto";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";
import { PosTableFooterComponent } from "../../wrappers/table-footer/table-footer.component";

@Component({
  selector: "app-branch",
  standalone: true,
  imports: [
    RouterLink,
    TableModule,
    TagModule,
    ButtonModule,
    ContextMenuModule,
    PosPanelComponent,
    PosPageShellComponent,
    PosTableFooterComponent,
  ],
  templateUrl: "./branch.component.html",
  styleUrl: "./branch.component.scss",
})
export class BranchComponent implements OnInit {
  private readonly svc = inject(BranchService);
  private readonly confirm = inject(ConfirmationService);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);
  items = this.svc.model.list;
  loading = this.svc.model.loading;
  error = this.svc.model.error;
  selected: BranchResponse | null = null;
  selectedRows: BranchResponse[] = [];

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
          this.router.navigate(["/admin/branches/edit", this.selected.id]);
      },
    },
    {
      label: "Eliminar",
      icon: "pi pi-trash",
      command: () => {
        if (this.selected) this.onDelete(this.selected.id, this.selected.name);
      },
    },
  ];

  ngOnInit() {
    this.svc.retrieveList();
  }

  refresh() {
    this.svc.retrieveList();
  }

  openPreview(id: number) {
    const width = Math.round(window.screen.width * 0.75);
    const height = Math.round(window.screen.height * 0.75);
    const left = Math.round((window.screen.width - width) / 2);
    const top = Math.round((window.screen.height - height) / 2);
    window.open(
      `/admin/branches/edit/${id}?isPreview=true`,
      "branchPreview",
      `width=${width},height=${height},left=${left},top=${top}`,
    );
  }

  onDelete(id: number, name: string) {
    this.confirm.confirm({
      header: "Eliminar sucursal",
      message: `¿Eliminar «${name}»?`,
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Eliminar",
      rejectLabel: "Cancelar",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => this.svc.delete(id),
    });
  }

  onDeleteSelected() {
    const ids = this.selectedRows.map((r) => r.id);
    if (ids.length === 0) return;
    this.confirm.confirm({
      header: "Eliminar sucursales",
      message: `¿Eliminar ${ids.length} sucursal${ids.length === 1 ? "" : "es"} seleccionada${ids.length === 1 ? "" : "s"}?`,
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Eliminar",
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
}
