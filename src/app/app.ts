import { Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { filter, map } from "rxjs";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { AdminNavComponent } from "./ui/wrappers/admin-nav/admin-nav.component";

function isPreviewUrl(): boolean {
  return new URLSearchParams(window.location.search).get("isPreview") === "true";
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule, AdminNavComponent],
  templateUrl: "./app.html",
})
export class App {
  private readonly router = inject(Router);

  // Un popup abierto con ?isPreview=true (ver EditProductComponent) no debe
  // cargar el menú de administración: es una ventana flotante, no una pantalla más.
  isPreview = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => isPreviewUrl()),
    ),
    { initialValue: isPreviewUrl() },
  );
}
