# 🛒 Supermarket POS — Frontend

Frontend de un sistema de punto de venta (POS) para supermercados con múltiples sucursales: cobro, inventario, transferencias de stock entre sucursales, cierres de caja con detección de discrepancias, reportes de negocio y notificaciones en tiempo real.

Construido con **Angular 20** en modo standalone (sin `NgModule`), usando **señales** (`signal`/`computed`) para todo el estado — sin NgRx ni otro store externo.

**Backend:** [supermarket-back](https://github.com/guillerdguez/supermarket-back) (Spring Boot 3 / Java 17).

<!-- 🔗 Demo en vivo: pendiente — ver "Despliegue" más abajo -->

## 📸 Capturas

| Login | POS — Cobrar | Reportes |
| --- | --- | --- |
| ![Login](docs/screenshots/login.png) | ![POS](docs/screenshots/pos.png) | ![Reportes](docs/screenshots/reports.png) |

| Mis ventas | Notificaciones |
| --- | --- |
| ![Mis ventas](docs/screenshots/my-sales.png) | ![Notificaciones](docs/screenshots/notifications.png) |

## ✨ Funcionalidades

- **Punto de venta**: cobro con carrito, múltiples formas de pago (efectivo, tarjeta, transferencia), impresión de ticket.
- **Catálogo**: productos y sucursales con control de stock por sucursal.
- **Transferencias de stock**: solicitar, aprobar/rechazar, completar transferencias entre sucursales, con historial y estado.
- **Caja registradora**: apertura/cierre de turno con detección automática de superávit/déficit.
- **Ventas**: historial propio (cajero) y listado general (admin), con detalle de líneas y forma de pago en un diálogo, sin salir de la pantalla.
- **Reportes** (admin/manager): ventas por sucursal/cajero/producto, comparativa entre periodos, estado e inventory turnover del inventario, cierres de caja con discrepancias — todos filtrables por fecha y sucursal.
- **Usuarios** (admin): alta/edición, activar/reactivar, cambio de rol independiente.
- **Notificaciones**: alertas de stock bajo, transferencias, discrepancias de caja y ventas canceladas, con deep-link al detalle de la venta/transferencia referenciada.
- **Auditoría**: registro de quién hizo qué y cuándo en operaciones críticas.

## 🛠️ Stack

| Área | Tecnología |
| --- | --- |
| Framework | Angular 20 (standalone components, sin NgModule) |
| Estado | Señales de Angular (`signal`/`computed`), sin store externo |
| UI | PrimeNG + tema propio (`src/app/theme/`) |
| Gráficos | Chart.js |
| HTTP | `HttpClient` con interceptors funcionales (auth, manejo de errores) |
| Tests unitarios | Jest (`jest-preset-angular`) |
| Tests E2E | Cypress |
| Lint | ESLint (flat config) |

## 🚀 Empezar en local

Requisitos: Node.js 20+, y el [backend](https://github.com/guillerdguez/supermarket-back) corriendo en `http://localhost:8080` (ver su README para levantar MySQL/Redis con Docker).

```bash
npm install
npm start
```

Abre `http://localhost:4200`. En desarrollo, `proxy.conf.json` redirige las llamadas a la API hacia `localhost:8080` — no hace falta configurar nada más.

### Credenciales de prueba

La pantalla de login ya muestra credenciales de demo con un botón "Usar" para rellenarlas con un clic:

| Rol | Email | Password |
| --- | --- | --- |
| Admin | `admin@supermarket.com` | `password` |
| Cajero | `cashier@supermarket.com` | `password` |

## 🧪 Tests

```bash
npm run lint       # ESLint
npm test           # Jest en watch
npm run test:ci    # Jest con cobertura
npm run e2e         # Cypress interactivo
npm run e2e:ci       # Cypress headless
```

11 specs E2E cubren login, guards, POS, productos, inventario, sucursales, usuarios, transferencias, caja, reportes y notificaciones (`cypress/e2e/`).

## 🏗️ Arquitectura

```
src/app/
├── DAO/        # Un DAO por dominio — solo HTTP, vía RestPathService (única fuente de URLs)
├── DTO/        # Interfaces con la forma de los datos de la API
├── model/Domain/  # Clases *Model con estado en señales (ProductModel, SaleModel, ...)
├── services/   # Orquestan DAO + Model + mensajes (retrieveList/retrieveDetail/save/delete)
└── ui/         # Un subdirectorio por pantalla (admin/, cashier/, auth/, wrappers/)
```

Flujo típico: el componente llama a `service.retrieveList()` / `service.save()` → el service llama al DAO y actualiza el `Model` → el componente lee del `Model` vía señales. Los mensajes de usuario (toasts) pasan siempre por un catálogo central (`message-keys.ts`), nunca literales sueltos en un service.

## 📦 Build de producción

```bash
npm run build
```

El build de producción usa `src/environments/environment.prod.ts` (vía `fileReplacements` en `angular.json`) para apuntar a la URL del backend desplegado, en vez del proxy de desarrollo.

## ☁️ Despliegue

Pensado para desplegarse como sitio estático (Vercel/Netlify) contra un backend en Railway/Render — ver el README del [backend](https://github.com/guillerdguez/supermarket-back) para esa parte. Antes de desplegar, completar `apiUrl` en `src/environments/environment.prod.ts` con la URL pública del backend.

---

**Autor:** Guillermo — Angular / Frontend Developer
