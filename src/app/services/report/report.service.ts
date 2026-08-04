import { Injectable, inject } from "@angular/core";
import { forkJoin } from "rxjs";
import { ReportDao } from "../../DAO/report/report.dao";
import { ReportFilterRequest } from "../../DTO/report.dto";
import { ReportModel } from "../../model/Domain/report.model";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";

@Injectable({ providedIn: "root" })
export class ReportService {
  private readonly dao = inject(ReportDao);
  private readonly messages = inject(MessageProcessingService);
  readonly model = inject(ReportModel);

  
  retrieveSales(filter?: ReportFilterRequest): void {
    this.model.loading.set(true);

    forkJoin({
      summary: this.dao.salesSummary(filter),
      byBranch: this.dao.salesByBranch(filter),
      byCashier: this.dao.salesByCashier(filter),
    }).subscribe({
      next: ({ summary, byBranch, byCashier }) => {
        this.model.summary.set(summary);
        this.model.byBranch.set(byBranch ?? []);
        this.model.byCashier.set(byCashier ?? []);
        this.model.loading.set(false);
      },
      error: (err) => {
        this.model.loading.set(false);
        this.messages.publishErrorMsg("errorGettingReports", err);
      },
    });
  }

  retrieveInventoryStatus(): void {
    this.dao.inventoryStatus().subscribe({
      next: (status) => this.model.inventoryStatus.set(status),
      error: () => this.model.inventoryStatus.set(null),
    });
  }
}
