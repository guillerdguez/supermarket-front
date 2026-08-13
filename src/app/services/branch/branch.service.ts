import { Injectable, inject } from "@angular/core";
import { forkJoin } from "rxjs";
import { BranchDao } from "../../DAO/branch/branch.dao";
import { BranchResponse, BranchRequest } from "../../DTO/branch.dto";
import { BranchModel } from "../../model/Domain/branch.model";
import { CrudComponent } from "../../model/Domain/crud-component";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";

@Injectable({ providedIn: "root" })
export class BranchService {
  private readonly dao = inject(BranchDao);
  private readonly messages = inject(MessageProcessingService);
  readonly model = inject(BranchModel);

  retrieveList(): void {
    this.model.loading.set(true);
    this.model.error.set(null);

    this.dao.get().subscribe({
      next: (list) => this.afterRetrieveList((list as BranchResponse[]) ?? []),
      error: (err) => {
        this.model.list.set([]);
        this.model.loading.set(false);
        this.model.error.set(this.messages.resolveErrorDetail("errorGettingBranches", err));
      },
    });
  }

  private afterRetrieveList(list: BranchResponse[]): void {
    this.model.list.set(list);
    this.model.loading.set(false);
  }

  retrieveDetail(id: number): void {
    this.model.editing.set(null);

    this.dao.get(id).subscribe({
      next: (branch) => this.model.editing.set(branch as BranchResponse),
      error: (err) => this.messages.publishErrorMsg("errorGettingBranch", err),
    });
  }

  save(body: BranchRequest, id?: number, component?: CrudComponent): void {
    this.model.loading.set(true);

    if (id != null) {
      this.dao.update(id, body).subscribe({
        next: (updated) => this.afterSave(updated, true, component),
        error: (err) => this.onSaveError("errorUpdatingBranch", err),
      });
    } else {
      this.dao.create(body).subscribe({
        next: (created) => this.afterSave(created, false, component),
        error: (err) => this.onSaveError("errorCreatingBranch", err),
      });
    }
  }

  private afterSave(saved: BranchResponse, isUpdate: boolean, component?: CrudComponent): void {
    this.model.loading.set(false);
    this.model.list.update((list) =>
      list.some((b) => b.id === saved.id)
        ? list.map((b) => (b.id === saved.id ? saved : b))
        : [...list, saved],
    );
    this.messages.publishSuccessMsg(isUpdate ? "branchUpdated" : "branchCreated");
    component?.afterSave?.();
  }

  private onSaveError(key: "errorCreatingBranch" | "errorUpdatingBranch", err: unknown): void {
    this.model.loading.set(false);
    this.model.error.set(this.messages.resolveErrorDetail(key, err));
    this.messages.publishErrorMsg(key, err);
  }

  delete(ids: number | number[], component?: CrudComponent): void {
    const idList = Array.isArray(ids) ? ids : [ids];
    const snapshot = this.model.list();

    this.model.list.set(snapshot.filter((b) => !idList.includes(b.id)));

    forkJoin(idList.map((id) => this.dao.delete(id))).subscribe({
      next: () => {
        this.messages.publishSuccessMsg("branchDeleted");
        component?.afterDelete?.();
      },
      error: (err) => {
        this.model.list.set(snapshot);
        this.messages.publishErrorMsg("errorDeletingBranch", err);
      },
    });
  }
}
