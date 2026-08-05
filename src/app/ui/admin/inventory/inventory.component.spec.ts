import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService, ConfirmationService } from "primeng/api";
import { InventoryComponent } from "./inventory.component";
import { InventoryService } from "../../../services/inventory/inventory.service";
import { BranchService } from "../../../services/branch/branch.service";
import { BranchInventoryResponse } from "../../../DTO/inventory.dto";
import { BranchResponse } from "../../../DTO/branch.dto";

describe("InventoryComponent", () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [InventoryComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();
  });

  const rows: BranchInventoryResponse[] = [
    {
      id: 1, branchId: 1, branchName: "Sucursal Centro", productId: 1,
      productName: "Leche Entera 1L", productCategory: "Lacteos", stock: 10, minStock: 10,
    },
    {
      id: 2, branchId: 1, branchName: "Sucursal Centro", productId: 2,
      productName: "Pan de Barra Unidad", productCategory: "Panaderia", stock: 40, minStock: 10,
    },
    {
      id: 3, branchId: 1, branchName: "Sucursal Centro", productId: 3,
      productName: "Agua Mineral 1.5L", productCategory: "Bebidas", stock: 0, minStock: 15,
    },
  ];

  function create() {
    const fixture = TestBed.createComponent(InventoryComponent);
    fixture.detectChanges();
    return fixture;
  }

  it("should create", () => {
    const fixture = create();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("shows every row when lowStockOnly is off", () => {
    const fixture = create();
    const inventory = TestBed.inject(InventoryService);
    inventory.model.list.set(rows);

    expect(fixture.componentInstance.filteredItems().length).toBe(3);
  });

  it("filters down to rows at or below their minimum when lowStockOnly is on", () => {
    const fixture = create();
    const inventory = TestBed.inject(InventoryService);
    inventory.model.list.set(rows);
    fixture.componentInstance.lowStockOnly.set(true);

    const filtered = fixture.componentInstance.filteredItems();
    expect(filtered.map((r) => r.productId)).toEqual([1, 3]);
  });

  it("classifies row severity from stock vs minimum", () => {
    const fixture = create();
    expect(fixture.componentInstance.rowClass(0, 10)).toBe("row-danger");
    expect(fixture.componentInstance.rowClass(5, 10)).toBe("row-warning");
    expect(fixture.componentInstance.rowClass(20, 10)).toBe("");
  });

  it("remembers the selected branch in localStorage and reloads it on init", () => {
    const inventory = TestBed.inject(InventoryService);
    const retrieveSpy = jest.spyOn(inventory, "retrieveByBranch").mockImplementation(() => undefined);
    localStorage.setItem("inventorySelectedBranchId", "4");

    const fixture = create();

    expect(fixture.componentInstance.selectedBranchId()).toBe(4);
    expect(retrieveSpy).toHaveBeenCalledWith(4);
  });

  it("auto-selects the first branch when none is saved", () => {
    const branchList: BranchResponse[] = [
      { id: 5, name: "Sucursal Norte" },
      { id: 6, name: "Sucursal Sur" },
    ];
    const inventory = TestBed.inject(InventoryService);
    const branches = TestBed.inject(BranchService);
    const retrieveSpy = jest.spyOn(inventory, "retrieveByBranch").mockImplementation(() => undefined);

    const fixture = create();
    branches.model.list.set(branchList);
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedBranchId()).toBe(5);
    expect(retrieveSpy).toHaveBeenCalledWith(5);
  });

  it("opens the edit dialog pre-filled with the row's current stock", () => {
    const fixture = create();

    fixture.componentInstance.startEdit(rows[0]);

    expect(fixture.componentInstance.editDialogVisible).toBe(true);
    expect(fixture.componentInstance.editingRow()).toEqual(rows[0]);
    expect(fixture.componentInstance.editStock).toBe(10);
    expect(fixture.componentInstance.editMin).toBe(10);
  });

  it("closes the edit dialog without saving on cancel", () => {
    const fixture = create();
    fixture.componentInstance.startEdit(rows[0]);

    fixture.componentInstance.cancelEdit();

    expect(fixture.componentInstance.editDialogVisible).toBe(false);
    expect(fixture.componentInstance.editingRow()).toBeNull();
  });

  it("rejects saving a negative stock or minimum", () => {
    const fixture = create();
    const inventory = TestBed.inject(InventoryService);
    const updateSpy = jest.spyOn(inventory, "updateStock").mockImplementation(() => undefined);
    fixture.componentInstance.selectedBranchId.set(1);
    fixture.componentInstance.startEdit(rows[0]);

    fixture.componentInstance.editStock = -1;
    fixture.componentInstance.saveEdit();

    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("saves the edited stock and minimum for the selected branch", () => {
    const fixture = create();
    const inventory = TestBed.inject(InventoryService);
    const updateSpy = jest.spyOn(inventory, "updateStock").mockImplementation(() => undefined);
    fixture.componentInstance.selectedBranchId.set(1);
    fixture.componentInstance.startEdit(rows[0]);

    fixture.componentInstance.editStock = 25;
    fixture.componentInstance.editMin = 8;
    fixture.componentInstance.saveEdit();

    expect(updateSpy).toHaveBeenCalledWith(1, 1, 25, 8);
    expect(fixture.componentInstance.editDialogVisible).toBe(false);
  });
});
