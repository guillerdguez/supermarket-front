import { Component, input } from "@angular/core";

@Component({
  selector: "pos-page-shell",
  standalone: true,
  template: `
    <div
      class="pos-page"
      [class.pos-page--dashboard]="variant() === 'dashboard'"
    >
      <ng-content />
    </div>
  `,
  styles: [
    `

      .pos-page {
        display: var(--pos-page-display, grid);
        grid-template-columns: 1fr;
        gap: var(--pos-page-gap, var(--pos-space-3));
        padding: var(--pos-page-padding, var(--pos-space-3));
        max-width: var(--pos-page-max-width, 1248px);
        margin-inline: auto;
      }
      .pos-page--dashboard {
        grid-template-columns: repeat(12, 1fr);
        gap: var(--pos-space-2);
      }
      :host ::ng-deep .pos-kpi {
        grid-column: span 3;
      }
      :host ::ng-deep .pos-main {
        grid-column: span 8;
      }
      :host ::ng-deep .pos-side {
        grid-column: span 4;
      }
      @media (max-width: 768px) {
        :host ::ng-deep .pos-kpi {
          grid-column: span 6;
        }
        :host ::ng-deep .pos-main,
        :host ::ng-deep .pos-side {
          grid-column: span 12;
        }
      }
    `,
  ],
})
export class PosPageShellComponent {
  variant = input<"default" | "dashboard">("default");
}
