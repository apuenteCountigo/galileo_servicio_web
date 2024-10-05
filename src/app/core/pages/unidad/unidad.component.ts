import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PagedResourceCollection, Sort } from '@lagoshny/ngx-hateoas-client';
import { PageParam } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTabsCanDeactivateFn } from 'ng-zorro-antd/tabs';
import { forkJoin, Observable, ObservableInput, Subscription } from 'rxjs';
import { SelectOficialComponent } from '../../components/unit/select-oficial/select-oficial.component';
import { UnitFormComponent } from '../../components/unit/unit-form/unit-form.component';
import { UnitSearchQuery } from '../../constants/unit.query';
import { UserUnitSearchQuery } from '../../constants/user-unit.query';
import { FrmActions } from '../../enums/form-acctios';
import { LoggedUserRole } from '../../enums/user-role.enum';
import { Estado } from '../../models/estado.model';
import { UnitSearchCriteria } from '../../models/interfaces';
import { UnitProvince } from '../../models/province.model';
import {
  ResumenOper,
  ResumenUnit,
  Unit,
  UnitUserRelation,
} from '../../models/unit.model';
import { User } from '../../models/users.model';
import { BreadCrumbService } from '../../services/bread-crumb.service';
import { EstadoService } from '../../services/estado.service';
import { LoggedUserService } from '../../services/logged-user.service';
import { NotificationService } from '../../services/notification.service';
import { OperacionService } from '../../services/operacion.service';
import { UnitProvincesService } from '../../services/unit-provinces.service';
import { UnitUserRelationService } from '../../services/unit-user-relation.service';
import { UnitService } from '../../services/unit.service';
import { UserService } from '../../services/user.service';
import { FileUploadModalComponent } from './../../components/file-upload-modal/file-upload-modal.component';
import { Objetivo } from './../../models/objetivo.modal';
import { Operacion } from './../../models/operacion.model';
import { formatISO } from 'date-fns';
import { SelectOficialSaComponent } from '../../components/unit/select-oficial-sa/select-oficial-sa.component';
import { LogoutService } from '../../services/logout.service';

@Component({
  selector: 'app-unidad',
  templateUrl: './unidad.component.html',
  styleUrls: ['./unidad.component.less'],
})
export class UnidadComponent implements OnInit, OnDestroy {
  unitList: Unit[] = [];
  loading = false;
  extraGutter = 0;
  extraSpan = 0;
  loadingOficials = false;
  expandRow: boolean = false;
  public userRoles: typeof LoggedUserRole = LoggedUserRole;
  query: UserUnitSearchQuery = new UserUnitSearchQuery();
  queryUnit: UnitSearchQuery = new UnitSearchQuery();
  /** Units table */
  total = 1;
  pageSize = 10;
  pageIndex = 1;
  expandSet = new Set<number>();
  sort: Sort = {
    fechaCreacion: 'DESC',
  };

  params: PageParam = {
    page: this.pageIndex - 1,
    size: this.pageSize,
  };
  /** Users table */
  totalOfic = 0;
  pageSizeOfic = 10;
  pageIndexOfic = 1;
  expandSetOfic = new Set<number>();

  selectedOffRelation: any = null;
  sortOfic!: Sort;
  paramsOfic: PageParam = {
    page: this.pageIndexOfic - 1,
    size: this.pageSizeOfic,
  };

  showSearchForm: boolean = false;
  showOficerSearchForm = false;
  disableOficialTab: boolean = true;
  disableTabObjetivos: boolean = true;
  disableTabObjetivosHistoricoBaliza: boolean = true;
  disableTabInforme: boolean = true;
  showInformTab: boolean = false;

  selectedIndex = 0;
  selectedUnit: any = 0;

  searchCriteria: UnitSearchCriteria = {
    perfil: 0,
    idUsuario: 0,
    denominacion: '',
    responsable: '',
    provinciaDescripcion: '',
    provinciaId: 0,
    localidad: '',
  };

  searchOficerCriteria = {
    tip: '',
    nombre: '',
    apellidos: '',
    idEstado: 0,
    fechaInicio: '',
    fechaFin: '',
  };

  searchUnitForm!: FormGroup;

  oficialList: any[] = [];
  unitOficialList: UnitUserRelation[] = [];
  provList: UnitProvince[] = [];

  selectedOper!: any;
  selectedObj!: any;

  resumenUnit!: ResumenUnit;
  resumenOper?: ResumenOper;
  loadingResumen = true;
  loadingOperResumen = true;

