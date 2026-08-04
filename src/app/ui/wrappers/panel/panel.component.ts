import { Component, input, output } from "@angular/core";

@Component({
  selector: "pos-panel",
  standalone: true,
  templateUrl: "./panel.component.html",
  styleUrl: "./panel.component.scss",
})
export class PosPanelComponent {
  title = input("");
  showSettings = input(false);
  settingsClick = output<void>();
}
