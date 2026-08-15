import { Component, inject, OnInit, signal, HostListener, computed } from "@angular/core";
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { NotificationService } from "../../../services/notification/notification.service";
import { AuthService } from "../../../services/auth/auth.service";

@Component({
  selector: "app-notifications-bell",
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: "./notifications-bell.component.html",
  styleUrl: "./notifications-bell.component.scss",
})
export class NotificationsBellComponent implements OnInit {
  private readonly svc = inject(NotificationService);
  private readonly auth = inject(AuthService);

  items = this.svc.model.list;
  unreadCount = this.svc.model.unreadCount;
  available = this.svc.model.available;
  open = signal(false);

  
  notificationsLink = computed(() => {
    const r = this.auth.model.currentUser()?.role;
    return r === "ADMIN" || r === "MANAGER" ? "/admin/notifications" : "/notifications";
  });

  recentItems = computed(() => this.items().slice(0, 8));

  ngOnInit() {
    this.svc.retrieveList();
  }

  toggle(event?: Event) {
    event?.stopPropagation();
    this.open.update((v) => !v);
  }

  close() {
    this.open.set(false);
  }

  markRead(id: number) {
    this.svc.markRead(id);
  }

  markAll() {
    this.svc.markAllRead();
  }

  @HostListener("document:click")
  onDocClick() {
    if (this.open()) this.close();
  }
}
