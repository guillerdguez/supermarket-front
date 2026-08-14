import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService, ConfirmationService } from "primeng/api";
import { PosComponent } from "./pos.component";
import { CartService } from "../../services/cart/cart.service";
import { SaleService } from "../../services/sale/sale.service";
import { CashRegisterService } from "../../services/cash-register/cash-register.service";
import { InventoryService } from "../../services/inventory/inventory.service";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";
import { ProductResponse } from "../../DTO/product.dto";
import { CashRegisterResponse } from "../../DTO/cash-register.dto";
import { BranchInventoryResponse } from "../../DTO/inventory.dto";

describe("PosComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();
  });

  const product: ProductResponse = {
    id: 1,
    name: "Leche Entera 1L",
    barcode: "1001",
    price: 1.15,
    category: "Lacteos",
  };

  const openRegister: CashRegisterResponse = {
    id: 10,
    branchId: 1,
    openingBalance: 150,
    status: "OPEN",
  };

  const inventoryRow: BranchInventoryResponse = {
    id: 1,
    branchId: 1,
    branchName: "Sucursal Centro",
    productId: 1,
    productName: "Leche Entera 1L",
    productCategory: "Lacteos",
    stock: 2,
    minStock: 5,
  };

  function create() {
    const fixture = TestBed.createComponent(PosComponent);
    fixture.detectChanges();
    return fixture;
  }

  it("should create", () => {
    const fixture = create();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("reports zero stock for a product not present in the branch inventory", () => {
    const fixture = create();
    expect(fixture.componentInstance.stockOf(999)).toBe(0);
  });

  it("reports the stock loaded for the branch's inventory", () => {
    const fixture = create();
    const inventory = TestBed.inject(InventoryService);
    inventory.model.list.set([inventoryRow]);

    expect(fixture.componentInstance.stockOf(1)).toBe(2);
  });

  it("does not add a product to the cart when the register is not open", () => {
    const fixture = create();
    const cash = TestBed.inject(CashRegisterService);
    cash.model.current.set(null);

    fixture.componentInstance.add(product);

    expect(fixture.componentInstance.cartCount()).toBe(0);
  });

  it("warns and does not add the product when there is no remaining stock", () => {
    const fixture = create();
    const cash = TestBed.inject(CashRegisterService);
    const inventory = TestBed.inject(InventoryService);
    const messages = TestBed.inject(MessageProcessingService);
    const warnSpy = jest.spyOn(messages, "publishWarnMsg").mockImplementation(() => undefined);

    cash.model.current.set(openRegister);
    inventory.model.list.set([{ ...inventoryRow, stock: 0 }]);

    fixture.componentInstance.add(product);

    expect(warnSpy).toHaveBeenCalled();
    expect(fixture.componentInstance.cartCount()).toBe(0);
  });

  it("adds the product to the cart when the register is open and stock remains", () => {
    const fixture = create();
    const cash = TestBed.inject(CashRegisterService);
    const inventory = TestBed.inject(InventoryService);

    cash.model.current.set(openRegister);
    inventory.model.list.set([inventoryRow]);

    fixture.componentInstance.add(product);

    expect(fixture.componentInstance.cartCount()).toBe(1);
    expect(fixture.componentInstance.cartTotal()).toBeCloseTo(1.15);
  });

  it("does not open the payment dialog with an empty cart", () => {
    const fixture = create();
    const cash = TestBed.inject(CashRegisterService);
    cash.model.current.set(openRegister);

    fixture.componentInstance.openPayment();

    expect(fixture.componentInstance.showPayment()).toBe(false);
  });

  it("opens the payment dialog pre-filled with the cart total", () => {
    const fixture = create();
    const cash = TestBed.inject(CashRegisterService);
    const cart = TestBed.inject(CartService);
    cash.model.current.set(openRegister);
    cart.add(product);
    cart.add(product);

    fixture.componentInstance.openPayment();

    expect(fixture.componentInstance.showPayment()).toBe(true);
    expect(fixture.componentInstance.amountReceived()).toBeCloseTo(2.3);
    expect(fixture.componentInstance.paymentMethod()).toBe("CASH");
  });

  it("does not confirm a cash payment when the amount received is less than the total", () => {
    const fixture = create();
    const cash = TestBed.inject(CashRegisterService);
    const cart = TestBed.inject(CartService);
    const sales = TestBed.inject(SaleService);
    cash.model.current.set(openRegister);
    cart.add(product);
    const saveSpy = jest.spyOn(sales, "save").mockImplementation(() => undefined);

    fixture.componentInstance.paymentMethod.set("CASH");
    fixture.componentInstance.amountReceived.set(0.5);
    fixture.componentInstance.confirmPayment();

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it("confirms the sale with the cart contents and chosen payment method", () => {
    const fixture = create();
    const cash = TestBed.inject(CashRegisterService);
    const cart = TestBed.inject(CartService);
    const sales = TestBed.inject(SaleService);
    cash.model.current.set(openRegister);
    cart.add(product);
    const saveSpy = jest.spyOn(sales, "save").mockImplementation(() => undefined);

    fixture.componentInstance.paymentMethod.set("CARD");
    fixture.componentInstance.amountReceived.set(1.15);
    fixture.componentInstance.confirmPayment();

    expect(saveSpy).toHaveBeenCalledWith(
      {
        branchId: 1,
        details: [{ productId: 1, quantity: 1 }],
        amount: 1.15,
        paymentType: "CARD",
      },
      fixture.componentInstance,
    );
  });

  it("clears the cart and closes the dialog after a successful save", () => {
    const fixture = create();
    const cart = TestBed.inject(CartService);
    cart.add(product);
    fixture.componentInstance.showPayment.set(true);

    fixture.componentInstance.afterSave();

    expect(fixture.componentInstance.cartCount()).toBe(0);
    expect(fixture.componentInstance.showPayment()).toBe(false);
  });
});
