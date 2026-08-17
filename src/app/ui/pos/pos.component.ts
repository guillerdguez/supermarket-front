import { Component, inject, OnInit, signal, computed } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DecimalPipe } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { ProductService } from "../../services/product/product.service";
import { CartService } from "../../services/cart/cart.service";
import { SaleService } from "../../services/sale/sale.service";
import { CashRegisterService } from "../../services/cash-register/cash-register.service";
import { AuthService } from "../../services/auth/auth.service";
import { InventoryService } from "../../services/inventory/inventory.service";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";
import { CrudComponent } from "../../model/Domain/crud-component";
import { SaleRequest } from "../../DTO/sale.dto";
import { ProductResponse } from "../../DTO/product.dto";
import { PosPanelComponent } from "../wrappers/panel/panel.component";

@Component({
  selector: "app-pos",
  standalone: true,
  imports: [
    FormsModule,
    DecimalPipe,
    DialogModule,
    ButtonModule,
    PosPanelComponent,
  ],
  templateUrl: "./pos.component.html",
  styleUrl: "./pos.component.scss",
})
export class PosComponent implements OnInit, CrudComponent {
  private readonly productsSvc = inject(ProductService);
  private readonly cart = inject(CartService);
  private readonly sales = inject(SaleService);
  private readonly cash = inject(CashRegisterService);
  private readonly auth = inject(AuthService);
  private readonly inventory = inject(InventoryService);
  private readonly messages = inject(MessageProcessingService);

  branchId = this.auth.model.branchId;
  products = this.productsSvc.model.list;
  productsLoading = this.productsSvc.model.loading;
  cartItems = this.cart.model.items;
  cartTotal = this.cart.model.total;
  cartCount = this.cart.model.itemCount;
  saleLoading = this.sales.model.loading;
  saleError = this.sales.model.error;
  currentRegister = this.cash.model.current;
  isOpen = this.cash.model.isOpen;

  search = signal("");
  showPayment = signal(false);
  paymentMethod = signal<"CASH" | "CARD" | "TRANSFER">("CASH");
  amountReceived = signal(0);

  
  private readonly stockById = computed(
    () => new Map(this.inventory.model.list().map((i) => [i.productId, i.stock])),
  );

  hasStockData = computed(() => this.stockById().size > 0);

  change = computed(() => {
    const r = this.amountReceived();
    const t = this.cartTotal();
    return r > t ? r - t : 0;
  });

  ngOnInit() {
    const branch = this.branchId();
    if (!this.currentRegister() && branch != null) this.cash.retrieveCurrent(branch);
    this.productsSvc.retrieveList();
    this.reloadStock();
  }

  onSearch() {
    this.productsSvc.retrieveList(this.search() || undefined);
  }

  
  stockOf(productId: number): number {
    return this.stockById().get(productId) ?? 0;
  }

  
  remainingOf(productId: number): number {
    if (!this.hasStockData()) return Number.POSITIVE_INFINITY;
    const inCart = this.cartItems().find((i) => i.product.id === productId)?.quantity ?? 0;
    return this.stockOf(productId) - inCart;
  }

  add(p: ProductResponse) {
    if (!this.isOpen()) return;
    if (this.remainingOf(p.id) <= 0) {
      this.messages.publishWarnMsg(
        "lowStockWarning",
        `No queda stock de «${p.name}» en esta sucursal`,
      );
      return;
    }
    this.cart.add(p);
  }

  increase(id: number) {
    if (this.remainingOf(id) <= 0) return;
    this.cart.increase(id);
  }

  private reloadStock() {
    const branch = this.currentRegister()?.branchId ?? this.branchId();
    if (branch != null) this.inventory.retrieveByBranch(branch);
  }

  decrease(id: number) {
    this.cart.decrease(id);
  }

  openPayment() {
    if (this.cartCount() === 0 || !this.isOpen()) return;
    this.amountReceived.set(this.cartTotal());
    this.paymentMethod.set("CASH");
    this.showPayment.set(true);
  }

  closePayment() {
    this.showPayment.set(false);
  }

  confirmPayment() {
    const reg = this.currentRegister();
    if (!reg || this.cartCount() === 0) return;

    if (this.paymentMethod() === "CASH" && this.amountReceived() < this.cartTotal()) {
      return;
    }

    const request: SaleRequest = {
      branchId: reg.branchId,
      details: this.cartItems().map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      })),
      amount: this.cartTotal(),
      paymentType: this.paymentMethod(),
    };

    this.sales.save(request, this);
  }

  afterSave() {
    this.cart.clear();
    this.showPayment.set(false);
    this.reloadStock();
  }
}
