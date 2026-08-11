import { Routes } from "@angular/router";
import { authGuard } from "./services/guards/auth.guard";
import { roleGuard } from "./services/guards/role.guard";

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "auth/login" },
  {
    path: "auth/login",
    loadComponent: () =>
      import("./ui/auth/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "admin/dashboard",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER"])],
    loadComponent: () =>
      import("./ui/admin/dashboard/dashboard.component").then((m) => m.AdminDashboardComponent),
  },
  {
    path: "admin/inventory",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER"])],
    loadComponent: () =>
      import("./ui/admin/inventory/inventory.component").then((m) => m.InventoryComponent),
  },
  {
    path: "admin/products",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER"])],
    loadComponent: () =>
      import("./ui/admin/product/product.component").then((m) => m.ProductComponent),
  },
  {
    path: "admin/products/create",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER"])],
    loadComponent: () =>
      import("./ui/admin/product/form/product-form.component").then((m) => m.ProductFormComponent),
  },
  {
    path: "admin/products/edit/:id",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER"])],
    loadComponent: () =>
      import("./ui/admin/product/form/product-form.component").then((m) => m.ProductFormComponent),
  },
  {
    path: "admin/branches",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER"])],
    loadComponent: () =>
      import("./ui/admin/branch/branch.component").then((m) => m.BranchComponent),
  },
  {
    path: "admin/branches/create",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER"])],
    loadComponent: () =>
      import("./ui/admin/branch/form/branch-form.component").then((m) => m.BranchFormComponent),
  },
  {
    path: "admin/branches/edit/:id",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER"])],
    loadComponent: () =>
      import("./ui/admin/branch/form/branch-form.component").then((m) => m.BranchFormComponent),
  },
  {
    path: "admin/users",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER"])],
    loadComponent: () =>
      import("./ui/admin/user/user.component").then((m) => m.UserComponent),
  },
  {
    path: "admin/users/create",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER"])],
    loadComponent: () =>
      import("./ui/admin/user/form/user-form.component").then((m) => m.UserFormComponent),
  },
  {
    path: "admin/users/edit/:id",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER"])],
    loadComponent: () =>
      import("./ui/admin/user/form/user-form.component").then((m) => m.UserFormComponent),
  },
  {
    path: "admin/sales",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER"])],
    loadComponent: () =>
      import("./ui/admin/sale/sale.component").then((m) => m.SaleComponent),
  },
  {
    path: "admin/transfers",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER"])],
    loadComponent: () =>
      import("./ui/admin/transfer/transfer.component").then((m) => m.TransferComponent),
  },
  {
    path: "admin/transfers/create",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER"])],
    loadComponent: () =>
      import("./ui/admin/transfer/create/create-transfer.component").then((m) => m.CreateTransferComponent),
  },
  {
    path: "admin/reports",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER"])],
    loadComponent: () =>
      import("./ui/admin/report/report.component").then((m) => m.ReportComponent),
  },
  {
    path: "admin/audit",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER"])],
    loadComponent: () =>
      import("./ui/admin/audit-log/audit-log.component").then((m) => m.AuditLogComponent),
  },
  {
    path: "admin/cash-registers",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER"])],
    loadComponent: () =>
      import("./ui/admin/cash-register/cash-register.component").then((m) => m.CashRegisterComponent),
  },
  {
    path: "admin/notifications",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER"])],
    loadComponent: () =>
      import("./ui/admin/notification/notification.component").then((m) => m.NotificationComponent),
  },
  // Ruta separada (sin restricción de rol) para que cajeros lleguen a la misma pantalla
  // desde la campana de notificaciones, que es visible para cualquier usuario autenticado.
  {
    path: "notifications",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./ui/admin/notification/notification.component").then((m) => m.NotificationComponent),
  },
  {
    path: "cashier/dashboard",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER", "CASHIER"])],
    loadComponent: () =>
      import("./ui/cashier/dashboard/dashboard.component").then((m) => m.CashierDashboardComponent),
  },
  {
    path: "cashier/open-register",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER", "CASHIER"])],
    loadComponent: () =>
      import("./ui/cashier/open-register/open-register.component").then((m) => m.OpenRegisterComponent),
  },
  {
    path: "cashier/close-register",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER", "CASHIER"])],
    loadComponent: () =>
      import("./ui/cashier/close-register/close-register.component").then((m) => m.CloseRegisterComponent),
  },
  {
    path: "cashier/my-sales",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER", "CASHIER"])],
    loadComponent: () =>
      import("./ui/cashier/my-sales/my-sales.component").then((m) => m.MySalesComponent),
  },
  {
    path: "cashier/transfers",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER", "CASHIER"])],
    loadComponent: () =>
      import("./ui/cashier/transfer/transfer.component").then((m) => m.CashierTransferComponent),
  },
  {
    path: "cashier/transfers/create",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER", "CASHIER"])],
    loadComponent: () =>
      import("./ui/cashier/transfer/create/create-transfer.component").then(
        (m) => m.CashierCreateTransferComponent,
      ),
  },
  {
    path: "pos",
    canActivate: [authGuard, roleGuard(["ADMIN", "MANAGER", "CASHIER"])],
    loadComponent: () =>
      import("./ui/pos/pos.component").then((m) => m.PosComponent),
  },
  {
    path: "account",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./ui/profile/profile.component").then((m) => m.ProfileComponent),
  },
  {
    path: "account/password",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./ui/profile/change-password/change-password.component").then((m) => m.ChangePasswordComponent),
  },
  {
    path: "403",
    loadComponent: () =>
      import("./ui/errors/forbidden/forbidden.component").then((m) => m.ForbiddenComponent),
  },
  {
    path: "**",
    loadComponent: () =>
      import("./ui/errors/not-found/not-found.component").then((m) => m.NotFoundComponent),
  },
];
