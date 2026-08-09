import { TestBed } from "@angular/core/testing";
import { provideRouter, Router, UrlTree } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService } from "primeng/api";
import { roleGuard } from "./role.guard";
import { AuthService } from "../auth/auth.service";
import { UserResponse } from "../../DTO/auth.dto";

describe("roleGuard", () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
      ],
    }).compileComponents();
  });

  const admin: UserResponse = {
    id: 1,
    username: "admin",
    email: "admin@supermarket.com",
    firstName: "System",
    lastName: "Administrator",
    role: "ADMIN",
  };

  const cashier: UserResponse = {
    id: 3,
    username: "cashier1",
    email: "cashier@supermarket.com",
    firstName: "John",
    lastName: "Cashier",
    role: "CASHIER",
  };

  function run(roles: string[]) {
    const guard = roleGuard(roles);
    return TestBed.runInInjectionContext(() => guard(undefined as never, undefined as never));
  }

  it("redirects to login when there is no authenticated user", () => {
    const result = run(["ADMIN"]);

    const router = TestBed.inject(Router);
    expect((result as UrlTree).toString()).toBe(
      router.createUrlTree(["/auth/login"]).toString(),
    );
  });

  it("allows navigation when the user's role is in the allowed list", () => {
    const auth = TestBed.inject(AuthService);
    auth.model.currentUser.set(admin);

    expect(run(["ADMIN", "MANAGER"])).toBe(true);
  });

  it("redirects to /403 when the user's role is not in the allowed list", () => {
    const auth = TestBed.inject(AuthService);
    auth.model.currentUser.set(cashier);

    const result = run(["ADMIN", "MANAGER"]);

    const router = TestBed.inject(Router);
    expect((result as UrlTree).toString()).toBe(
      router.createUrlTree(["/403"]).toString(),
    );
  });
});
