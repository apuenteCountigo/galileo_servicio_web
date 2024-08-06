import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PagedResourceCollection, Sort } from '@lagoshny/ngx-hateoas-client';
import { PageParam } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { firstValueFrom, Observable } from 'rxjs';
import { FrmActions } from 'src/app/core/enums/form-acctios';
import { LoggedUserRole } from 'src/app/core/enums/user-role.enum';
import { Juzgado } from 'src/app/core/models/juzgado.model';
import { Objetivo } from 'src/app/core/models/objetivo.modal';
import { User } from 'src/app/core/models/users.model';
import { BalizaService } from 'src/app/core/services/baliza.service';
import { BreadCrumbService } from 'src/app/core/services/bread-crumb.service';
import { EvidenceService } from 'src/app/core/services/evidence.service';
import { GenerateEvidenceService } from 'src/app/core/services/generate-evidence.service';
import { JuzgadoService } from 'src/app/core/services/juzgado.service';
import { LoggedUserService } from 'src/app/core/services/logged-user.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ObjetivosService } from 'src/app/core/services/objetivos.service';
import { UserService } from 'src/app/core/services/user.service';
import { TableBase } from 'src/app/core/utils/table.base';
import { ConfiguracionBalizaComponent } from '../configuracion-baliza/configuracion-baliza.component';
import { ObjetivoDesasignarBalizaComponent } from '../objetivos-desasignar-baliza/objetivo-desasignar-baliza/objetivo-desasignar-baliza.component';
import { ObjetivosFormComponent } from '../objetivos-form/objetivos-form.component';
import { ObjetivosHistoricoComponent } from '../objetivos-historico/objetivos-historico.component';
import { WizardPositionsComponent } from '../wizard-positions/wizard-positions.component';
import {
  Estados,
  EstadosGeneracionEvidencia,
} from './../../../enums/estados.enum';
import { Baliza } from './../../../models/baliza.model';
import { Estado } from './../../../models/estado.model';
import { Operacion } from './../../../models/operacion.model';

interface BusquedaObjetivo {
  descripcion: string | null;
  idresponsable: number | null;
}

@Component({
  selector: 'app-objetivos-tabla',
  templateUrl: './objetivos-tabla.component.html',
  styleUrls: ['./objetivos-tabla.component.less'],
})
export class ObjetivosTablaComponent extends TableBase implements OnInit {
  @Input() selectedOper!: Operacion;
  @Input() selectedObj?: any;
  @Output() selectObjetivo = new EventEmitter<any>();
  @Output() informePositionFilterData = new EventEmitter<any>();
  @Output() createdObjetivo = new EventEmitter<string>();

  selectedObjetivo: any = null;
  listOfObjetivos: Objetivo[] = [];

  listOfObjetivosToEvidencia: Array<Objetivo> = [];

  isGenerating!: boolean;

  pageSizeOfic = 10;
  pageIndexOfic = 1;
  sortObjetivo!: Sort;
  paramsObjetivo: PageParam = {
    page: this.pageIndexOfic - 1,
    size: this.pageSizeOfic,
  };

  searchCriteria: BusquedaObjetivo = {
    descripcion: '',
    idresponsable: 0,
  };

  loadingBalizas: boolean = true;
  totalBalizas: number = 0;

  enableAddUsuarios: boolean = true;
  enableAddBalizas: boolean = true;
  enableAddJuzgados: boolean = true;

  listBalizaz: any[] = [];
  listJuzgados: Juzgado[] = [];
  listUsuarios: User[] = [];

  listEstados: any[] = [
    { id: 9, descripcion: 'Averiada' },
    { id: 11, descripcion: 'Perdida' },
    { id: 12, descripcion: 'Baja' },
  ];

  constructor(
    private _notificationService: NotificationService,
    private _objetivoService: ObjetivosService,
    private modalService: NzModalService,
    private _breadrumbService: BreadCrumbService,
    private _balizasService: BalizaService,
    private _loggedUserService: LoggedUserService,
    private _juzgadoService: JuzgadoService,
    private _usersServicio: UserService,
    private _generateEvidenceService: GenerateEvidenceService,
    private evidenceService: EvidenceService
  ) {
    super();
  }

