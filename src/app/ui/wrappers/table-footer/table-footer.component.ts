import { Component, input } from "@angular/core";

@Component({
  selector: "pos-table-footer",
  standalone: true,
  templateUrl: "./table-footer.component.html",
  styleUrl: "./table-footer.component.scss",
})
export class PosTableFooterComponent {
  selectedCount = input<number | null>(null);
  visibleCount = input.required<number>();
  totalCount = input.required<number>();
}
