import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { PosPanelComponent } from "../../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../../wrappers/page-shell/page-shell.component";
@Component({
  selector: "app-edit-transfer", standalone: true,
  imports: [RouterLink, PosPanelComponent, PosPageShellComponent],
  template: `<pos-page-shell><pos-panel title="Transferencia"><p class="back-link"><a routerLink="/admin/transfers"><i class="pi pi-arrow-left" aria-hidden="true"></i> Volver a transferencias</a></p><p>Gestiona desde el listado (aprobar/rechazar/completar).</p></pos-panel></pos-page-shell>`,
  styles: [
    `
      .back-link {
        margin: 0 0 var(--pos-space-2);
      }
      .back-link a {
        display: inline-flex;
        align-items: center;
        gap: var(--pos-space-1);
        font-size: var(--pos-font-size-xs);
        font-weight: var(--pos-font-weight-emphasis);
        color: var(--pos-text-muted);
      }
      .back-link a:hover {
        color: var(--pos-primary);
      }
    `,
  ],
})
export class EditTransferComponent {}
