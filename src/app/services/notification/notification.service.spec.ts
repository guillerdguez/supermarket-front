import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService } from "primeng/api";
import { of, throwError } from "rxjs";
import { NotificationService } from "./notification.service";
import { NotificationDao } from "../../DAO/notification/notification.dao";
import { NotificationResponse } from "../../DTO/notification.dto";
import { AuthService } from "../auth/auth.service";
import { UserResponse } from "../../DTO/auth.dto";

describe("NotificationService", () => {
  let service: NotificationService;
  let dao: NotificationDao;
  let auth: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), MessageService],
    });
    service = TestBed.inject(NotificationService);
    dao = TestBed.inject(NotificationDao);
    auth = TestBed.inject(AuthService);
  });

  const user: UserResponse = {
    id: 1, username: "cashier1", email: "c@s.com", firstName: "A", lastName: "B", role: "CASHIER",
  };
  const mine: NotificationResponse = { id: 1, message: "Tuya", read: false, userId: 1 };
  const other: NotificationResponse = { id: 2, message: "De otro", read: false, userId: 2 };

  it("keeps only the current user's notifications when the list carries an owner", () => {
    auth.model.currentUser.set(user);
    jest.spyOn(dao, "getAll").mockReturnValue(of([mine, other]));

    service.retrieveList();

    expect(service.model.list()).toEqual([mine]);
  });

  it("keeps every notification when the list has no owner information", () => {
    auth.model.currentUser.set(user);
    const shared: NotificationResponse = { id: 3, message: "Compartida", read: false };
    jest.spyOn(dao, "getAll").mockReturnValue(of([shared]));

    service.retrieveList();

    expect(service.model.list()).toEqual([shared]);
  });

  it("restores the list when a delete fails after the optimistic removal", () => {
    service.model.list.set([mine]);
    jest.spyOn(dao, "delete").mockReturnValue(throwError(() => ({ status: 500 })));

    service.delete(1);

    expect(service.model.list()).toEqual([mine]);
  });
});
