import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService } from "primeng/api";
import { of, throwError } from "rxjs";
import { BranchService } from "./branch.service";
import { BranchDao } from "../../DAO/branch/branch.dao";
import { BranchResponse } from "../../DTO/branch.dto";
import { CrudComponent } from "../../model/Domain/crud-component";

describe("BranchService", () => {
  let service: BranchService;
  let dao: BranchDao;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), MessageService],
    });
    service = TestBed.inject(BranchService);
    dao = TestBed.inject(BranchDao);
  });

  const branch: BranchResponse = { id: 1, name: "Centro", address: "Calle Mayor 1" };

  it("creates a branch, appends it to the list and notifies the component", () => {
    jest.spyOn(dao, "create").mockReturnValue(of(branch));
    const component: CrudComponent = { afterSave: jest.fn() };

    service.save({ name: branch.name, address: branch.address! }, undefined, component);

    expect(service.model.list()).toEqual([branch]);
    expect(service.model.loading()).toBe(false);
    expect(component.afterSave).toHaveBeenCalled();
  });

  it("sets a readable error and stops loading when saving fails", () => {
    jest.spyOn(dao, "update").mockReturnValue(throwError(() => ({ status: 400 })));

    service.save({ name: branch.name, address: branch.address! }, 1);

    expect(service.model.loading()).toBe(false);
    expect(service.model.error()).toBeTruthy();
  });

  it("restores the list when a delete fails after the optimistic removal", () => {
    service.model.list.set([branch]);
    jest.spyOn(dao, "delete").mockReturnValue(throwError(() => ({ status: 500 })));

    service.delete(1);

    expect(service.model.list()).toEqual([branch]);
  });
});