  ngOnInit(): void {
    if (
      this._loggedUserService.getLoggedUser().perfil.descripcion ==
        'Administrador de Unidad' ||
      this._loggedUserService.getLoggedUser().perfil.descripcion ==
        'Super Administrador'
    ) {
      this.loadBalizasOfUnidad();
      this.loadJuzgados();
      this.loadUserOffUnit();
    }
    this._generateEvidenceService.isGenetaring$.subscribe((result) => {
      this.isGenerating = result == EstadosGeneracionEvidencia.INICIADA;
    });
    this._generateEvidenceService.objetivos$.subscribe((result) => {
      this.listOfObjetivosToEvidencia = result;
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
  resetForm(): void {
    this.searchCriteria.descripcion = '';
    this.searchCriteria.idresponsable = 0;
    this.onSearchUnitOfObjetivos();
  }
  closeSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.resetForm();
    this.onSearchUnitOfObjetivos();
  }

  override showModal(isEdit?: boolean) {
    if (isEdit && this.selectedObj.balizas) {
      const index = this.listBalizaz.findIndex(
        (baliza) => baliza == this.selectedObj.balizas
      );
      if (index < 0) {
        this.listBalizaz.unshift(this.selectedObj.balizas);
      }
    }

    const modalTitle = isEdit ? 'Editar Objetivo' : 'Agregar Objetivo';
    const modalRef = this.modalService.create({
      nzTitle: modalTitle,
      nzStyle: { top: '20px' },
      nzMaskClosable: false,
      nzContent: ObjetivosFormComponent,
      nzComponentParams: {
        objetivoToEdit: isEdit ? this.selectedObj : null,
        selectedOperacion: this.selectedOper,
        listBalizaz: this.listBalizaz,
        listJuzgados: this.listJuzgados,
        listUsuarios: this.listUsuarios,
      },
    });
    modalRef.afterClose.subscribe((result) => {
      if (result != undefined) {
        if (result.accion != FrmActions.CANCELAR) {
          if (result.accion != FrmActions.AGREGAR) {
            this.loading = true;
            this.createdObjetivo.emit('crear');
          }
          this.onSearchUnitOfObjetivos();
        }
      }
    });
  }

  deleteObjetivo() {
    this.modalService.confirm({
      nzTitle: 'Confirmación',
      nzContent: `Está seguro de eliminar el objetivo ${this.selectedObj.descripcion}?`,
      nzOnOk: () => {
        this._objetivoService.detele(this.selectedObj).subscribe({
          next: () => {
            setTimeout(() => {
              this.createdObjetivo.emit('eliminar');
              this.onSearchUnitOfObjetivos();
            }, 1000);
          },
          error: (error) => {
            this.loading = false;
            this.handleErrorMessage(
              error,
              'Ocurrió un error al eliminar el objetivo.'
            );
          },
        });
        this.updateBreadCrumb('obje');
        this.expandSet.delete(this.selectedObj.id);
      },
    });
  }
  onExpandChangeObjetivo(objetivo: Objetivo, checked: boolean): void {
    this.expandSet.clear();
    if (checked) {
      this.expandSet.add(objetivo.id);
      this.selectedObjetivo = objetivo;
      this.updateBreadCrumb('obje', objetivo.descripcion);
      this.selectObjetivo.emit(objetivo);
    } else {
      this.expandSet.delete(objetivo.id);
      this.selectedObjetivo = null;
      this.updateBreadCrumb('obje');
      this.selectObjetivo.emit(null);
    }
  }
  onQueryParamsChangeUnitObjetivos(params: NzTableQueryParams): void {
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
    this.onSearchUnitOfObjetivos();
  }

  onSearchUnitOfObjetivos(): void {
    const userLogeado = this._loggedUserService.getLoggedUser();
    this.loading = true;
    this._objetivoService
      .search(
        {
          perfil: userLogeado.perfil.id,
          unidad: this.selectedOper.unidades?.id,
          idUsuario: userLogeado.id,
          descripcion: this.searchCriteria.descripcion,
          idoperacion: this.selectedOper!.id,
          idresponsable: this.searchCriteria.idresponsable,
          idjuzgado: 0,
          id: 0,
        },
        this.params,
        this.sort
      )
      .subscribe({
        next: (relations: PagedResourceCollection<any>) => {
          this.loading = false;
          this.listOfObjetivos = [...relations.resources];
          this.total = relations.totalElements;
          //this.totalOfic = relations.totalElements;
        },
        error: (err) => {
          this.loading = false;
          this.listOfObjetivos = [];
          this._notificationService.notificationError(
            'Error',
            'Error al cargar los objetivos de la operación.'
          );
        },
      });
  }
  updateBreadCrumb(valor: any, seleccionado?: any) {
    this._breadrumbService.updateBreadCrumb.emit({
      valor: valor,
      seleccionado: seleccionado,
    });
  }
  loadBalizasOfUnidad() {
    this.loadingBalizas = true;
    this._balizasService
      .searchFiltrar(
        {
          unidad: this.selectedOper.unidades?.id,
          idEstadoBaliza: Estados.DISPONIBLE,
        },
        this.paramsObjetivo,
        this.sortObjetivo
      )
      .subscribe({
        next: (balizas: PagedResourceCollection<any>) => {
          this.loadingBalizas = false;
          this.listBalizaz = [...balizas.resources];
          this.totalBalizas = balizas.totalElements;
        },
        error: (err) => {
          this.loadingBalizas = true;
          this.listBalizaz = [];
          this._notificationService.notificationError(
            'Error',
            'Error al cargar las balizas disponibles de la unidad.'
          );
        },
      });
  }
  asigDesAsigBaliza(objetivo: any): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Asignar baliza',
      nzStyle: { top: '20px' },
      nzMaskClosable: false,
      nzContent: ObjetivoDesasignarBalizaComponent,
      nzComponentParams: {
        label: 'Balizas',
        idUnidad: this.selectedOper.unidades?.id,
        objetivo: this.selectedObj,
      },
    });
    modalRef.afterClose.subscribe((result) => {
      if (result.accion != 'CANCELAR') {
        const newObjetivo = objetivo;
        newObjetivo.balizas = result.id > 0 ? { id: result.id } : undefined;
        this._objetivoService.put(newObjetivo).subscribe({
          next: () => {
            setTimeout(() => {
              if (newObjetivo.balizas) {
                this._notificationService.notificationSuccess(
                  'Información',
                  'Se ha reasignado una nueva baliza al objetivo.'
                );
              } else {
                this._notificationService.notificationSuccess(
                  'Información',
                  'Se ha eliminado la baliza del objetivo.'
                );
              }
              this.onSearchUnitOfObjetivos();
            }, 1000);
          },
          error: (error) => {
            this.loading = false;
            this.handleErrorMessage(
              error,
              'Error al reasignar nueva baliza al objetivo.'
            );
          },
        });
      }
    });
    //}
  }
  actualizarEstadoBaliza(idBaliza: Baliza, estado: number) {
    let baliza: Baliza = this.listBalizaz.find((item) => item.id == idBaliza);
    const newBaliza = baliza;
    newBaliza.estados = {
      id: estado as number,
    } as Estado;
    this._balizasService.put(newBaliza).subscribe(() => {
      this.onSearchUnitOfObjetivos();
    });
  }
  showModalHistory() {
    const modalTitle = 'Historial balizas';
    const modalRef = this.modalService.create({
      nzTitle: modalTitle,
      nzStyle: { top: '20px' },
      nzMaskClosable: false,
      nzContent: ObjetivosHistoricoComponent,
      nzComponentParams: {
        objetivo: this.selectedObj,
      },
    });
    modalRef.afterClose.subscribe((result) => {});
  }
  configurarBaliza() {
    const modalTitle = 'Configurar Baliza';
    const modalRef = this.modalService.create({
      nzTitle: modalTitle,
      nzStyle: { top: '20px' },
      nzMaskClosable: false,
      nzContent: ConfiguracionBalizaComponent,
      nzComponentParams: {
        baliza: this.selectedObj!.balizas,
      },
    });
    modalRef.afterClose.subscribe((result) => {});
  }
  loadJuzgados() {
    //this.loadingJusgados = true;
    this._juzgadoService.getAll(this.params, this.sort).subscribe({
      next: (result) => {
        this.listJuzgados = [...result.resources];
        //this.loadingJusgados = false;
        this.enableAddJuzgados = this.listJuzgados.length ? true : false;
      },
      error: (error) => {
        //this.loadingJusgados = false;
        this._notificationService.notificationError(
          'Error',
          'Error cargando los juzgados'
        );
      },
    });
  }
  loadUserOffUnit(): void {
    const loggedUser = this._loggedUserService.getLoggedUser();
    if (
      loggedUser.perfil.descripcion == LoggedUserRole.SUPER_ADMIN ||
      loggedUser.perfil.descripcion == LoggedUserRole.UNIT_ADMIN
    ) {
      //this.loadingUsuarios = true;
      this._usersServicio
        .searchAux(
          {
            idunidad: this.selectedOper.unidades?.id,
            tip: '',
            nombre: '',
            apellidos: '',
          },
          this.params,
          this.sort
        )
        .subscribe({
          next: (relations: PagedResourceCollection<any>) => {
            //this.loadingUsuarios = false;
            this.listUsuarios = [...relations.resources];
            //this.totalOfic = relations.totalElements;
            this.enableAddUsuarios = this.listUsuarios.length ? true : false;
          },
          error: (err) => {
            //this.loadingUsuarios = true;
            this.listUsuarios = [];
            this._notificationService.notificationError(
              'Error',
              'Error al cargar los objetivos de la unidad.'
            );
          },
        });
    }
  }
  get setSpand() {
    const loggedUserRole =
      this._loggedUserService.getLoggedUser().perfil.descripcion;
    return loggedUserRole == this.userRoles.SUPER_ADMIN ||
      this.userRoles.UNIT_ADMIN
      ? 3
      : 6;
  }
  showModalWizardPosition() {
    const userLogeado = this._loggedUserService.getLoggedUser();
    const modalTitle = 'Generar informe de posiciones';
    const modalRef = this.modalService.create({
      nzTitle: modalTitle,
      nzStyle: { top: '20px', width: '600px' },
      nzMaskClosable: false,
      nzClosable: true,
      nzContent: WizardPositionsComponent,
      nzFooter: null,
      nzComponentParams: {
        listUsuarios: this.listUsuarios,
        perfil: userLogeado.perfil.id,
        unidad: this.selectedOper.unidades,
        idUsuario: userLogeado.id,
        idoperacion: this.selectedOper!.id,
        diligencias: this.selectedOper!.diligencias,
      },
    });
    modalRef.afterClose.subscribe((result) => {
      if (result.accion === 'GENERATE') {
        // this.informePositionFilterData.emit(result.data);
        const filterData = result.data;
        const objetivosList = filterData.objetivos;

        this.listOfObjetivosToEvidencia = objetivosList;
        const filtro = {
          tipoPrecision: filterData.posType,
          fechaInicio: filterData.startDate,
          fechaFin: filterData.endDate,
        };
        const suscription$ = this.evidenceService
          .generarKMLS(filtro, objetivosList)
          .subscribe();
        this._notificationService.notificationSuccess(
          'Información',
          'Se ha iniciado el proceso de generación de evidencia'
        );
        let cont = 0;
        this._generateEvidenceService.setGenerate(
          EstadosGeneracionEvidencia.INICIADA
        );
        setTimeout(() => {
          cont++;
          if (cont > 1) {
            suscription$.unsubscribe();
          }
        }, 10000);
      }
    });
  }

  async downloadZip() {
    const idAuth = this._loggedUserService.getLoggedUser().id;
    const pathZip: any = await firstValueFrom(
      this.evidenceService.getZipPath(idAuth)
    );
    if (pathZip.path.length == 0) {
      this._notificationService.notificationError(
        'Error',
        'El usuario no tiene evidencias generadas'
      );
      return;
    }

    const nombre = pathZip.path.split('PERSONALIZADOS/')[1];
    this.evidenceService
      .getZipToDownload(idAuth, pathZip.path)
      .subscribe((result: any) => {
        let bFile = new Blob([result], { type: 'application/zip' });
        var a: any = document.createElement('a');
        document.body.appendChild(a);

        a.style = 'display: none';
        var url = window.URL.createObjectURL(bFile);

        a.href = url;
        a.download = nombre;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  isNotDownloadReady() {
    return true;
  }

  handleErrorMessage(error: any, defaultMsg: string): void {
    if (error.status == 400) {
      this._notificationService.notificationError(
        'Error',
        error.error.message.toLowerCase()
      );
    } else if (error.status == 409) {
      this._notificationService.notificationError(
        'Error',
        error.error.message.toLowerCase()
      );
    } else if (error.status == 500) {
      if (
        error.error.message &&
        error.error.message.toLowerCase().includes('fallo')
      ) {
        this._notificationService.notificationError(
          'Error',
          error.error.message
        );
      } else {
        this._notificationService.notificationError('Error', defaultMsg);
      }
    } else {
      this._notificationService.notificationError('Error', defaultMsg);
    }
  }
  setStyleClass() {
    return this.selectedObj ? 'icon-class' : 'icon-disabled';
  }
  setStyleClass2() {
    return this.selectedObjetivo ? 'icon-class' : 'icon-disabled';
  }
  setStyleClass3() {
    return this.isGenerating ? 'icon-disabled' : 'icon-class';
  }
  setStyleClass4() {
    return this.listOfObjetivos.length > 0 || !this.isGenerating
      ? 'icon-class'
      : 'icon-disabled';
  }
  setStyleClassBusqueda() {
    return !this.isNullBusqueda() ? 'icon-class' : 'icon-disabled';
  }
}
