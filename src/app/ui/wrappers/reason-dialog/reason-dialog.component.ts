import { Component, computed, input, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "pos-reason-dialog",
  standalone: true,
  imports: [FormsModule, DialogModule, ButtonModule],
  templateUrl: "./reason-dialog.component.html",
  styleUrl: "./reason-dialog.component.scss",
})
export class PosReasonDialogComponent {
  visible = input(false);
  visibleChange = output<boolean>();
  header = input.required<string>();
  label = input("Motivo");
  minLength = input(5);
  confirmed = output<string>();

  reason = signal("");

  isValid = computed(() => this.reason().trim().length >= this.minLength());

  onVisibleChange(value: boolean) {
    this.visibleChange.emit(value);
    if (!value) this.reason.set("");
  }

  confirm() {
    if (!this.isValid()) return;
    this.confirmed.emit(this.reason().trim());
    this.reason.set("");
    this.visibleChange.emit(false);
  }

  cancel() {
    this.reason.set("");
    this.visibleChange.emit(false);
  }
}
