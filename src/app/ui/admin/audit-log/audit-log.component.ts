import { Component, inject, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ButtonModule } from "primeng/button";
import { AuditLogService } from "../../../services/audit-log/audit-log.service";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";
import { PosTableFooterComponent } from "../../wrappers/table-footer/table-footer.component";
@Component({
  selector: "app-audit-log", standalone: true,
  imports: [DatePipe, TableModule, TagModule, ButtonModule, PosPanelComponent, PosPageShellComponent, PosTableFooterComponent],
  templateUrl: "./audit-log.component.html", styleUrl: "./audit-log.component.scss",
})
export class AuditLogComponent implements OnInit {
  private readonly svc = inject(AuditLogService);
  items = this.svc.model.list;
  loading = this.svc.model.loading;
  ngOnInit() { this.svc.retrieveList(); }
  refresh() { this.svc.retrieveList(); }
}
