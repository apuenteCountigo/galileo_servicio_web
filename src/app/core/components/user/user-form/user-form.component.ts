import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageParam } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { firstValueFrom } from 'rxjs';
import { Estados } from 'src/app/core/enums/estados.enum';
import { FrmActions } from 'src/app/core/enums/form-acctios';
import { LoggedUserRole } from 'src/app/core/enums/user-role.enum';
import { Estado } from 'src/app/core/models/estado.model';
import { Empleo, Rol } from 'src/app/core/models/momencaldores.model';
import { User } from 'src/app/core/models/users.model';
import { LoggedUserService } from 'src/app/core/services/logged-user.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UnitUserRelationService } from 'src/app/core/services/unit-user-relation.service';
import { UserService } from 'src/app/core/services/user.service';
import { validatePhoneNumber } from 'src/app/core/utils/validate-phone';

export interface ButtonInterface {
  label: string;
  icon: string;
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.less'],
})
export class UserFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() userToEdit?: User;
  @Input() userPerfiles!: Rol[];
  @Input() empleosList!: Empleo[];

  formModalUser: FormGroup;
  params: PageParam = {
    page: 0,
    size: 1000,
  };

  button: ButtonInterface = {
    label: 'AGREGAR',
    icon: 'plus',
  };

  searchCriteria = {
    tip: '',
    nombre: '',
    apellidos: '',
    fechaInicio: '',
    fechaFin: '',
    email: '',
    perfil: 0,
  };

  buttonSending = false;

  selectedPerfil = this.userToEdit?.perfil;

  // userPerfiles = [...listOfPerfiles];

  userEstado = [
    {
      tipoEntidad: {
        descripcion: 'USUARIOS',
        id: 2,
      },
      descripcion: 'DESACTIVADO',
      id: 2,
    },
    {
      id: 2,
      descripcion: 'ACTIVO',
    },
  ];

  suscriptions: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private _userService: UserService,
    private _notificationService: NotificationService,
    private _loggedUserService: LoggedUserService,
    private _unitUserRelationService: UnitUserRelationService,
    private modalService: NzModalService
  ) {
    this.formModalUser = this.fb.group({
      tip: [
        '',
        [Validators.required, Validators.pattern, Validators.maxLength],
      ],
      nombre: ['', [Validators.required, Validators.pattern]],
      apellidos: ['', [Validators.required, Validators.pattern]],
      contacto: ['', [Validators.required, Validators.pattern]],
      email: ['', [Validators.pattern, Validators.required]],
      perfil: [{}, [Validators.required]],
      empleos: ['', [Validators.required]],
      observaciones: ['', []],
    });
  }

  ngAfterViewInit(): void {
    if (this.userToEdit) {
      this.button.label = 'EDITAR';
      this.button.icon = 'edit';
      this.formModalUser.controls['tip'].setValue(this.userToEdit!.tip);
      this.formModalUser.controls['nombre'].setValue(this.userToEdit!.nombre);
      this.formModalUser.controls['apellidos'].setValue(
        this.userToEdit!.apellidos
      );
      this.formModalUser.controls['contacto'].setValue(
        this.userToEdit!.contacto
      );

      this.formModalUser.controls['email'].setValue(this.userToEdit!.email);
      this.formModalUser.controls['perfil'].setValue(
        this.userPerfiles.find(
          (perfil) => perfil.id === this.userToEdit?.perfil.id
        )
      );
      this.formModalUser.controls['empleos'].setValue(
        this.empleosList.find(
          (empleo) => empleo.id === this.userToEdit?.empleos.id
        )
      );
      this.formModalUser.controls['observaciones'].setValue(
        this.userToEdit!.observaciones
      );
      // this.formModalUser.controls['password'].setValue(
      //   this.userToEdit!.password
      // );
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  checkForm() {
    return this.formModalUser.invalid ? true : false;
  }

  async createUser(newUser: User) {
    return await firstValueFrom(this._userService.create(newUser));
  }

  submitForm() {
    this.buttonSending = true;
    const newUser = { ...this.userToEdit } as User;
    newUser.tip = this.formModalUser.value.tip;
    newUser.nombre = this.formModalUser.value.nombre;
    newUser.apellidos = this.formModalUser.value.apellidos;
    newUser.contacto = this.formModalUser.value.contacto;
    newUser.email = this.formModalUser.value.email.toLowerCase();
    newUser.perfil = new Rol();
    newUser.perfil.id = this.formModalUser.value.perfil.id;
    newUser.empleos = new Empleo();
    newUser.empleos!.id = this.formModalUser.value.empleos.id;
    newUser.certificado = 'acf';
    newUser.password = this.userToEdit
      ? this.userToEdit.password
      : this.formModalUser.value.tip;
    // if (!this.userToEdit) {
    //   newUser.password = this.formModalUser.value.tip;
    // } else {
    //   newUser.password = this.formModalUser.value.password;
    // }
    newUser.observaciones = this.formModalUser.value.observaciones;
    newUser.estados = this.userToEdit?.estados
      ? this.userToEdit?.estados
      : (this.userEstado[1] as Estado);

    if (!this.userToEdit) {
      this.createUser(newUser)
        .then((u) => {
          if (
            this._loggedUserService.getLoggedUser().perfil.descripcion ==
            LoggedUserRole.UNIT_ADMIN
          ) {
            this._loggedUserService.getUnit().then((resp) => {
              const unidad = resp.resources[0].unidad;
              const userCreated = u as User;
              const newUnitUser = {
                usuario: { id: userCreated.id },
                unidad: { id: unidad!.id },
                estado: { id: Estados.PERMANENTE },
                expira: '',
              };
              this.suscriptions.push(
                this._unitUserRelationService.create(newUnitUser).subscribe({
                  next: () => {
                    this.buttonSending = false;
                    this._notificationService.notificationSuccess(
                      'Información',
                      'Se ha insertado el usuario correctamente'
                    );
                    this.modalRef.close({
                      accion: FrmActions.AGREGAR,
                    });
                  },
                  error: (err) => {
                    this.buttonSending = false;
                    this._notificationService.notificationError(
                      'Error',
                      'Se ha insertado el usuario correctamente, pero no se ha podido asignar a la unidad, contacte con el super administrador del sistema'
                    );
                  },
                })
              );
            });
          } else {
            this.buttonSending = false;
            this.modalRef.close({
              accion: FrmActions.AGREGAR,
            });
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha insertado el usuario correctamente'
            );
          }
        })
        .catch((error) => {
          this.buttonSending = false;
          if(error.error.message.includes("Fallo")){
            this._notificationService.notificationError(
              'Error',
              error.error.message
            );
          }else if (error.status == 400) {
            this._notificationService.notificationError(
              'Error',
              error.error.message
            );
          } else {
            this._notificationService.notificationError(
              'Error',
              'No se ha creado el usuario'
            );
          }
        });
    } else {
      this.suscriptions.push(
        this._userService.put(newUser).subscribe({
          next: () => {
            this.buttonSending = false;
            this.modalRef.close({
              accion: FrmActions.AGREGAR,
            });
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha modificado el usuario correctamente'
            );
          },
          error: (error) => {
            this.buttonSending = false;
            if (error.status == 500) {
              this._notificationService.notificationError(
                'Error',
                error.error.message
              );
            } else {
              this._notificationService.notificationError(
                'Error',
                'No se ha modificado el usuario'
              );
            }
          },
        })
      );
    }
  }

  closeForm() {
    this.modalRef.close({ accion: FrmActions.CANCELAR });
  }

  isInvited() {
    if (this.formModalUser.controls['perfil'].value.id === 4) {
      this.formModalUser.get('fecha')?.addValidators(Validators.required);
      return true;
    }
    this.formModalUser.get('fecha')!.clearValidators();
    this.formModalUser.get('fecha')!.updateValueAndValidity();
    return false;
  }

  resetPassword() {
    this.modalService.confirm({
      nzTitle: 'Confirmación',
      nzContent: `Está seguro de que desea reinicar la contraseña del usuario ${
        this.userToEdit!.tip
      }?`,
      nzOnOk: () => {
        this.suscriptions.push(
          this._userService
            .pasworChange(this.userToEdit?.id as number, {
              password: this.userToEdit?.tip,
            })
            .subscribe({
              next: (result) => {
                this._notificationService.notificationSuccess(
                  'Notificación',
                  'La contraseña ha sido reiniciada por defecto.'
                );
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
      },
    });
  }
  validatePhone(e: KeyboardEvent) {
    validatePhoneNumber(e, this.formModalUser.controls['contacto'].value);
  }
}
