import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CurrencyPipe } from "@angular/common";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ReportService } from "../../../services/report/report.service";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";
import { PosTableFooterComponent } from "../../wrappers/table-footer/table-footer.component";
@Component({
  selector: "app-report", standalone: true,
  imports: [FormsModule, CurrencyPipe, TableModule, ButtonModule, PosPanelComponent, PosPageShellComponent, PosTableFooterComponent],
  templateUrl: "./report.component.html", styleUrl: "./report.component.scss",
})
export class ReportComponent implements OnInit {
  private readonly svc = inject(ReportService);
  summary = this.svc.model.summary;
  byBranch = this.svc.model.byBranch;
  byCashier = this.svc.model.byCashier;
  inventory = this.svc.model.inventoryStatus;
  loading = this.svc.model.loading;
  startDate = ""; endDate = "";
  ngOnInit() { this.svc.retrieveSales(); this.svc.retrieveInventoryStatus(); }
  onFilter() {
    this.svc.retrieveSales({
      startDate: this.startDate || undefined,
      endDate: this.endDate || undefined,
    });
  }
}
