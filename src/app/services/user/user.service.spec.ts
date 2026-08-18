import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService } from "primeng/api";
import { of, throwError } from "rxjs";
import { UserService } from "./user.service";
import { UserDao } from "../../DAO/user/user.dao";
import { UserResponse } from "../../DTO/user.dto";
import { CrudComponent } from "../../model/Domain/crud-component";

describe("UserService", () => {
  let service: UserService;
  let dao: UserDao;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), MessageService],
    });
    service = TestBed.inject(UserService);
    dao = TestBed.inject(UserDao);
  });

  const user: UserResponse = {
    id: 1, username: "cashier1", email: "c@s.com", firstName: "A", lastName: "B", role: "CASHIER",
  };

  it("creates a user, appends it to the list and notifies the component", () => {
    jest.spyOn(dao, "create").mockReturnValue(of(user));
    const component: CrudComponent = { afterSave: jest.fn() };

    service.save({ username: user.username, email: user.email, firstName: "A", lastName: "B" }, undefined, component);

    expect(service.model.list()).toEqual([user]);
    expect(component.afterSave).toHaveBeenCalled();
  });

  it("sets a readable error and stops loading when saving fails", () => {
    jest.spyOn(dao, "update").mockReturnValue(throwError(() => ({ status: 400 })));

    service.save({ username: user.username, email: user.email, firstName: "A", lastName: "B" }, 1);

    expect(service.model.loading()).toBe(false);
    expect(service.model.error()).toBeTruthy();
  });

  it("restores the list when a delete fails after the optimistic removal", () => {
    service.model.list.set([user]);
    jest.spyOn(dao, "delete").mockReturnValue(throwError(() => ({ status: 500 })));

    service.delete(1);

    expect(service.model.list()).toEqual([user]);
  });

  it("changeRole replaces the user in the list with the updated version", () => {
    const promoted = { ...user, role: "MANAGER" };
    jest.spyOn(dao, "changeRole").mockReturnValue(of(promoted));
    service.model.list.set([user]);
    const component: CrudComponent = { afterSave: jest.fn() };

    service.changeRole(1, "MANAGER", component);

    expect(service.model.list()).toEqual([promoted]);
    expect(component.afterSave).toHaveBeenCalled();
  });
});
