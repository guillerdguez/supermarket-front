import { Component, inject, OnInit } from "@angular/core";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ButtonModule } from "primeng/button";
import { ContextMenuModule } from "primeng/contextmenu";
import { MenuItem } from "primeng/api";
import { SaleService } from "../../../services/sale/sale.service";
import { SaleResponse } from "../../../DTO/sale.dto";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";
import { PosTableFooterComponent } from "../../wrappers/table-footer/table-footer.component";
import { PosReasonDialogComponent } from "../../wrappers/reason-dialog/reason-dialog.component";

@Component({
  selector: "app-sale",
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    TableModule,
    TagModule,
    ButtonModule,
    ContextMenuModule,
    PosPanelComponent,
    PosPageShellComponent,
    PosTableFooterComponent,
    PosReasonDialogComponent,
  ],
  templateUrl: "./sale.component.html",
  styleUrl: "./sale.component.scss",
})
export class SaleComponent implements OnInit {
  private readonly svc = inject(SaleService);
  items = this.svc.model.list;
  loading = this.svc.model.loading;
  selected: SaleResponse | null = null;
  cancelDialogVisible = false;
  private cancelTargetId: number | null = null;

  menuItems: MenuItem[] = [
    {
      label: "Cancelar venta",
      icon: "pi pi-times",
      visible: true,
      command: () => {
        if (this.selected && this.selected.status === "REGISTERED") {
          this.onCancel(this.selected.id);
        }
      },
    },
  ];

  ngOnInit() {
    this.svc.retrieveList();
  }

  refresh() {
    this.svc.retrieveList();
  }

  onCancel(id: number) {
    this.cancelTargetId = id;
    this.cancelDialogVisible = true;
  }

  confirmCancel(reason: string) {
    if (this.cancelTargetId == null) return;
    this.svc.cancel(this.cancelTargetId, reason);
    this.cancelTargetId = null;
  }
}
