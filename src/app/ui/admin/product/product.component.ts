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
import { CurrencyPipe } from "@angular/common";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { ContextMenuModule } from "primeng/contextmenu";
import { ConfirmationService, MenuItem } from "primeng/api";
import { ProductService } from "../../../services/product/product.service";
import { ProductResponse } from "../../../DTO/product.dto";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";
import { PosTableFooterComponent } from "../../wrappers/table-footer/table-footer.component";
import { ListUiStateService } from "../../../../util/listUiState/list-ui-state.service";

@Component({
  selector: "app-product",
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    CurrencyPipe,
    TableModule,
    ButtonModule,
    InputTextModule,
    ContextMenuModule,
    PosPanelComponent,
    PosPageShellComponent,
    PosTableFooterComponent,
  ],
  templateUrl: "./product.component.html",
  styleUrl: "./product.component.scss",
})
export class ProductComponent implements OnInit, OnDestroy {
  private readonly products = inject(ProductService);
  private readonly confirm = inject(ConfirmationService);
  private readonly router = inject(Router);
  private readonly listUiState = inject(ListUiStateService);
  private readonly stateKey = "products";
  private readonly host = inject(ElementRef<HTMLElement>);

  items = this.products.model.list;
  loading = this.products.model.loading;
  error = this.products.model.error;
  search = signal("");
  selected: ProductResponse | null = null;
  selectedRows: ProductResponse[] = [];

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
          this.router.navigate(["/admin/products/edit", this.selected.id]);
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
    const saved = this.listUiState.get(this.stateKey);
    if (saved) {
      this.search.set(saved.search);
    }
    this.products.retrieveList(this.search() || undefined);
  }

  ngOnDestroy() {
    this.listUiState.set(this.stateKey, {
      search: this.search(),
    });
  }

  // Ventana flotante ~75% de pantalla, centrada, con la misma ruta de edición
  // marcada con ?isPreview=true (ver EditProductComponent.isPreview).
  openPreview(id: number) {
    const width = Math.round(window.screen.width * 0.75);
    const height = Math.round(window.screen.height * 0.75);
    const left = Math.round((window.screen.width - width) / 2);
    const top = Math.round((window.screen.height - height) / 2);
    window.open(
      `/admin/products/edit/${id}?isPreview=true`,
      "productPreview",
      `width=${width},height=${height},left=${left},top=${top}`,
    );
  }

  onSearch() {
    this.products.retrieveList(this.search());
  }
  clearSearch() {
    this.search.set("");
    this.onSearch();
  }
  refresh() {
    this.products.retrieveList(this.search() || undefined);
  }
  onDelete(id: number, name: string) {
    this.confirm.confirm({
      header: "Eliminar producto",
      message: `¿Eliminar el producto «${name}»?`,
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Eliminar",
      rejectLabel: "Cancelar",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => this.products.delete(id),
    });
  }

  onDeleteSelected() {
    const ids = this.selectedRows.map((r) => r.id);
    if (ids.length === 0) return;
    this.confirm.confirm({
      header: "Eliminar productos",
      message: `¿Eliminar ${ids.length} producto${ids.length === 1 ? "" : "s"} seleccionado${ids.length === 1 ? "" : "s"}?`,
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Eliminar",
      rejectLabel: "Cancelar",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.products.delete(ids);
        this.selectedRows = [];
      },
    });
  }

  // Deselecciona todo al clicar fuera de la tabla (checkboxes de selección múltiple).
  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent) {
    const table = this.host.nativeElement.querySelector(".table-wrap");
    if (table && !table.contains(event.target as Node)) {
      this.selectedRows = [];
    }
  }
}
