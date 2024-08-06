import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { PagedResourceCollection, Sort } from '@lagoshny/ngx-hateoas-client';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { firstValueFrom, forkJoin } from 'rxjs';
import { UserUnitSearchQuery } from 'src/app/core/constants/user-unit.query';
import { UserSearchQuery } from 'src/app/core/constants/user.query';
import { Estados } from 'src/app/core/enums/estados.enum';
import { FrmActions } from 'src/app/core/enums/form-acctios';
import { Estado } from 'src/app/core/models/estado.model';
import { Empleo, Rol } from 'src/app/core/models/momencaldores.model';
import { Unit, UnitUserRelation } from 'src/app/core/models/unit.model';
import { User } from 'src/app/core/models/users.model';
import { EmpleoService } from 'src/app/core/services/empleo.service';
import { EstadoService } from 'src/app/core/services/estado.service';
import { LoggedUserService } from 'src/app/core/services/logged-user.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PerfilesService } from 'src/app/core/services/perfiles.service';
import { UserService } from 'src/app/core/services/user.service';
import { TableBase } from 'src/app/core/utils/table.base';
import { FileUploadModalComponent } from '../../file-upload-modal/file-upload-modal.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { BreadCrumbService } from './../../../services/bread-crumb.service';

import { formatISO } from 'date-fns';
import { LoggedUserRole } from 'src/app/core/enums/user-role.enum';

