import { Component, effect, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { AuthService } from "../../services/auth/auth.service";
import { ProfileService } from "../../services/profile/profile.service";
import { ProfileUpdateRequest } from "../../DTO/profile.dto";
import { PosPanelComponent } from "../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../wrappers/page-shell/page-shell.component";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonModule, PosPanelComponent, PosPageShellComponent],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
})
export class ProfileComponent implements OnInit {
  private readonly profileSvc = inject(ProfileService);
  private readonly auth = inject(AuthService);

  loading = this.profileSvc.model.loading;
  form: ProfileUpdateRequest = { username: "", firstName: "", lastName: "" };
  email = "";
  role = "";
  branchName = "";

  constructor() {
    effect(() => {
      const profile = this.profileSvc.model.profile();
      if (!profile) return;
      this.form = {
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
      };
      this.email = profile.email;
      this.role = profile.role;
      this.branchName = profile.branchName ?? "";
    });
  }

  ngOnInit() {
    this.profileSvc.retrieveDetail();
  }

  onSubmit() {
    if (!this.form.username.trim() || !this.form.firstName.trim() || !this.form.lastName.trim()) {
      return;
    }
    this.profileSvc.save(this.form);
  }

  backLink(): string {
    return this.auth.model.currentUser()?.role === "CASHIER"
      ? "/cashier/dashboard"
      : "/admin/dashboard";
  }
}
