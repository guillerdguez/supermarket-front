import { Component, inject, OnInit, computed } from "@angular/core";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ButtonModule } from "primeng/button";
import { CashRegisterService } from "../../../services/cash-register/cash-register.service";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";
import { PosTableFooterComponent } from "../../wrappers/table-footer/table-footer.component";
@Component({
  selector: "app-cash-register", standalone: true,
  imports: [CurrencyPipe, DatePipe, TableModule, TagModule, ButtonModule, PosPanelComponent, PosPageShellComponent, PosTableFooterComponent],
  templateUrl: "./cash-register.component.html", styleUrl: "./cash-register.component.scss",
})
export class CashRegisterComponent implements OnInit {
  private readonly svc = inject(CashRegisterService);
  loading = this.svc.model.loading;
  items = computed(() =>
    [...this.svc.model.list()].sort((a, b) =>
      a.status === b.status ? 0 : a.status === "OPEN" ? -1 : 1,
    ),
  );
  ngOnInit() { this.svc.retrieveList(); }
  refresh() { this.svc.retrieveList(); }
}
