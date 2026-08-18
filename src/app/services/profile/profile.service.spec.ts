import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService } from "primeng/api";
import { of, throwError } from "rxjs";
import { ProfileService } from "./profile.service";
import { ProfileDao } from "../../DAO/profile/profile.dao";
import { UserResponse } from "../../DTO/auth.dto";
import { AuthService } from "../auth/auth.service";
import { CrudComponent } from "../../model/Domain/crud-component";

describe("ProfileService", () => {
  let service: ProfileService;
  let dao: ProfileDao;
  let auth: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), MessageService],
    });
    service = TestBed.inject(ProfileService);
    dao = TestBed.inject(ProfileDao);
    auth = TestBed.inject(AuthService);
  });

  const profile: UserResponse = {
    id: 1, username: "admin1", email: "admin@s.com", firstName: "A", lastName: "B", role: "ADMIN",
  };

  it("retrieveDetail stores the profile and syncs it into the current auth user", () => {
    jest.spyOn(dao, "get").mockReturnValue(of(profile));

    service.retrieveDetail();

    expect(service.model.profile()).toEqual(profile);
    expect(auth.model.currentUser()).toEqual(profile);
    expect(service.model.loading()).toBe(false);
  });

  it("stops loading and publishes an error when saving fails", () => {
    jest.spyOn(dao, "update").mockReturnValue(throwError(() => ({ status: 400 })));

    service.save({ username: "admin1", firstName: "A", lastName: "B", email: "admin@s.com" });

    expect(service.model.loading()).toBe(false);
  });

  it("changePassword notifies the component on success", () => {
    jest.spyOn(dao, "changePassword").mockReturnValue(of({}));
    const component: CrudComponent = { afterSave: jest.fn() };

    service.changePassword({ currentPassword: "old", newPassword: "new" }, component);

    expect(component.afterSave).toHaveBeenCalled();
    expect(service.model.loading()).toBe(false);
  });
});
