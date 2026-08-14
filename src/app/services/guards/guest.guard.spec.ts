import { TestBed } from "@angular/core/testing";
import { provideRouter, Router, UrlTree } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService } from "primeng/api";
import { guestGuard } from "./guest.guard";
import { AuthService, TOKEN_KEY } from "../auth/auth.service";
import { UserResponse } from "../../DTO/auth.dto";

function fakeJwt(exp: number): string {
  const encode = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/=+$/, "");
  return `${encode({ alg: "none", typ: "JWT" })}.${encode({ exp })}.signature`;
}

describe("guestGuard", () => {
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

  function run() {
    return TestBed.runInInjectionContext(() => guestGuard());
  }

  it("allows navigation to login when there is no authenticated user", () => {
    expect(run()).toBe(true);
  });

  it("allows navigation to login when the token is expired", () => {
    localStorage.setItem(
      TOKEN_KEY,
      fakeJwt(Math.floor(Date.now() / 1000) - 3600),
    );

    expect(run()).toBe(true);
  });

  it("redirects an authenticated ADMIN away from login", () => {
    localStorage.setItem(
      TOKEN_KEY,
      fakeJwt(Math.floor(Date.now() / 1000) + 3600),
    );
    const auth = TestBed.inject(AuthService);
    const user: UserResponse = {
      id: 1,
      username: "admin1",
      email: "admin@supermarket.com",
      firstName: "Ana",
      lastName: "Admin",
      role: "ADMIN",
    };
    auth.model.currentUser.set(user);

    const result = run();
    expect(result).not.toBe(true);
    const router = TestBed.inject(Router);
    expect((result as UrlTree).toString()).toBe(
      router.createUrlTree(["/admin/dashboard"]).toString(),
    );
  });

  it("redirects an authenticated CASHIER away from login", () => {
    localStorage.setItem(
      TOKEN_KEY,
      fakeJwt(Math.floor(Date.now() / 1000) + 3600),
    );
    const auth = TestBed.inject(AuthService);
    const user: UserResponse = {
      id: 2,
      username: "cashier1",
      email: "cashier@supermarket.com",
      firstName: "John",
      lastName: "Cashier",
      role: "CASHIER",
    };
    auth.model.currentUser.set(user);

    const result = run();
    expect(result).not.toBe(true);
    const router = TestBed.inject(Router);
    expect((result as UrlTree).toString()).toBe(
      router.createUrlTree(["/pos"]).toString(),
    );
  });
});
