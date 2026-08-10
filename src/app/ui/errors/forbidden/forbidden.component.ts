import { Component, computed, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { AuthService } from "../../../services/auth/auth.service";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";

@Component({
  selector: "app-forbidden",
  standalone: true,
  imports: [RouterLink, ButtonModule, PosPageShellComponent],
  templateUrl: "./forbidden.component.html",
})
export class ForbiddenComponent {
  private readonly auth = inject(AuthService);

  isAuthenticated = this.auth.model.isAuthenticated;
  homeUrl = computed(() => this.auth.homeUrl());
}
