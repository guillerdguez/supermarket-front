import { Injectable, inject } from "@angular/core";
import { forkJoin } from "rxjs";
import { UserDao } from "../../DAO/user/user.dao";
import { UserResponse, UserRequest } from "../../DTO/user.dto";
import { UserModel } from "../../model/Domain/user.model";
import { CrudComponent } from "../../model/Domain/crud-component";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";
import { MessageKey } from "../../../util/messageProcessingCenter/message-keys";

@Injectable({ providedIn: "root" })
export class UserService {
  private readonly dao = inject(UserDao);
  private readonly messages = inject(MessageProcessingService);
  readonly model = inject(UserModel);

  retrieveList(username?: string): void {
    this.model.loading.set(true);
    this.model.error.set(null);

    this.dao.get(undefined, username).subscribe({
      next: (list) => this.afterRetrieveList((list as UserResponse[]) ?? []),
      error: (err) => {
        this.model.list.set([]);
        this.model.loading.set(false);
        this.model.error.set(this.messages.resolveErrorDetail("errorGettingUsers", err));
      },
    });
  }

  private afterRetrieveList(list: UserResponse[]): void {
    this.model.list.set(list);
    this.model.loading.set(false);
  }

  retrieveDetail(id: number): void {
    this.model.editing.set(null);

    this.dao.get(id).subscribe({
      next: (user) => this.model.editing.set(user as UserResponse),
      error: (err) => this.messages.publishErrorMsg("errorGettingUser", err),
    });
  }

  save(body: UserRequest, id?: number, component?: CrudComponent): void {
    this.model.loading.set(true);
    this.model.error.set(null);

    if (id != null) {
      this.dao.update(id, body).subscribe({
        next: (updated) => this.afterSave(updated, true, component),
        error: (err) => this.onSaveError("errorUpdatingUser", err),
      });
    } else {
      this.dao.create(body).subscribe({
        next: (created) => this.afterSave(created, false, component),
        error: (err) => this.onSaveError("errorCreatingUser", err),
      });
    }
  }

  private afterSave(saved: UserResponse, isUpdate: boolean, component?: CrudComponent): void {
    this.model.loading.set(false);
    this.model.list.update((list) =>
      list.some((u) => u.id === saved.id)
        ? list.map((u) => (u.id === saved.id ? saved : u))
        : [...list, saved],
    );
    this.messages.publishSuccessMsg(isUpdate ? "userUpdated" : "userCreated");
    component?.afterSave?.();
  }

  private onSaveError(key: "errorCreatingUser" | "errorUpdatingUser", err: unknown): void {
    this.model.loading.set(false);
    this.model.error.set(this.messages.resolveErrorDetail(key, err));
    this.messages.publishErrorMsg(key, err);
  }

  
  delete(ids: number | number[], component?: CrudComponent): void {
    const idList = Array.isArray(ids) ? ids : [ids];
    const snapshot = this.model.list();

    this.model.list.set(snapshot.filter((u) => !idList.includes(u.id)));

    forkJoin(idList.map((id) => this.dao.delete(id))).subscribe({
      next: () => {
        this.messages.publishSuccessMsg("userDeleted");
        component?.afterDelete?.();
      },
      error: (err) => {
        this.model.list.set(snapshot);
        this.messages.publishErrorMsg("errorDeletingUser", err);
      },
    });
  }

  activate(id: number, component?: CrudComponent): void {
    this.dao.activate(id).subscribe({
      next: (updated) => this.applyUpdate(updated, "userActivated", component),
      error: (err) => this.messages.publishErrorMsg("errorActivatingUser", err),
    });
  }

  changeRole(id: number, role: string, component?: CrudComponent): void {
    this.dao.changeRole(id, { role }).subscribe({
      next: (updated) => this.applyUpdate(updated, "userRoleChanged", component),
      error: (err) => this.messages.publishErrorMsg("errorChangingUserRole", err),
    });
  }

  private applyUpdate(updated: UserResponse, successKey: MessageKey, component?: CrudComponent): void {
    this.model.list.update((list) => list.map((u) => (u.id === updated.id ? updated : u)));
    this.messages.publishSuccessMsg(successKey);
    component?.afterSave?.();
  }
}
