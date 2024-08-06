import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { differenceInCalendarDays } from 'date-fns';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { UserUnitSearchQuery } from 'src/app/core/constants/user-unit.query';
import { UserSearchQuery } from 'src/app/core/constants/user.query';
import { FrmActions } from 'src/app/core/enums/form-acctios';
import { Estado } from 'src/app/core/models/estado.model';
import { EstadoService } from 'src/app/core/services/estado.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UnitUserRelationService } from 'src/app/core/services/unit-user-relation.service';
import { UserService } from 'src/app/core/services/user.service';
import { ValidateTip } from 'src/app/core/utils/Validators/assign-user.validator';
import { Unit } from './../../../models/unit.model';

import { formatISO, format } from 'date-fns';

@Component({
  selector: 'app-select-oficial',
  templateUrl: './select-oficial.component.html',
  styleUrls: ['./select-oficial.component.less'],
})
export class SelectOficialComponent implements OnInit, OnDestroy {
  @Input() unit!: Unit | null;
  @Input() oficialsAsignedToUnit!: any[];
  @Output() listRelation!: any[];

  tip: string = '';
  query: UserSearchQuery = new UserSearchQuery();
  query2: UserUnitSearchQuery = new UserUnitSearchQuery();
  loading = false;

  estados!: Estado[];

  filter = {
    descripcion: '',
    id: 0,
    idTipoEntidad: 4,
  };

  dateFormat = 'dd/MM/yyyy';

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) < 0;

  formModalAssignUser!: FormGroup;

  suscriptions: Array<any> = [];

  constructor(
    private _userService: UserService,
    private _estadoService: EstadoService,
    private _notificationService: NotificationService,
    private _unitUserRelationService: UnitUserRelationService,
    private modalRef: NzModalRef,
    private fb: FormBuilder
  ) {
    this.formModalAssignUser = this.fb.group({
      tip: ['', [Validators.required, ValidateTip]],
      estado: ['', [Validators.required]],
      expira: ['', []],
    });
  }

  ngOnInit(): void {
    this.suscriptions.push(
      this._estadoService.filterByType(this.filter).subscribe({
        next: (result) => {
          this.estados = [...result.resources];
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  cancelForm(): void {
    this.modalRef.close({ accion: FrmActions.CANCELAR });
  }

  assignUser() {
    this.loading = true;
    this.suscriptions.push(
      this._userService
        .searchBy(this.query.BUSCAR_TIP, {
          tip: this.formModalAssignUser.value.tip,
          projection: '',
        })
        .subscribe({
          next: (result) => {
            if (result) {
              const estado = this.estados.find(
                (estado) =>
                  estado.id == this.formModalAssignUser.value.estado.id
              )?.descripcion;

              const filter = {
                idUsuario: result.id,
                idEstado: 0,
              };

              this._unitUserRelationService
                .searchBy(filter, this.query2.FILTRAR_UNIDADES)
                .subscribe((result) => {
                  if (result.resources.length == 0) {
                    this.modalRef.close({
                      accion: FrmActions.ASIGNAR,
                      user: { id: filter.idUsuario },
                      estado: this.formModalAssignUser.value.estado,
                      expira: this.formModalAssignUser.value.expira
                        ? format(
                            this.formModalAssignUser.value.expira,
                            "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
                          )
                        : '',
                    });
                    this.loading = false;
                  } else {
                    const userFound = result.resources.find(
                      (user) => user.unidad?.id == this.unit?.id
                    );

                    this.loading = false;

                    const isAssignedPermanente = result.resources.some(
                      (relation) => relation.estado.descripcion == 'PERMANENTE'
                    );

                    if (estado == 'PERMANENTE') {
                      if (isAssignedPermanente) {
                        this._notificationService.notificationError(
                          'Error',
                          'El usuario ya está asignado como permanente a una unidad.'
                        );
                      }
                      if (userFound) {
                        this._notificationService.notificationError(
                          'Error',
                          'El usuario ya está asignado a esta unidad.'
                        );
                      } else {
                        if (result.resources.length == 1) {
                          if (
                            result.resources[0].estado.descripcion ===
                            'INVITADO'
                          ) {
                            this.modalRef.close({
                              accion: FrmActions.ASIGNAR,
                              user: { id: filter.idUsuario },
                              estado: this.formModalAssignUser.value.estado,
                              expira: this.formModalAssignUser.value.expira
                                ? format(
                                    this.formModalAssignUser.value.expira,
                                    "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
                                  )
                                : '',
                            });
                            this.loading = false;
                          }
                        } else if (result.resources.length > 1) {
                          const isPermanent = result.resources.find(
                            (user) => user.estado?.descripcion == 'PERMANENTE'
                          );

                          if (isPermanent) {
                            this._notificationService.notificationError(
                              'Error',
                              'El usuario ya pertenece a una unidad de forma permanente'
                            );
                          } else {
                            this.modalRef.close({
                              accion: FrmActions.ASIGNAR,
                              user: { id: filter.idUsuario },
                              estado: this.formModalAssignUser.value.estado,
                              expira: this.formModalAssignUser.value.expira
                                ? format(
                                    this.formModalAssignUser.value.expira,
                                    "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
                                  )
                                : '',
                            });
                            this.loading = false;
                          }
                        } else {
                          this._notificationService.notificationError(
                            'Error',
                            'El usuario ya pertenece a una unidad de forma permanente'
                          );
                        }
                      }
                    } else {
                      // INVITADO
                      if (userFound) {
                        this.loading = false;
                        this._notificationService.notificationError(
                          'Error',
                          'El usuario ya se encuentra asignado a esta unidad'
                        );
                      } else {
                        this.modalRef.close({
                          accion: FrmActions.ASIGNAR,
                          user: { id: filter.idUsuario },
                          estado: this.formModalAssignUser.value.estado,
                          expira: this.formModalAssignUser.value.expira
                            ? format(
                                this.formModalAssignUser.value.expira,
                                "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
                              )
                            : '',
                        });
                        this.loading = false;
                      }
                    }
                  }
                });
            } else {
              this.loading = false;
              this._notificationService.notificationError(
                'Error',
                'El usuario no existe, por favor verifique el TIP'
              );
            }
          },
          error: (error) => {
            this.loading = false;
            this._notificationService.notificationError(
              'Error',
              'El usuario no existe, por favor verifique el TIP'
            );
          },
        })
    );
  }

  userStatus(event: Estado) {
    if (event.id == 7) {
      this.formModalAssignUser.controls['expira'].addValidators(
        Validators.required
      );
    } else {
      this.formModalAssignUser.controls['expira'].clearValidators();
    }
    this.formModalAssignUser.updateValueAndValidity();
  }

  isInvited() {
    return this.formModalAssignUser.value.estado.id == 7 ? true : false;
  }

  checkForm() {
    return this.formModalAssignUser.invalid ? true : false;
  }
}
