import { Injectable, computed, signal } from "@angular/core";
import { NotificationResponse } from "../../DTO/notification.dto";

@Injectable({ providedIn: "root" })
export class NotificationModel {
  readonly list = signal<NotificationResponse[]>([]);
  readonly loading = signal(false);

  readonly available = signal(true);
  readonly unreadCount = computed(() => this.list().filter((n) => !n.read).length);
}
