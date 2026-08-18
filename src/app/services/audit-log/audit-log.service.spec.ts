import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService } from "primeng/api";
import { of, throwError } from "rxjs";
import { AuditLogService } from "./audit-log.service";
import { AuditLogDao } from "../../DAO/audit-log/audit-log.dao";
import { AuditLogResponse } from "../../DTO/audit-log.dto";

describe("AuditLogService", () => {
  let service: AuditLogService;
  let dao: AuditLogDao;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), MessageService],
    });
    service = TestBed.inject(AuditLogService);
    dao = TestBed.inject(AuditLogDao);
  });

  const log: AuditLogResponse = { id: 1, username: "admin", action: "LOGIN" };

  it("retrieveList populates the list and stops loading", () => {
    jest.spyOn(dao, "get").mockReturnValue(of([log]));

    service.retrieveList();

    expect(service.model.list()).toEqual([log]);
    expect(service.model.loading()).toBe(false);
  });

  it("retrieveList clears the list and stops loading on error", () => {
    jest.spyOn(dao, "get").mockReturnValue(throwError(() => ({ status: 500 })));

    service.retrieveList();

    expect(service.model.list()).toEqual([]);
    expect(service.model.loading()).toBe(false);
  });

  it("retrieveDetail populates the detail signal", () => {
    jest.spyOn(dao, "get").mockReturnValue(of(log));

    service.retrieveDetail(1);

    expect(service.model.detail()).toEqual(log);
  });
});
