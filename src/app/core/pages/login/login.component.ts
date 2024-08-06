import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserSearchQuery } from '../../constants/user.query';
import { Routes } from '../../enums/routes.enum';
import { User } from '../../models/users.model';
import { LoggedUserService } from '../../services/logged-user.service';
import { LoginService } from '../../services/login.service';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm!: FormGroup;
  public routes: typeof Routes = Routes;
  showLoading = false;
  passwordVisible = false;
  public todayDate: Date = new Date();
  query: UserSearchQuery = new UserSearchQuery();
  loggeddUser!: User;

  getPasswControl = () => this.loginForm.get('password') as FormControl;

  suscriptions: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _loginService: LoginService,
    private _notificationService: NotificationService,
    private _userService: UserService,
    private _loggedUserService: LoggedUserService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  submitForm(): void {
    if (this.loginForm.valid) {
      this.showLoading = true;
      this.suscriptions.push(
        this._loginService
          .login({
            username: this.loginForm.controls['username'].value,
            password: this.loginForm.controls['password'].value,
            grant_type: 'password',
          })
          .subscribe({
            next: (result: any) => {
              this.showLoading = false;
              localStorage.setItem('auth_token', result.access_token);
              localStorage.setItem('expires_in', result.expires_in);
              localStorage.setItem(
                'nuevo',
                this.loginForm.controls['password'].value == result.tip
                  ? 'true'
                  : 'false'
              );
              localStorage.setItem('tip', result.tip);
              this.checkActivationStatus();
            },
            error: (error) => {
              this.showLoading = false;
              this._notificationService.notificationError(
                'Error de Autenticación',
                'Usuario o Contraseña Inválido, por favor intente de nuevo'
              );
            },
          })
      );
    } else {
      Object.values(this.loginForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  checkActivationStatus() {
    const tip = this._loggedUserService.getLoggedUser().tip;
    this.suscriptions.push(
      this._userService
        .searchBy(this.query.BUSCAR_TIP, {
          tip,
        })
        .subscribe({
          next: (result) => {
            this.loggeddUser = result;
            if (this.loggeddUser.estados?.descripcion == 'ACTIVO') {
              this.router.navigate([this.routes.HOME]);
            } else {
              this._notificationService.notificationError(
                'Error',
                'El Usuario esta desactivado, contacte con el administrador'
              );
            }
          },
          error: (error) => {
            return false;
          },
        })
    );
  }
}