  paramsProv: PageParam = {
    page: 0,
    size: 200,
  };

  sortProv: Sort = {
    descripcion: 'ASC',
  };

  isLoadingData = false;

  filterPositionInformData: any;

  userEstados: Array<Estado> = [];

  suscriptions: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private modalUploadService: NzModalService,
    private unitService: UnitService,
    private userService: UserService,
    private notificationService: NotificationService,
    private unitOficRelService: UnitUserRelationService,
    private provincesService: UnitProvincesService,
    private operacionService: OperacionService,
    private _breadcrumbService: BreadCrumbService,
    private _loggedUserService: LoggedUserService,
    private _estadoService: EstadoService,
    private logoutService: LogoutService
  ) {}

  ngOnInit(): void {
    //this.selectedUnit = null;
    this.searchUnitForm = this.fb.group({
      denominacion: ['', null],
      responsable: ['', null],
      provinciaDescripcion: ['', null],
      provinciaId: [0, null],
      localidad: ['', null],
    });

    this.suscriptions.push(
      this._estadoService
        .filter({ descripcion: '', id: 0, idTipoEntidad: 4 })
        .subscribe({
          next: (result) => {
            this.userEstados = [...result.resources];
          },
          error: (err) => {
            this.userEstados = [];
            this.isLoadingData = false;
            this.handleErrorMessage(
              err,
              'Ha ocurrido un error al cargar los estados.'
            );
          },
        })
    );

    this.extraGutter =
      this._loggedUserService.getLoggedUser().perfil.descripcion ===
      this.userRoles.UNIT_ADMIN
        ? 16
        : 24;
    this.extraSpan =
      this._loggedUserService.getLoggedUser().perfil.descripcion ===
      this.userRoles.UNIT_ADMIN
        ? 24
        : 3;

    this.updateBreadCrumb('unid', this.selectedUnit!.denominacion);

    /** Loadind data for select de provincia */
    this.isLoadingData = true;
    this.suscriptions.push(
      this.provincesService.getAll(this.paramsProv, this.sortProv).subscribe({
        next: (provs: PagedResourceCollection<UnitProvince>) => {
          this.provList = [];
          this.provList = [...provs.resources];
          this.isLoadingData = false;
        },
        error: (err) => {
          this.provList = [];
          this.isLoadingData = false;
          this.handleErrorMessage(
            err,
            'Ha ocurrido un error al cargar las provincias.'
          );
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  updateBreadCrumb(valor: any, seleccionado?: any) {
    if (valor == 'unid') {
      this.disableTabObjetivos = true;
      this.disableTabObjetivosHistoricoBaliza = true;
      this.selectedOper = null;
      this.expandSetOfic = new Set<number>();
      this.selectedObj = null;
    }
    if (valor == 'usua' || valor == 'bali') {
      this.selectedOper = null;
      this.disableTabObjetivos = true;
      this.disableTabObjetivosHistoricoBaliza = true;
    }
    if (valor == 'oper') {
      this.selectedObj = null;
      this.disableTabObjetivosHistoricoBaliza = true;
    }

    this._breadcrumbService.updateBreadCrumb.emit({
      valor: valor,
      seleccionado: seleccionado,
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
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

  loadDataFromService() {
    const userLogeado = this._loggedUserService.getLoggedUser();
    this.sort = this.sort ? this.sort : { fechaCreacion: 'DESC' };

    this.loading = true;
    this.suscriptions.push(
      this.unitService
        .searchCriterio(
          {
            // perfil: userLogeado.perfil.id,
            // idUsuario: userLogeado.id,
            denominacion: '',
            responsable: '',
            provinciaDescripcion: '',
            provinciaId: 0,
            localidad: '',
          },
          this.params,
          this.sort
        )
        .subscribe({
          next: (unit: PagedResourceCollection<Unit>) => {
            this.unitList = [...unit.resources];
            this.total = unit.totalElements;
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
            this.unitList = [];
            this.handleErrorMessage(
              err,
              'Ha ocurrido un error al cargar las unidades.'
            );
          },
        })
    );
  }

  showModal(isEdit?: boolean) {
    const modalTitle = isEdit ? 'Editar Unidad' : 'Crear Unidad';
    const modalRef = this.modalService.create({
      nzTitle: modalTitle,
      nzStyle: { top: '20px' },
      nzMaskClosable: false,
      nzContent: UnitFormComponent,
      nzComponentParams: {
        unitToEdit: isEdit ? this.selectedUnit : null,
        provList: this.provList,
      },
    });

    modalRef.afterClose.subscribe((result) => {
      if (result.accion != FrmActions.CANCELAR) {
        this.selectedUnit = undefined;
        this.expandSet.clear();
        this.loadDataFromService();
        this.updateBreadCrumb('unid');
      }
    });
  }

  setResumen(zeroFill: boolean) {
    this.loadingResumen = true;
    if (!zeroFill) {
      this.suscriptions.push(
        this.unitService
          .getResumen({ idunidad: this.selectedUnit.id })
          .subscribe((result: ResumenUnit) => {
            this.loadingResumen = false;
            this.resumenUnit = result;
          })
      );
    }
  }

  onExpandChange(unit: Unit, checked: boolean): void {
    this.expandSet.clear();
    if (checked) {
      this.expandSet.add(unit.id);
      this.selectedUnit = unit;
      this.disableOficialTab = false;
      this.setResumen(false);
      this.updateBreadCrumb('unid', unit.denominacion);
    } else {
      this.expandSet.delete(unit.id);
      this.selectedUnit = null;
      this.disableOficialTab = true;
      this.disableTabObjetivos = true;
      this.updateBreadCrumb('unid');
      //cuando desmarco todos los hijos se ponen borran
      this.selectedOper = null;
      this.selectedObj = null;
    }
  }

  onSelectOffRelation(relation: any, checked: boolean): void {
    if (checked) {
      this.expandSetOfic.add(relation.id);
      this.selectedOffRelation = relation;
      this.updateBreadCrumb('usua', relation.nombre);
    } else {
      this.expandSetOfic.delete(relation.id);
      this.selectedOffRelation = null;
      this.updateBreadCrumb('usua');
    }
  }

  deleteUnit() {
    this.modalService.confirm({
      nzTitle: 'Confirmación',
      nzContent: `¿ Está seguro de eliminar la unidad ${this.selectedUnit.denominacion} y todas sus dependencias ?`,
      nzOnOk: () => {
        this.loading = true;
        this.suscriptions.push(
          this.unitService.detele(this.selectedUnit.id).subscribe({
            next: () => {
              this.loadDataFromService();
              this.expandSet.delete(this.selectedUnit.id);
              this.selectedUnit = null;
              this.disableOficialTab = true;
              this.notificationService.notificationSuccess(
                'Información',
                'Se ha eliminado la unidad correctamente.'
              );
              this.updateBreadCrumb('unid');
              this.loading = false;
            },
            error: (err) => {
              this.loading = false;
              this.handleErrorMessage(
                err,
                'Ha ocurrido un error al eliminar la unidad.'
              );
            },
          })
        );
      },
    });
  }

  getOficialFullName(oficial: any): string {
    let result = '';
    oficial.nombre ? (result = oficial.nombre) : null;
    oficial.apellidos ? (result = result + ' ' + oficial.apellidos) : null;
    return result;
  }

  isNullSearchForm() {
    return Object.values(this.searchUnitForm.value).every((value) => {
      if (value === null || value === '' || value === 0) {
        return true;
      }
      return false;
    });
  }

  onSearchUnit(): void {
    const userLogeado = this._loggedUserService.getLoggedUser();

    this.loading = true;
    this.suscriptions.push(
      this.unitService
        .searchCriterio(
          {
            denominacion: this.searchCriteria.denominacion,
            responsable: this.searchCriteria.responsable,
            provinciaDescripcion: this.searchCriteria.provinciaDescripcion,
            provinciaId: this.searchCriteria.provinciaId,
            localidad: this.searchCriteria.localidad,
          },
          this.params,
          this.sort
        )
        .subscribe({
          next: (unit: PagedResourceCollection<Unit>) => {
            this.loading = false;
            this.unitList = [...unit.resources];
            this.total = unit.totalElements;
          },
          error: (err) => {
            this.unitList = [];
            this.loading = false;
            this.handleErrorMessage(
              err,
              'Ha ocurrido un error al cargar las unidades.'
            );
          },
        })
    );
  }

  clearTablesSelections(): void {
    this.selectedUnit ? (this.disableOficialTab = true) : null;
    this.selectedUnit ? this.expandSet.delete(this.selectedUnit.id) : null;
    this.selectedIndex = 0;
    this.selectedUnit = null;

    this.selectedOffRelation ? (this.disableOficialTab = true) : null;
    this.selectedOffRelation
      ? this.expandSetOfic.delete(this.selectedOffRelation.id)
      : null;
    this.selectedIndex = 0;
    this.selectedOffRelation = null;
  }

  onSearch() {
    this.expandSet.clear();
    this.updateBreadCrumb('unid');
    if (this.isNullSearchForm()) {
      this.clearTablesSelections();
      this.loadDataFromService();
    } else {
      this.clearTablesSelections();
      this.searchCriteria = this.searchUnitForm.value;
      this.onSearchUnit();
    }
  }

  showHideSearchForm() {
    this.selectedOper = null;
    this.showSearchForm = !this.showSearchForm;
  }

  showHideSearchOficerForm() {
    this.showOficerSearchForm = !this.showOficerSearchForm;
  }

  resetForm(): void {
    this.searchUnitForm.reset({
      denominacion: '',
      responsable: '',
      provinciaDescripcion: '',
      provinciaId: 0,
      localidad: '',
    });
    this.loadDataFromService();
  }

  resetOficerForm(): void {
    this.searchOficerCriteria.tip = '';
    this.searchOficerCriteria.nombre = '';
    this.searchOficerCriteria.apellidos = '';
    this.searchOficerCriteria.idEstado = 0;
    this.onSearchUnitOficials();
  }

  showModalUpload() {
    const modalRef = this.modalUploadService.create({
      nzTitle: 'Importar desde un Fichero',
      nzStyle: { top: '20px' },
      nzMaskClosable: false,
      nzContent: FileUploadModalComponent,
      nzComponentParams: {
        isUnit: true,
      },
    });

    modalRef.afterClose.subscribe({
      next: (result) => {
        this.loadDataFromService();
        if (result) {
          //this.updateBreadCrumb('usurioUsuario');
          setTimeout(() => {
            this.notificationService.notificationSuccess(
              'Información',
              'Se han insertado correctamente las unidades'
            );
          }, 1000);
        }
      },
      error: (error) => {
        this.notificationService.notificationError(
          'Error',
          'Introduzca un documento excel de unidades válido para importar'
        );
      },
    });

    // modalRef.afterClose.subscribe((result) => {
    //   if (result) {
    //     this.loadDataFromService();
    //     this.notificationService.notificationSuccess(
    //       'Información',
    //       'Se ha cargado el fichero correctamente'
    //     );
    //   }
    // });
  }

  updateOficialTabInfo(unit: Unit) {
    this.selectedUnit = unit;
    this.disableOficialTab = false;
  }

  onDblClick(unit: Unit) {
    this.updateOficialTabInfo(unit);
    this.onSearchUnitOficials();
    this.selectedIndex = 1;
  }

  showModalToAssignOfficcer() {
    const perfil = this._loggedUserService.getLoggedUser().perfil.descripcion;
    if (perfil == LoggedUserRole.SUPER_ADMIN) {
      this.showModalAsingOficialSA();
    }

    if (perfil == LoggedUserRole.UNIT_ADMIN) {
      this.showModalAsingOficial();
    }
  }

  showModalAsingOficialSA() {
    const modalTitle = 'Asignar usuarios';
    const modalRef = this.modalService.create({
      nzTitle: modalTitle,
      nzStyle: { top: '20px', width: '600px' },
      nzMaskClosable: false,
      nzContent: SelectOficialSaComponent,
      nzComponentParams: {
        unidad: this.selectedUnit ? this.selectedUnit : null,
      },
    });

    modalRef.afterClose.subscribe((result) => {
      const suscriptions: Array<any> = [];
      result.data.usuarios.forEach((u: User) => {
        const relation = new UnitUserRelation();
        relation.estado = { id: result.data.estado.id } as Estado;
        relation.unidad = { id: result.data.unidad.id } as Unit;
        relation.expira = result.data.expira;
        relation.usuario = { id: u.id } as User;
        suscriptions.push(this.unitOficRelService.create(relation));
      });

      this.suscriptions.push(
        forkJoin(suscriptions as []).subscribe({
          next: () => {
            this.notificationService.notificationSuccess(
              'Información',
              `Los usuarios han sido asignados como ${result.data.estado.descripcion} a la unidad`
            );
            this.setResumen(false);
            this.onSearchUnitOficials();
          },
          error: (e) => {
            this.notificationService.notificationError(
              'Error',
              'No se han asignado los usuarios a la unidad'
            );
          },
        })
      );
    });
  }

  showModalAsingOficial() {
    const modalTitle = 'Asignar usuario';
    const modalRef = this.modalService.create({
      nzTitle: modalTitle,
      nzStyle: { top: '20px', width: '600px' },
      nzMaskClosable: false,
      nzContent: SelectOficialComponent,
      nzComponentParams: {
        unit: this.selectedUnit ? this.selectedUnit : null,
        oficialsAsignedToUnit: this.unitOficialList,
      },
    });

    modalRef.afterClose.subscribe(
      (result: {
        accion: FrmActions;
        user?: User;
        estado?: Estado;
        expira: any;
      }) => {
        if (result) {
          if (result.accion == FrmActions.ASIGNAR) {
            this.loadingOficials = true;
            const unitUserRel: UnitUserRelation = new UnitUserRelation();
            unitUserRel.unidad = { id: this.selectedUnit.id } as Unit;
            unitUserRel.usuario = { id: result.user!.id } as User;
            unitUserRel.estado = { id: result.estado!.id } as Estado;
            unitUserRel.expira = result.expira;
            this.suscriptions.push(
              this.unitOficRelService.create(unitUserRel).subscribe({
                next: () => {
                  this.onSearchUnitOficials();
                  this.setResumen(false);
                  const msg =
                    result.estado!.descripcion == 'PERMANENTE'
                      ? 'El usuario ha sido asignado como permanente correctamente a la unidad'
                      : 'El usuario ha sido invitado correctamente a la unidad';
                  this.notificationService.notificationSuccess(
                    'Información',
                    msg
                  );
                  this.selectedIndex = 1;
                  this.disableOficialTab = false;
                },
                error: (err) => {
                  this.loadingOficials = false;
                  this.handleErrorMessage(
                    err,
                    'Ha ocurrido un error al realizar la asignación.'
                  );
                },
              })
            );
          }
        }
      }
    );
  }

  onQueryParamsChangeUnitOficials(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    this.sort = {};
    sort.forEach((s) => {
      if (s.value) {
        this.sort[s.key] = s.value == 'ascend' ? 'ASC' : 'DESC';
      }
    });

    this.paramsOfic.page = pageIndex - 1;
    this.paramsOfic.size = pageSize;
    this.onSearchUnitOficials();
  }

  onSearchUnitOficials(): void {
    this.loadingOficials = true;
    const loggedUser = this._loggedUserService.getLoggedUser();
    if (
      loggedUser.perfil.descripcion == LoggedUserRole.SUPER_ADMIN ||
      loggedUser.perfil.descripcion == LoggedUserRole.UNIT_ADMIN
    ) {
      this.loadingOficials = true;
      this.sortOfic = { ...this.sortOfic, expira: 'ASC' };
      this.suscriptions.push(
        this.unitOficRelService
          .searchBy(
            {
              tip: this.searchOficerCriteria.tip,
              nombre: this.searchOficerCriteria.nombre,
              apellidos: this.searchOficerCriteria.apellidos,
              idEstado: this.searchOficerCriteria.idEstado,
              idUnidad: this.selectedUnit.id,
              fechaInicio: this.searchOficerCriteria.fechaInicio,
              fechaFin: this.searchOficerCriteria.fechaFin,
            },
            this.query.FILTRAR_USUARIOS,
            this.paramsOfic,
            this.sortOfic
          )
          .subscribe({
            next: (result) => {
              this.unitOficialList = [...result.resources];
              this.loadingOficials = false;
              this.totalOfic = result.totalElements;
            },
          })
      );
    }
  }

  deleteAssing() {
    this.modalService.confirm({
      nzTitle: 'Confirmación',
      nzContent: `Está seguro de remover el/los usuario(s) de esta unidad?`,
      // nzContent: `Está seguro de eliminar la asignación al usuario ${this.selectedOffRelation.usuario.tip}?`,
      nzOnOk: () => {
        this.loadingOficials = true;
        const suscriptions: Array<Observable<any>> = [];
        this.expandSetOfic.forEach((ex) => {
          suscriptions.push(this.unitOficRelService.detele(ex));
        });

        this.suscriptions.push(
          forkJoin(suscriptions).subscribe({
            next: () => {
              this.expandSetOfic.clear();
              this.onSearchUnitOficials();
              this.resumenUnit.cantidadUsuarios =
                this.resumenUnit.cantidadUsuarios - suscriptions.length;
            },
            error: (e) => {
              this.loadingOficials = false;
              this.handleErrorMessage(
                e,
                'Ha ocurrido un error al eliminar la asignación.'
              );
            },
          })
        );
      },
    });
  }

  setOperResumen() {
    this.operacionService
      .getResumen({ idoperaciones: this.selectedOper.id })
      .subscribe((result: ResumenOper) => {
        this.resumenOper = result;
        this.loadingOperResumen = false;
      });
  }

  selectedOperation(operacion: Operacion) {
    this.selectedOper = operacion;
    if (operacion != null) {
      this.setOperResumen();
      this.disableTabObjetivos = false;
      this.resumenOper = undefined;
    } else {
      this.disableTabObjetivos = true;
      this.setResumen(false);
    }
  }
  tabObjetivoAct(activo: boolean) {
    this.disableTabObjetivos = activo;
  }
  selectObjetivo(Objetivo: Objetivo) {
    this.selectedObj = Objetivo;

    if (Objetivo != null) {
      this.disableTabObjetivosHistoricoBaliza = false;
    } else {
      this.disableTabObjetivosHistoricoBaliza = true;
    }
  }

  closeSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.resetForm();
    this.loadDataFromService();
  }

  closeOficerSearchForm() {
    this.showOficerSearchForm = !this.showOficerSearchForm;
    this.resetOficerForm();
    this.onSearchUnitOficials();
  }

  onChangeOperacion(change: any) {
    if (change) {
      this.setResumen(false);
      this.resumenOper = {
        cantObjetivo: 0,
      };
    }
  }

  get setSpand() {
    const loggedUserRole =
      this._loggedUserService.getLoggedUser().perfil.descripcion;
    return loggedUserRole == this.userRoles.SUPER_ADMIN ? 4 : 17;
  }

  handleErrorMessage(error: any, defaultMsg: string): void {
    if (error.error && error.error.message && error.error.message.toLowerCase().includes('jwt expired')) {
      // Desloguea al usuario
      this.logoutService.logout(); // Asegúrate de que `logout()` limpie los datos del usuario
      return;
    }else if (error.status == 400) {
      this.notificationService.notificationError(
        'Error',
        error.error.message.toLowerCase()
      );
    } else if (error.status == 409) {
      this.notificationService.notificationError(
        'Error',
        error.error.message.toLowerCase()
      );
    } else if (error.status == 500) {
      if (
        error.error.message &&
        error.error.message.toLowerCase().includes('fallo')
      ) {
        this.notificationService.notificationError(
          'Error',
          error.error.message
        );
      } else {
        this.notificationService.notificationError('Error', defaultMsg);
      }
    } else {
      this.notificationService.notificationError('Error', defaultMsg);
    }
  }

  showTabInforme(filterData: any): void {
    this.filterPositionInformData = filterData;
    this.disableTabInforme = false;
    this.showInformTab = true;
    this.selectedIndex = 6;
  }

  canDeactivate: NzTabsCanDeactivateFn = (
    fromIndex: number,
    toIndex: number
  ) => {
    switch (fromIndex) {
      case 6:
        return this.confirmOutTabInform();
      default:
        return true;
    }
  };

  confirmOutTabInform(): Observable<boolean> {
    return new Observable((observer) => {
      this.modalService.confirm({
        nzTitle: 'Confirmación',
        nzContent: `Al salir del tab de informe perderá la información generada.`,
        nzOnOk: () => {
          observer.next(true);
          this.disableTabInforme = true;
          this.showInformTab = false;
          observer.complete();
        },
        nzOnCancel: () => {
          observer.next(false);
          observer.complete();
        },
      });
    });
  }

  isDisabled(action?: boolean): boolean {
    return action || this.isLoadingData;
  }

  removeOne() {
    this.resumenUnit.cantidadBalizasStock--;
  }

  onAction(event: any) {
    if (event == 'crear' && this.resumenOper) {
      this.resumenOper.cantObjetivo++;
    }
    if (event == 'eliminar' && this.resumenOper) {
      this.resumenOper.cantObjetivo--;
    }
  }

  onDateChange(event: Array<Date>) {
    event[0].setHours(0, 0, 0, 0);
    event[1].setHours(23, 59, 59);

    this.searchOficerCriteria.fechaInicio = event[0] ? formatISO(event[0]) : '';
    this.searchOficerCriteria.fechaFin = event[1] ? formatISO(event[1]) : '';
    if (event.length == 0 && this.isNullBusqueda()) {
      this.resetOficerForm();
    }
  }

  isNullBusqueda() {
    return Object.values(this.searchOficerCriteria).every((value) => {
      if (value === null || value === '' || value === 0) {
        return true;
      }
      return false;
    });
  }

  setStyleClass(exp: boolean) {
    return exp ? 'icon-class' : 'icon-disabled';
  }
}
