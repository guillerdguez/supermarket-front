import { TestBed } from "@angular/core/testing";
import { provideRouter, Router, UrlTree } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService } from "primeng/api";
import { authGuard } from "./auth.guard";
import { AuthService } from "../auth/auth.service";
import { UserResponse } from "../../DTO/auth.dto";

describe("authGuard", () => {
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

  const user: UserResponse = {
    id: 1,
    username: "cashier1",
    email: "cashier@supermarket.com",
    firstName: "John",
    lastName: "Cashier",
    role: "CASHIER",
  };

  function run() {
    return TestBed.runInInjectionContext(() =>
      authGuard(undefined as never, undefined as never),
    );
  }

  it("allows navigation when the user is authenticated", () => {
    const auth = TestBed.inject(AuthService);
    auth.model.currentUser.set(user);

    expect(run()).toBe(true);
  });

  it("redirects to login when there is no authenticated user", () => {
    const result = run();

    expect(result).not.toBe(true);
    const router = TestBed.inject(Router);
    expect((result as UrlTree).toString()).toBe(
      router.createUrlTree(["/auth/login"]).toString(),
    );
  });
});
