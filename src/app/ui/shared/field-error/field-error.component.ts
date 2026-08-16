import { Component, input } from "@angular/core";

@Component({
  selector: "app-field-error",
  standalone: true,
  template: `
    <small
      class="field-error"
      [class.field-error--visible]="!!message()"
      [id]="id()"
      [attr.role]="message() ? 'alert' : null"
      >{{ message() }}</small
    >
  `,
})
export class FieldErrorComponent {
  id = input.required<string>();
  message = input<string | null>(null);
}
