import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService, ConfirmationService } from "primeng/api";
import { LoginComponent } from "./login.component";
import { AuthService } from "../../../services/auth/auth.service";

describe("LoginComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();
  });

  function create() {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    return fixture;
  }

  it("should create", () => {
    const fixture = create();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("does not call auth.login when email or password is empty", () => {
    const fixture = create();
    const auth = TestBed.inject(AuthService);
    const loginSpy = jest.spyOn(auth, "login").mockImplementation(() => undefined);

    fixture.componentInstance.email = "";
    fixture.componentInstance.password = "";
    fixture.componentInstance.onSubmit();

    expect(loginSpy).not.toHaveBeenCalled();
    expect(fixture.componentInstance.submitted()).toBe(true);
  });

  it("does not call auth.login when password is blank but email is set", () => {
    const fixture = create();
    const auth = TestBed.inject(AuthService);
    const loginSpy = jest.spyOn(auth, "login").mockImplementation(() => undefined);

    fixture.componentInstance.email = "admin@supermarket.com";
    fixture.componentInstance.password = "";
    fixture.componentInstance.onSubmit();

    expect(loginSpy).not.toHaveBeenCalled();
  });

  it("calls auth.login with the trimmed email and the password when both are set", () => {
    const fixture = create();
    const auth = TestBed.inject(AuthService);
    const loginSpy = jest.spyOn(auth, "login").mockImplementation(() => undefined);

    fixture.componentInstance.email = "  admin@supermarket.com  ";
    fixture.componentInstance.password = "password";
    fixture.componentInstance.onSubmit();

    expect(loginSpy).toHaveBeenCalledWith({
      email: "admin@supermarket.com",
      password: "password",
    });
  });

  it("reflects auth.model.loading", () => {
    const fixture = create();
    const auth = TestBed.inject(AuthService);

    expect(fixture.componentInstance.loading()).toBe(false);
    auth.model.loading.set(true);
    expect(fixture.componentInstance.loading()).toBe(true);
  });
});
