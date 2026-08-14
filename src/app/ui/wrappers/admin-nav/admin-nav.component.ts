import {
  Component,
  ElementRef,
  HostListener,
  inject,
  computed,
  effect,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { MenuItem, ConfirmationService } from "primeng/api";
import { MenubarModule } from "primeng/menubar";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { AuthService } from "../../../services/auth/auth.service";
import { CashRegisterService } from "../../../services/cash-register/cash-register.service";
import { NotificationsBellComponent } from "../../shared/notifications-bell/notifications-bell.component";

@Component({
  selector: "app-admin-nav",
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
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
  private readonly cash = inject(CashRegisterService);
  private readonly confirm = inject(ConfirmationService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  user = this.auth.model.currentUser;
  branchName = this.auth.model.branchName;
  registerCurrent = this.cash.model.current;
  registerOpen = this.cash.model.isOpen;

  private fetchedBranch: number | null = null;

  constructor() {
    effect(() => {
      const branch = this.auth.model.branchId();
      if (this.isCashier() && branch != null && branch !== this.fetchedBranch) {
        this.fetchedBranch = branch;
        this.cash.retrieveCurrent(branch);
      }
    });
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent) {
    const nav = this.elementRef.nativeElement;
    if (nav.contains(event.target as Node)) return;
    const openMenubar = nav.querySelector(".p-menubar.p-menubar-mobile-active");
    if (!openMenubar) return;
    const toggleBtn = openMenubar.querySelector(".p-menubar-button");
    (toggleBtn as HTMLElement | null)?.click();
  }

  private readonly role = computed(() => this.user()?.role);

  isAdmin = computed(
    () => this.role() === "ADMIN" || this.role() === "MANAGER",
  );
  isSuperAdmin = computed(() => this.role() === "ADMIN");

  isCashier = computed(() => this.user()?.role === "CASHIER");

  adminItems = computed<MenuItem[]>(() => [
    { label: "Dashboard", icon: "pi pi-home", routerLink: "/admin/dashboard" },
    {
      label: "Catálogo",
      icon: "pi pi-tags",
      items: [
        {
          label: "Productos",
          icon: "pi pi-tags",
          routerLink: "/admin/products",
        },
        {
          label: "Inventario",
          icon: "pi pi-box",
          routerLink: "/admin/inventory",
        },
      ],
    },
    {
      label: "Ventas",
      icon: "pi pi-shopping-cart",
      items: [
        {
          label: "Ventas",
          icon: "pi pi-shopping-cart",
          routerLink: "/admin/sales",
        },
        {
          label: "Cajas",
          icon: "pi pi-wallet",
          routerLink: "/admin/cash-registers",
        },
      ],
    },
    {
      label: "Organización",
      icon: "pi pi-building",
      items: [
        {
          label: "Sucursales",
          icon: "pi pi-building",
          routerLink: "/admin/branches",
        },
        ...(this.isSuperAdmin()
          ? [
              {
                label: "Usuarios",
                icon: "pi pi-users",
                routerLink: "/admin/users",
              },
            ]
          : []),
        {
          label: "Transferencias",
          icon: "pi pi-arrows-h",
          routerLink: "/admin/transfers",
        },
      ],
    },
    {
      label: "Análisis",
      icon: "pi pi-chart-bar",
      items: [
        {
          label: "Reportes",
          icon: "pi pi-chart-bar",
          routerLink: "/admin/reports",
        },
        ...(this.isSuperAdmin()
          ? [
              {
                label: "Auditoría",
                icon: "pi pi-history",
                routerLink: "/admin/audit",
              },
            ]
          : []),
        {
          label: "Notificaciones",
          icon: "pi pi-bell",
          routerLink: "/admin/notifications",
        },
      ],
    },
  ]);

  cashierItems = computed<MenuItem[]>(() => [
    { label: "Cobrar", icon: "pi pi-desktop", routerLink: "/pos" },
    {
      label: "Mis ventas",
      icon: "pi pi-list",
      routerLink: "/cashier/my-sales",
    },
    {
      label: "Transferencias",
      icon: "pi pi-arrows-h",
      routerLink: "/cashier/transfers",
    },
    this.registerOpen()
      ? {
          label: "Cerrar caja",
          icon: "pi pi-lock",
          routerLink: "/cashier/close-register",
        }
      : {
          label: "Abrir caja",
          icon: "pi pi-lock-open",
          routerLink: "/cashier/open-register",
          styleClass: "cashier-primary-action",
        },
  ]);

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
