import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { NotificationResponse } from "../../DTO/notification.dto";
import { RestPathService } from "../../../util/restPath/rest-path.service";

@Injectable({ providedIn: "root" })
export class NotificationDao {
  private readonly http = inject(HttpClient);
  private readonly url = inject(RestPathService);

  getAll(): Observable<NotificationResponse[]> {
    return this.http.get<NotificationResponse[]>(this.url.notificationsAll());
  }

  markAsRead(id: number): Observable<NotificationResponse> {
    return this.http.put<NotificationResponse>(this.url.notificationRead(id), {});
  }

  markAllAsRead(): Observable<Record<string, number>> {
    return this.http.put<Record<string, number>>(this.url.notificationsMarkAllRead(), {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.url.notificationsCrud(id));
  }
}
