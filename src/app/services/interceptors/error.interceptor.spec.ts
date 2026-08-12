import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";
import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService } from "primeng/api";
import { errorInterceptor } from "./error.interceptor";
import { TOKEN_KEY, USER_KEY } from "../auth/auth.service";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";

describe("errorInterceptor", () => {
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        MessageService,
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it("clears the session, warns and redirects to login on a 401", () => {
    localStorage.setItem(TOKEN_KEY, "some-token");
    localStorage.setItem(USER_KEY, JSON.stringify({ id: 1 }));
    const router = TestBed.inject(Router);
    const navSpy = jest.spyOn(router, "navigateByUrl").mockResolvedValue(true);
    const messages = TestBed.inject(MessageProcessingService);
    const warnSpy = jest.spyOn(messages, "publishWarnMsg").mockImplementation(() => undefined);

    http.get("/products").subscribe({ error: () => undefined });
    controller.expectOne("/products").flush(null, { status: 401, statusText: "Unauthorized" });

    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(USER_KEY)).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith("sessionExpired");
    expect(navSpy).toHaveBeenCalledWith("/auth/login");
  });

  it("does not touch the session on a 401 from the login endpoint itself", () => {
    localStorage.setItem(TOKEN_KEY, "some-token");
    const router = TestBed.inject(Router);
    const navSpy = jest.spyOn(router, "navigateByUrl").mockResolvedValue(true);

    http.post("/api/auth/login", {}).subscribe({ error: () => undefined });
    controller
      .expectOne("/api/auth/login")
      .flush(null, { status: 401, statusText: "Unauthorized" });

    expect(localStorage.getItem(TOKEN_KEY)).toBe("some-token");
    expect(navSpy).not.toHaveBeenCalled();
  });

  it("leaves other error statuses untouched", () => {
    localStorage.setItem(TOKEN_KEY, "some-token");
    const router = TestBed.inject(Router);
    const navSpy = jest.spyOn(router, "navigateByUrl").mockResolvedValue(true);

    http.get("/products").subscribe({ error: () => undefined });
    controller.expectOne("/products").flush(null, { status: 500, statusText: "Server Error" });

    expect(localStorage.getItem(TOKEN_KEY)).toBe("some-token");
    expect(navSpy).not.toHaveBeenCalled();
  });

  it("shows a toast and redirects to /403 on a 403 from a GET request", () => {
    const router = TestBed.inject(Router);
    const navSpy = jest.spyOn(router, "navigateByUrl").mockResolvedValue(true);
    const messages = TestBed.inject(MessageProcessingService);
    const errorSpy = jest.spyOn(messages, "publishErrorMsg").mockImplementation(() => undefined);

    http.get("/products").subscribe({ error: () => undefined });
    controller.expectOne("/products").flush(null, { status: 403, statusText: "Forbidden" });

    expect(errorSpy).toHaveBeenCalledWith("accessDenied");
    expect(navSpy).toHaveBeenCalledWith("/403");
  });

  it("shows a toast but does not redirect on a 403 from a non-GET request", () => {
    const router = TestBed.inject(Router);
    const navSpy = jest.spyOn(router, "navigateByUrl").mockResolvedValue(true);
    const messages = TestBed.inject(MessageProcessingService);
    const errorSpy = jest.spyOn(messages, "publishErrorMsg").mockImplementation(() => undefined);

    http.delete("/products/1").subscribe({ error: () => undefined });
    controller.expectOne("/products/1").flush(null, { status: 403, statusText: "Forbidden" });

    expect(errorSpy).toHaveBeenCalledWith("accessDenied");
    expect(navSpy).not.toHaveBeenCalled();
  });
});
