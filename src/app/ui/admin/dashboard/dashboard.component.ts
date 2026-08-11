import { Component, inject, OnInit, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { TableModule } from "primeng/table";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { ReportService } from "../../../services/report/report.service";
import { InventoryService } from "../../../services/inventory/inventory.service";
import { CashRegisterService } from "../../../services/cash-register/cash-register.service";
import { BranchService } from "../../../services/branch/branch.service";
import { AuthService } from "../../../services/auth/auth.service";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosTableFooterComponent } from "../../wrappers/table-footer/table-footer.component";

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    CardModule,
    ButtonModule,
    TagModule,
    TableModule,
    ConfirmDialogModule,
    PosPageShellComponent,
    PosPanelComponent,
    PosTableFooterComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class AdminDashboardComponent implements OnInit {
  private readonly reports = inject(ReportService);
  private readonly inventory = inject(InventoryService);
  private readonly cash = inject(CashRegisterService);
  private readonly branches = inject(BranchService);
  private readonly auth = inject(AuthService);

  user = this.auth.model.currentUser;
  summary = this.reports.model.summary;
  inventoryStatus = this.reports.model.inventoryStatus;
  alerts = this.inventory.model.alerts;
  registers = this.cash.model.list;
  branchList = this.branches.model.list;
  loading = this.reports.model.loading;

  isOpen = this.cash.model.isOpen;
  current = this.cash.model.current;

  openRegisters = computed(() =>
    (this.registers() ?? []).filter((r) => r.status === "OPEN"),
  );

  greeting = computed(() => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 19) return "Buenas tardes";
    return "Buenas noches";
  });

  firstName = computed(() => {
    const u = this.user();
    return u?.firstName || u?.username || "Admin";
  });

  ngOnInit() {
    this.reports.retrieveSales();
    this.reports.retrieveInventoryStatus();
    this.inventory.retrieveLowStock();
    this.cash.retrieveList();
    this.branches.retrieveList();
  }
}
