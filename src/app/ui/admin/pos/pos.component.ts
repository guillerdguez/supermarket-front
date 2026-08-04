import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
@Component({ selector: "app-admin-pos-redirect", standalone: true, template: "" })
export class AdminPosRedirectComponent implements OnInit {
  private readonly router = inject(Router);
  ngOnInit() { this.router.navigateByUrl("/pos"); }
}
