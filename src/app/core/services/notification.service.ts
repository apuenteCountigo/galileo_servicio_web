import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  constructor(private notifServ: NzNotificationService) {}

  notificationSuccess(title: string, msg: string): void {
    this.notifServ.create('success', title, msg);
  };

  notificationInfo(title: string, msg: string): void {
    this.notifServ.create('info', title, msg);
  };

  notificationWarning(title: string, msg: string): void {
    this.notifServ.create('warning', title, msg);
  };

  notificationError(title: string, msg: string): void {
    this.notifServ.create('error', title, msg);
  };
}
