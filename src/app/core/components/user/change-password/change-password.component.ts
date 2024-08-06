import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { UserSearchQuery } from 'src/app/core/constants/user.query';
import { User } from 'src/app/core/models/users.model';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less'],
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  @Input() isMandatory: boolean = true;
  query: UserSearchQuery = new UserSearchQuery();
  user!: User;
  validateForm: FormGroup;
  passwordVisible = false;
  password2Visible = false;

  suscriptions: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private _userService: UserService,
    private _notificationService: NotificationService,
    private modalRef: NzModalRef
  ) {
    this.validateForm = this.fb.group(
      {
        oldPassword: [null, [Validators.required]],
        newPassword: [null, [Validators.required]],
      },
      {
        validator: this.ConfirmedValidator('oldPassword', 'newPassword'),
      }
    );
  }

  get f() {
    return this.validateForm.controls;
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  ngOnInit(): void {
    this.suscriptions.push(
      this._userService
        .searchBy(this.query.BUSCAR_TIP, {
          tip: localStorage.getItem('tip') as string,
        })
        .subscribe({
          next: (result) => {
            this.user = result;
          },
        })
    );
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  submitForm() {
    if (this.validateForm.valid) {
      this.suscriptions.push(
        this._userService
          .pasworChange(this.user.id as number, {
            password: this.validateForm.controls['newPassword'].value,
          })
          .subscribe({
            next: (result) => {
              this._notificationService.notificationSuccess(
                'Notificación',
                'La contraseña ha sido actualizada.'
              );
              this.modalRef.destroy();
            },
            error: (e) => {
              if (e.status == 500) {
                this._notificationService.notificationError(
                  'Error',
                  e.error.message
                );
              }
            },
          })
      );
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  cancel(): void {
    this.modalRef.close();
  }
}
