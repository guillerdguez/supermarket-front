import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService } from "primeng/api";
import { of, throwError } from "rxjs";
import { AuthService, TOKEN_KEY, USER_KEY } from "./auth.service";
import { AuthDao } from "../../DAO/auth/auth.dao";
import { AuthResponse, UserResponse } from "../../DTO/auth.dto";

function fakeJwt(exp: number): string {
  const encode = (obj: unknown) => btoa(JSON.stringify(obj)).replace(/=+$/, "");
  return `${encode({ alg: "none", typ: "JWT" })}.${encode({ exp })}.signature`;
}

describe("AuthService", () => {
  let service: AuthService;
  let dao: AuthDao;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), MessageService],
    });
    service = TestBed.inject(AuthService);
    dao = TestBed.inject(AuthDao);
  });

  const cashier: UserResponse = {
    id: 1,
    username: "cashier1",
    email: "cashier@supermarket.com",
    firstName: "John",
    lastName: "Cashier",
    role: "CASHIER",
  };

  it("login stores the session and navigates to the role's home", () => {
    const response: AuthResponse = { token: fakeJwt(Math.floor(Date.now() / 1000) + 3600), user: cashier };
    jest.spyOn(dao, "login").mockReturnValue(of(response));
    const router = TestBed.inject(Router);
    const navSpy = jest.spyOn(router, "navigateByUrl").mockResolvedValue(true);

    service.login({ email: cashier.email, password: "secret" });

    expect(localStorage.getItem(TOKEN_KEY)).toBe(response.token);
    expect(JSON.parse(localStorage.getItem(USER_KEY)!)).toEqual(cashier);
    expect(service.model.currentUser()).toEqual(cashier);
    expect(navSpy).toHaveBeenCalledWith("/pos");
    expect(service.model.loading()).toBe(false);
  });

  it("stops loading without storing a session when login fails", () => {
    jest.spyOn(dao, "login").mockReturnValue(throwError(() => ({ status: 401 })));

    service.login({ email: cashier.email, password: "wrong" });

    expect(service.model.loading()).toBe(false);
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it("isTokenValid returns false once the token has expired", () => {
    localStorage.setItem(TOKEN_KEY, fakeJwt(Math.floor(Date.now() / 1000) - 3600));

    expect(service.isTokenValid()).toBe(false);
  });

  it("isTokenValid returns true for a token that has not expired", () => {
    localStorage.setItem(TOKEN_KEY, fakeJwt(Math.floor(Date.now() / 1000) + 3600));

    expect(service.isTokenValid()).toBe(true);
  });

  it("homeUrl routes non-cashier roles to the admin dashboard", () => {
    service.model.currentUser.set({ ...cashier, role: "ADMIN" });

    expect(service.homeUrl()).toBe("/admin/dashboard");
  });
});
