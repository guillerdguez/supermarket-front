import { TestBed } from "@angular/core/testing";
import { provideRouter, Router, UrlTree } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService } from "primeng/api";
import { authGuard } from "./auth.guard";
import { AuthService, TOKEN_KEY } from "../auth/auth.service";
import { UserResponse } from "../../DTO/auth.dto";

function fakeJwt(exp: number): string {
  const encode = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/=+$/, "");
  return `${encode({ alg: "none", typ: "JWT" })}.${encode({ exp })}.signature`;
}

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
    localStorage.setItem(
      TOKEN_KEY,
      fakeJwt(Math.floor(Date.now() / 1000) + 3600),
    );
    const auth = TestBed.inject(AuthService);
    auth.model.currentUser.set(user);

    expect(run()).toBe(true);
  });

  it("redirects to login when the token is expired", () => {
    localStorage.setItem(
      TOKEN_KEY,
      fakeJwt(Math.floor(Date.now() / 1000) - 3600),
    );
    const auth = TestBed.inject(AuthService);
    auth.model.currentUser.set(user);

    const result = run();
    expect(result).not.toBe(true);
    const router = TestBed.inject(Router);
    expect((result as UrlTree).toString()).toBe(
      router.createUrlTree(["/auth/login"]).toString(),
    );
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
