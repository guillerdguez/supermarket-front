import { Injectable, inject } from "@angular/core";
import { forkJoin } from "rxjs";
import { NotificationDao } from "../../DAO/notification/notification.dao";
import { NotificationResponse } from "../../DTO/notification.dto";
import { NotificationModel } from "../../model/Domain/notification.model";
import { AuthService } from "../auth/auth.service";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";

@Injectable({ providedIn: "root" })
export class NotificationService {
  private readonly dao = inject(NotificationDao);
  private readonly messages = inject(MessageProcessingService);
  private readonly auth = inject(AuthService);
  readonly model = inject(NotificationModel);

  retrieveList(): void {
    this.model.loading.set(true);

    this.dao.getAll().subscribe({
      next: (list) => this.afterRetrieveList(list ?? []),
      error: (err) => {
        this.model.list.set([]);
        this.model.loading.set(false);
        // 404 = el endpoint no existe; la campana sigue visible igual.
        if (err?.status === 404) this.model.available.set(false);
      },
    });
  }

  private afterRetrieveList(list: NotificationResponse[]): void {
    this.model.list.set(this.mine(list));
    this.model.available.set(true);
    this.model.loading.set(false);
  }

  
  private mine(list: NotificationResponse[]): NotificationResponse[] {
    const uid = this.auth.model.currentUser()?.id;
    if (uid == null) return list;
    const hasOwner = list.some((n) => n.userId != null);
    if (!hasOwner) return list; // el backend ya filtró por token
    return list.filter((n) => n.userId === uid);
  }

  markRead(id: number): void {
    this.dao.markAsRead(id).subscribe({
      next: (updated) =>
        this.model.list.update((list) => list.map((n) => (n.id === id ? updated : n))),
      error: () => undefined,
    });
  }

  markAllRead(): void {
    this.dao.markAllAsRead().subscribe({
      next: () => this.model.list.update((list) => list.map((n) => ({ ...n, read: true }))),
      error: () => undefined,
    });
  }

  delete(ids: number | number[]): void {
    const idList = Array.isArray(ids) ? ids : [ids];
    const snapshot = this.model.list();

    this.model.list.set(snapshot.filter((n) => !idList.includes(n.id)));

    forkJoin(idList.map((id) => this.dao.delete(id))).subscribe({
      error: (err) => {
        this.model.list.set(snapshot);
        this.messages.publishErrorMsg("errorDeletingNotification", err);
      },
    });
  }
}
