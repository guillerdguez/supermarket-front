import { Component, computed, effect, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { SelectModule } from "primeng/select";
import { TagModule } from "primeng/tag";
import { ButtonModule } from "primeng/button";
import { ContextMenuModule } from "primeng/contextmenu";
import { DialogModule } from "primeng/dialog";
import { InputNumberModule } from "primeng/inputnumber";
import { MenuItem } from "primeng/api";
import { InventoryService } from "../../../services/inventory/inventory.service";
import { BranchService } from "../../../services/branch/branch.service";
import { BranchInventoryResponse } from "../../../DTO/inventory.dto";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";
import { PosTableFooterComponent } from "../../wrappers/table-footer/table-footer.component";

const SELECTED_BRANCH_KEY = "inventorySelectedBranchId";

@Component({
  selector: "app-inventory",
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    SelectModule,
    TagModule,
    ButtonModule,
    ContextMenuModule,
    DialogModule,
    InputNumberModule,
    PosPanelComponent,
    PosPageShellComponent,
    PosTableFooterComponent,
  ],
  templateUrl: "./inventory.component.html",
  styleUrl: "./inventory.component.scss",
})
export class InventoryComponent implements OnInit {
  private readonly inventory = inject(InventoryService);
  private readonly branches = inject(BranchService);

  items = this.inventory.model.list;
  alerts = this.inventory.model.alerts;
  status = this.inventory.model.status;
  loading = this.inventory.model.loading;
  error = this.inventory.model.error;
  branchList = this.branches.model.list;

  selectedBranchId = signal<number | null>(null);
  lowStockOnly = signal(false);
  selected: BranchInventoryResponse | null = null;

  editingRow = signal<BranchInventoryResponse | null>(null);
  editDialogVisible = false;
  editStock = 0;
  editMin = 0;

  menuItems: MenuItem[] = [
    {
      label: "Editar stock",
      icon: "pi pi-pencil",
      command: () => {
        if (this.selected) this.startEdit(this.selected);
      },
    },
    {
      label: "Sumar 1",
      icon: "pi pi-plus",
      command: () => {
        if (this.selected) this.adjust(this.selected, 1);
      },
    },
    {
      label: "Restar 1",
      icon: "pi pi-minus",
      command: () => {
        if (this.selected) this.adjust(this.selected, -1);
      },
    },
  ];

  filteredItems = computed(() =>
    this.lowStockOnly()
      ? this.items().filter((r) => r.stock <= r.minStock)
      : this.items(),
  );

  constructor() {
    // Si no hay sucursal guardada, selecciona la primera al cargar la lista.
    effect(() => {
      const branches = this.branchList();
      if (this.selectedBranchId() == null && branches.length > 0) {
        this.onBranchChange(branches[0].id);
      }
    });
  }

  ngOnInit() {
    this.branches.retrieveList();
    this.inventory.retrieveLowStock();
    this.inventory.retrieveStatus();

    const saved = localStorage.getItem(SELECTED_BRANCH_KEY);
    if (saved) {
      this.onBranchChange(Number(saved));
    }
  }

  onBranchChange(id: number) {
    this.selectedBranchId.set(id);
    localStorage.setItem(SELECTED_BRANCH_KEY, String(id));
    this.inventory.retrieveByBranch(id);
  }

  refresh() {
    const branchId = this.selectedBranchId();
    if (branchId != null) this.inventory.retrieveByBranch(branchId);
    this.inventory.retrieveLowStock();
    this.inventory.retrieveStatus();
  }

  rowClass(stock: number, min: number): string {
    if (stock === 0) return "row-danger";
    if (stock <= min) return "row-warning";
    return "";
  }

  startEdit(row: BranchInventoryResponse) {
    this.editingRow.set(row);
    this.editStock = row.stock;
    this.editMin = row.minStock;
    this.editDialogVisible = true;
  }

  cancelEdit() {
    this.editDialogVisible = false;
    this.editingRow.set(null);
  }

  saveEdit() {
    const row = this.editingRow();
    const branchId = this.selectedBranchId();
    if (!row || branchId == null) return;
    if (this.editStock == null || this.editMin == null) return;
    if (this.editStock < 0 || this.editMin < 0) return;

    this.inventory.updateStock(
      branchId,
      row.productId,
      this.editStock,
      this.editMin,
    );
    this.editDialogVisible = false;
    this.editingRow.set(null);
  }

  adjust(row: BranchInventoryResponse, delta: number) {
    const branchId = this.selectedBranchId();
    if (branchId == null) return;
    this.inventory.adjustStock(branchId, row.productId, {
      delta,
      reason: delta > 0 ? "Ajuste manual +" : "Ajuste manual -",
    });
  }
}
