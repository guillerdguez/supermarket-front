import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { providePrimeNG } from "primeng/config";
import { MessageService, ConfirmationService } from "primeng/api";
import { PosPreset } from "./theme/styles/pos.preset";
import { routes } from "./app.routes";
import { authInterceptor } from "./services/interceptors/auth.interceptor";
import { errorInterceptor } from "./services/interceptors/error.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimationsAsync(),
    MessageService,
    ConfirmationService,
    providePrimeNG({
      theme: {
        preset: PosPreset,
        options: {
          darkModeSelector: false,
          cssLayer: {
            name: "primeng",
            order: "primeng, app",
          },
        },
      },
    }),
  ],
};
