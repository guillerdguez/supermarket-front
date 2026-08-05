import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
@Component({ selector: "app-admin-profile-redirect", standalone: true, template: "" })
export class AdminProfileRedirectComponent implements OnInit {
  private readonly router = inject(Router);
  ngOnInit() { this.router.navigateByUrl("/account"); }
}