@Component({
  selector: 'app-user-main-table',
  templateUrl: './user-main-table.component.html',
  styleUrls: ['./user-main-table.component.less'],
})
export class UserMainTableComponent
  extends TableBase
  implements OnInit, OnDestroy
{
  /** Variables */
  @Output() outSelectedUser: EventEmitter<any> = new EventEmitter();
  searchCriteria = {
    tip: '',
    nombre: '',
    apellidos: '',
    fechaInicio: '',
    fechaFin: '',
    email: '',
    perfil: 0,
  };

  override sort: Sort = {
    'u.fechaAlta': 'DESC',
  };

  query: UserSearchQuery = new UserSearchQuery();
  queryUnitUser: UserUnitSearchQuery = new UserUnitSearchQuery();

  userList: Array<User> = [];
  perfilList!: Array<Rol>;

  disableUserActions = true;

  unitLoading!: boolean;
  listOfUserUnidades!: Array<UnitUserRelation>;
  selectedUser?: User = undefined;
  public fechaInicio: any;
  dateFormat = 'dd/MM/yyyy';
  empleosList!: Array<Empleo>;
  userPerfiles!: Array<Rol>;
  estadoPermanente!: Array<Estado>;
  isLoadingData = false;
  disableAddAdmin = false;

  loggedUserUnit?: Unit;

  suscriptions: Array<any> = [];

  /** Constructor */
  constructor(
    private modalService: NzModalService,
    private _userService: UserService,
    private _notificationService: NotificationService,
    private _perfilesService: PerfilesService,
    private _empleoService: EmpleoService,
    private _modalUploadService: NzModalService,
    private _breadrumbService: BreadCrumbService,
    private _loggedUserService: LoggedUserService,
    private _estadoService: EstadoService
  ) {
    super();
  }

  /** NgOnInit */
  ngOnInit(): void {
    this.isLoadingData = true;
    this.suscriptions.push(
      forkJoin([
        this._empleoService.getAll(),
        this._perfilesService.getAll(),
        this._estadoService.filter({
          id: Estados.PERMANENTE,
          idTipoEntidad: 0,
        }),
      ]).subscribe({
        next: (result) => {
          this.empleosList = [...result[0].resources];
          this.userPerfiles = [...result[1].resources];
          this.estadoPermanente = [...result[2].resources];
          this.userPerfiles.sort((a, b) => a.id - b.id);

          const loggedUserPerfil =
            this._loggedUserService.getLoggedUser().perfil.descripcion;
          if (loggedUserPerfil == LoggedUserRole.UNIT_ADMIN) {
            const indexSuperAdmin = this.userPerfiles.findIndex(
              (p) => p.descripcion == LoggedUserRole.SUPER_ADMIN
            );
            this.userPerfiles.splice(indexSuperAdmin, 1);
            const indexGuest = this.userPerfiles.findIndex(
              (p) => p.descripcion == LoggedUserRole.GUEST_USER
            );
            this.userPerfiles.splice(indexGuest, 1);
          }
          this._loggedUserService.getUnit().then((result) => {
            this.loggedUserUnit = result.resources[0].unidad;
          });

          this.isLoadingData = false;
        },
        error: (err) => {
          this._notificationService.notificationError(
            'Error',
            'Ha ocurrido un error al cargar los nomencladores'
          );
          this.isLoadingData = false;
        },
      })
    );
    this.loadData();
    this.checkAdminUnit();
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  /** Personal Methods */

  resetForm(): void {
    this.searchCriteria.tip = '';
    this.searchCriteria.nombre = '';
    this.searchCriteria.apellidos = '';
    this.searchCriteria.fechaInicio = '';
    this.searchCriteria.fechaFin = '';
    this.searchCriteria.perfil = 0;
    this.fechaInicio = null;
    this.loadData();
  }

  checkAdminUnit() {
    if (
      this._loggedUserService.getLoggedUser().perfil.descripcion ==
      this.userRoles.SUPER_ADMIN
    ) {
      this.disableAddAdmin = false;
      return;
    }
    this._loggedUserService.getUnit().then((result) => {
      this.disableAddAdmin = result.resources.length == 0;
    });
  }

  resetSelection() {
    this.selectedUser = undefined;
    this.expandSet.clear();
  }

  loadData() {
    this.loading = true;
    this.resetSelection();
    this.updateBreadCrumb('usurioUsuario');
    this.suscriptions.push(
      this._userService
        .search(this.searchCriteria, this.params, this.sort)
        .subscribe({
          next: (users: PagedResourceCollection<User>) => {
            this.loading = false;
            this.userList = [...users.resources];
            this.total = users.totalElements;
          },
          error: (err) => {
            this._notificationService.notificationError(
              'Error',
              'Ha ocurrido un error al cargar los usuarios'
            );
            this.loading = false;
          },
        })
    );
  }

  /**Modal de Add Edit Usuario */

  async createUser(newUser: User) {
    return await firstValueFrom(this._userService.create(newUser));
  }

  override showModal(isEdit?: boolean) {
    const modalTitle = isEdit ? 'Editar Usuario' : 'Agregar Usuario';
    const modalRef = this.modalService.create({
      nzTitle: modalTitle,
      nzStyle: { top: '20px' },
      nzMaskClosable: false,
      nzContent: UserFormComponent,
      nzComponentParams: {
        userToEdit: isEdit ? this.selectedUser : undefined,
        empleosList: this.empleosList,
        userPerfiles: this.userPerfiles,
      },
    });

    modalRef.afterClose.subscribe((result) => {
      if (result && result.accion != FrmActions.CANCELAR) {
        this.updateBreadCrumb('usurioUsuario');
        this.loadData();
        this.selectedUser = undefined;
        this.expandSet.clear();
        this.disableUserActions = true;
        this.updateBreadCrumb('usurioUsuario');
      }
    });
  }

  deleteUser() {
    this.modalService.confirm({
      nzTitle: 'Confirmación',
      nzContent: `Está seguro de eliminar el usuario ${
        this.selectedUser!.tip
      }?`,
      nzOnOk: () => {
        this.suscriptions.push(
          this._userService.detele(this.selectedUser!).subscribe({
            next: () => {
              this.updateBreadCrumb('usurioUsuario');
              this.selectedUser = undefined;
              this.expandSet.clear();
              this.disableUserActions = true;
              this._notificationService.notificationSuccess(
                'Información',
                'Se ha eliminado el usuario correctamente'
              );
              this.loadData();
            },
            error: (error) => {
              this.updateBreadCrumb('usurioUsuario');
              this._notificationService.notificationError(
                'Error',
                'No se ha eliminado el usuario'
              );
            },
          })
        );
      },
    });
  }

  changeUserStatus() {
    this.selectedUser!.estados =
      this.selectedUser!.estados!.id == 2
        ? ({ id: 4 } as Estado)
        : ({ id: 2 } as Estado);

    this.suscriptions.push(
      this._userService.put(this.selectedUser!).subscribe({
        next: (result) => {
          this.selectedUser = undefined;
          this.expandSet.clear();
          this.disableUserActions = true;
          this.updateBreadCrumb('usurioUsuario');
          this.loadData();
        },
        error: (error) => {
          this._notificationService.notificationError(
            'Error',
            'No se ha actualizado el estado del usuario'
          );
        },
      })
    );
  }

  isActive() {
    if (this.selectedUser && this.selectedUser.estados!.id == 2) {
      return true;
    } else {
      return false;
    }
  }

  onExpandChangeUser(user: User, checked: boolean): void {
    this.expandSet.clear();
    if (checked) {
      this.updateUnidadesTabInfo(user);
      this.expandSet.add(user.id);
      this.disableUserActions = false;
      this.updateBreadCrumb('usurioUsuario', user.nombre);
    } else {
      this.selectedUser = undefined;
      this.outSelectedUser.emit(undefined);
      this.disableUserActions = true;
      this.expandSet.delete(user.id);
      this.updateBreadCrumb('usurioUsuario');
    }
  }

  searchData() {
    this.loading = true;
    this.params.page = 0;
    this.selectedUser = undefined;
    this.expandSet.clear();
    this.updateBreadCrumb('usurioUsuario');
    this.suscriptions.push(
      this._userService
        .search(this.searchCriteria, this.params, this.sort)
        .subscribe({
          next: (users: PagedResourceCollection<User>) => {
            this.loading = false;
            this.userList = [];
            if (users.resources.length > 0) {
              this.userList = [...users.resources];
            }
            this.total = users.totalElements;
          },
          error: (err) => {
            this._notificationService.notificationError(
              'Error',
              'Ha ocurrido un error al cargar los usuarios'
            );
            this.userList = [];
            this.total = 0;
            this.loading = false;
          },
        })
    );
  }

  showModalUpload() {
    const modalRef = this._modalUploadService.create({
      nzTitle: 'Importar desde un Fichero',
      nzStyle: { top: '20px' },
      nzMaskClosable: false,
      nzContent: FileUploadModalComponent,
      nzComponentParams: {
        isUser: true,
      },
    });
    modalRef.afterClose.subscribe({
      next: (result) => {
        if (result) {
          this.updateBreadCrumb('usurioUsuario');
          this.loadData();
          setTimeout(() => {
            this._notificationService.notificationSuccess(
              'Información',
              'Se han insertado correctamente los usuarios'
            );
          }, 1000);
        }
      },
      error: (error) => {
        this._notificationService.notificationError(
          'Error',
          'Introduzca un documento excel de usuario válido para importar'
        );
      },
    });
  }

  isNullBusqueda() {
    return Object.values(this.searchCriteria).every((value) => {
      if (value === null || value === '' || value === 0) {
        return true;
      }
      return false;
    });
  }

  onSearch() {
    if (this.isNullBusqueda()) {
      this.loadData();
    } else {
      this.searchData();
    }
  }

  override onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    this.sort = {} as Sort;
    sort.forEach((s) => {
      if (s.value) {
        this.sort[s.key] = s.value == 'ascend' ? 'ASC' : 'DESC';
      }
    });

    const hasKeys = !!Object.keys(this.sort).length;
    if (!hasKeys) {
      this.sort['fechaCreacion'] = 'DESC';
    }

    this.params.page = pageIndex - 1;
    this.params.size = pageSize;

    this.onSearch();
  }

  updateUnidadesTabInfo(user: User) {
    this.selectedUser = user;
    this.outSelectedUser.emit(user);
  }
  closeSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.resetForm();
  }

  isDesactivated() {
    const user = this.selectedUser as User;
    return user.estados?.descripcion == 'DESACTIVADO';
  }

  onDateChange(event: Array<Date>, fecha: Array<Date>) {
    if (event.length == 0) {
      this.searchCriteria.fechaInicio = '';
      this.searchCriteria.fechaFin = '';
      return;
    }
    event[0].setHours(0, 0, 0, 0);
    event[1].setHours(23, 59, 59);
    const startDate: Date = event[0];
    const endDate: Date = event[1];
    this.searchCriteria.fechaInicio = startDate ? formatISO(startDate) : '';
    this.searchCriteria.fechaFin = endDate ? formatISO(endDate) : '';
    if (event.length == 0 && this.isNullBusqueda()) {
      this.loadData();
    }
  }

  updateBreadCrumb(valor: any, seleccionado?: any) {
    this._breadrumbService.updateBreadCrumb.emit({
      valor: valor,
      seleccionado: seleccionado,
    });
  }

  isDisabled(action?: boolean): boolean {
    return action || this.isLoadingData;
  }

  isSuperAdmin() {
    return (
      this._loggedUserService.getLoggedUser().perfil.descripcion ==
      LoggedUserRole.SUPER_ADMIN
    );
  }

  public refreshUsers(): void {
    this.loadData();
  }

  setStyleClass(action?: boolean) {
    let resp;
    switch (this.disableAddAdmin) {
      case true:
        resp = 'icon-disabled';
        break;
      default:
        resp = !this.isDisabled(action) ? 'icon-class' : 'icon-disabled';
        break;
    }
    return resp;
  }

  setActive() {
    return !this.isActive() ? 'check' : 'close';
  }

  setToolTip() {
    return !this.isActive() ? 'Activar' : 'Desactivar';
  }
  setSearchStyleClass() {
    return !this.isNullBusqueda() ? 'icon-class' : 'icon-disabled';
  }
  isInvitado() {
    // return (
    //   this.selectedUser?.perfil.descripcion!.includes('Invitado') &&
    //   this._loggedUserService.getLoggedUser().perfil.descripcion ==
    //     this.userRoles.UNIT_ADMIN
    // );
    return (
      this.selectedUser?.unidad?.denominacion !=
        this.loggedUserUnit?.denominacion &&
      this._loggedUserService.getLoggedUser().perfil.descripcion ==
        this.userRoles.UNIT_ADMIN
    );
  }
  setEditClass(action?: boolean) {
    return !this.isDisabled(action) && !this.isInvitado()
      ? 'icon-class'
      : 'icon-disabled';
  }
}
