import { Component, input } from "@angular/core";

@Component({
  selector: "app-field-error",
  standalone: true,
  template: `
    @if (message()) {
      <small class="field-error" [id]="id()" role="alert">{{ message() }}</small>
    }
  `,
})
export class FieldErrorComponent {
  id = input.required<string>();
  message = input<string | null>(null);
}
