import { Component, inject, OnInit, computed } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CurrencyPipe, DatePipe, DecimalPipe } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { SelectModule } from "primeng/select";
import { ChartModule } from "primeng/chart";
import type { ChartData, ChartOptions } from "chart.js";
import { ReportService } from "../../../services/report/report.service";
import { BranchService } from "../../../services/branch/branch.service";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const currencyFormatter = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
const compactCurrencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency", currency: "EUR", notation: "compact", maximumFractionDigits: 1,
});

@Component({
  selector: "app-report", standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    ButtonModule,
    CheckboxModule,
    SelectModule,
    ChartModule,
    PosPanelComponent,
    PosPageShellComponent,
  ],
  templateUrl: "./report.component.html", styleUrl: "./report.component.scss",
})
export class ReportComponent implements OnInit {
  private readonly svc = inject(ReportService);
  private readonly branches = inject(BranchService);
  summary = this.svc.model.summary;
  byBranch = this.svc.model.byBranch;
  byCashier = this.svc.model.byCashier;
  inventory = this.svc.model.inventoryStatus;
  byProduct = this.svc.model.byProduct;
  comparison = this.svc.model.comparison;
  performance = this.svc.model.performance;
  cashRegisterReport = this.svc.model.cashRegisterReport;
  loading = this.svc.model.loading;
  startDate = ""; endDate = "";

  branchList = this.branches.model.list;
  cashRegisterBranchId: number | null = null;
  cashRegisterOnlyDiscrepancies = false;

  private readonly chartColor = cssVar("--pos-primary");
  private readonly chartColorHover = cssVar("--pos-primary-hover");

  readonly barChartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: cssVar("--pos-surface"),
        titleColor: cssVar("--pos-text"),
        bodyColor: cssVar("--pos-text-muted"),
        borderColor: cssVar("--pos-border"),
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: { label: (ctx) => currencyFormatter.format(Number(ctx.parsed.y)) },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: cssVar("--pos-text-muted"), font: { family: cssVar("--pos-font-family"), size: 12 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: cssVar("--pos-border") },
        ticks: {
          color: cssVar("--pos-text-muted"),
          font: { family: cssVar("--pos-font-family"), size: 12 },
          callback: (value) => compactCurrencyFormatter.format(Number(value)),
        },
      },
    },
  };

  readonly branchChartData = computed<ChartData<"bar">>(() => ({
    labels: this.byBranch().map((r) => r.branchName),
    datasets: [{
      label: "Ingresos",
      data: this.byBranch().map((r) => r.totalRevenue),
      backgroundColor: this.chartColor,
      hoverBackgroundColor: this.chartColorHover,
      borderRadius: 6,
      maxBarThickness: 48,
    }],
  }));

  readonly cashierChartData = computed<ChartData<"bar">>(() => ({
    labels: this.byCashier().map((r) => r.cashierUsername),
    datasets: [{
      label: "Ingresos",
      data: this.byCashier().map((r) => r.totalRevenue),
      backgroundColor: this.chartColor,
      hoverBackgroundColor: this.chartColorHover,
      borderRadius: 6,
      maxBarThickness: 48,
    }],
  }));

  ngOnInit() {
    this.svc.retrieveSales();
    this.svc.retrieveInventoryStatus();
    this.branches.retrieveList();
    this.svc.retrieveCashRegisterReport();
  }

  onFilter() {
    this.svc.retrieveSales({
      startDate: this.startDate || undefined,
      endDate: this.endDate || undefined,
    });
  }

  refresh() {
    this.onFilter();
    this.svc.retrieveInventoryStatus();
  }

  onCashRegisterFilter() {
    this.svc.retrieveCashRegisterReport({
      startDate: this.startDate || undefined,
      endDate: this.endDate || undefined,
      branchId: this.cashRegisterBranchId ?? undefined,
      showOnlyDiscrepancies: this.cashRegisterOnlyDiscrepancies || undefined,
    });
  }
}
