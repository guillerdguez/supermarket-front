import { Component, ElementRef, HostListener, inject, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MenuItem, ConfirmationService } from "primeng/api";
import { MenubarModule } from "primeng/menubar";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { AuthService } from "../../../services/auth/auth.service";
import { NotificationsBellComponent } from "../../shared/notifications-bell/notifications-bell.component";

@Component({
  selector: "app-admin-nav",
  standalone: true,
  imports: [
    RouterLink,
    MenubarModule,
    ButtonModule,
    ConfirmDialogModule,
    NotificationsBellComponent,
  ],
  templateUrl: "./admin-nav.component.html",
  styleUrl: "./admin-nav.component.scss",
})
export class AdminNavComponent {
  private readonly auth = inject(AuthService);
  private readonly confirm = inject(ConfirmationService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  user = this.auth.model.currentUser;

  // PrimeNG's Menubar deja de escuchar clics fuera del menú al colapsar a
  // móvil (su listener interno se desvincula por un effect propio de la
  // librería), así que el cierre por clic externo se maneja aquí.
  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent) {
    const nav = this.elementRef.nativeElement;
    if (nav.contains(event.target as Node)) return;
    const openMenubar = nav.querySelector(".p-menubar.p-menubar-mobile-active");
    if (!openMenubar) return;
    const toggleBtn = openMenubar.querySelector(".p-menubar-button");
    (toggleBtn as HTMLElement | null)?.click();
  }

  isAdmin = computed(() => {
    const r = this.user()?.role;
    return r === "ADMIN" || r === "MANAGER";
  });

  isCashier = computed(() => this.user()?.role === "CASHIER");

  adminItems: MenuItem[] = [
    { label: "Dashboard", icon: "pi pi-home", routerLink: "/admin/dashboard" },
    {
      label: "Catálogo",
      icon: "pi pi-tags",
      items: [
        { label: "Productos", icon: "pi pi-tags", routerLink: "/admin/products" },
        { label: "Inventario", icon: "pi pi-box", routerLink: "/admin/inventory" },
      ],
    },
    {
      label: "Ventas",
      icon: "pi pi-shopping-cart",
      items: [
        { label: "Ventas", icon: "pi pi-shopping-cart", routerLink: "/admin/sales" },
        { label: "Cajas", icon: "pi pi-wallet", routerLink: "/admin/cash-registers" },
      ],
    },
    {
      label: "Organización",
      icon: "pi pi-building",
      items: [
        { label: "Sucursales", icon: "pi pi-building", routerLink: "/admin/branches" },
        { label: "Usuarios", icon: "pi pi-users", routerLink: "/admin/users" },
        { label: "Transferencias", icon: "pi pi-arrows-h", routerLink: "/admin/transfers" },
      ],
    },
    {
      label: "Análisis",
      icon: "pi pi-chart-bar",
      items: [
        { label: "Reportes", icon: "pi pi-chart-bar", routerLink: "/admin/reports" },
        { label: "Auditoría", icon: "pi pi-history", routerLink: "/admin/audit" },
        { label: "Notificaciones", icon: "pi pi-bell", routerLink: "/admin/notifications" },
      ],
    },
  ];

  cashierItems: MenuItem[] = [
    { label: "Dashboard", icon: "pi pi-home", routerLink: "/cashier/dashboard" },
    { label: "Cobrar", icon: "pi pi-desktop", routerLink: "/pos" },
    { label: "Mis ventas", icon: "pi pi-list", routerLink: "/cashier/my-sales" },
    {
      label: "Transferencias",
      icon: "pi pi-arrows-h",
      items: [
        { label: "Ver transferencias", icon: "pi pi-list", routerLink: "/cashier/transfers" },
        { label: "Nueva transferencia", icon: "pi pi-plus", routerLink: "/cashier/transfers/create" },
      ],
    },
    {
      label: "Caja",
      icon: "pi pi-wallet",
      items: [
        { label: "Abrir caja", icon: "pi pi-lock-open", routerLink: "/cashier/open-register" },
        { label: "Cerrar caja", icon: "pi pi-lock", routerLink: "/cashier/close-register" },
      ],
    },
  ];

  logout() {
    this.confirm.confirm({
      message: "¿Seguro que quieres cerrar sesión?",
      header: "Salir",
      icon: "pi pi-sign-out",
      acceptLabel: "Sí, salir",
      rejectLabel: "No",
      acceptButtonStyleClass: "p-button-danger",
      rejectButtonStyleClass: "p-button-text",
      accept: () => this.auth.logout(),
    });
  }
}
