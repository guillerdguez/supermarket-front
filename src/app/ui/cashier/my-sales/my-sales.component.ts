import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { SaleService } from "../../../services/sale/sale.service";
import { PAYMENT_TYPE_LABELS } from "../../../model/Domain/sale.model";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";
import { PosTableFooterComponent } from "../../wrappers/table-footer/table-footer.component";
@Component({
  selector: "app-my-sales", standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, TableModule, TagModule, ButtonModule, DialogModule, PosPanelComponent, PosPageShellComponent, PosTableFooterComponent],
  templateUrl: "./my-sales.component.html", styleUrl: "./my-sales.component.scss",
})
export class MySalesComponent implements OnInit {
  private readonly salesSvc = inject(SaleService);
  items = this.salesSvc.model.mySales;
  loading = this.salesSvc.model.loading;
  detail = this.salesSvc.model.detail;
  detailDialogVisible = signal(false);

  ngOnInit() { this.salesSvc.retrieveMySales(); }
  refresh() { this.salesSvc.retrieveMySales(); }

  openDetail(id: number) {
    this.detailDialogVisible.set(true);
    this.salesSvc.retrieveDetail(id);
  }

  paymentLabel(type: string): string {
    return PAYMENT_TYPE_LABELS[type] || type;
  }
}
