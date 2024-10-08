import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { PagedResourceCollection, Sort } from '@lagoshny/ngx-hateoas-client';
import { PageParam } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { formatISO } from 'date-fns';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { FrmActions } from 'src/app/core/enums/form-acctios';
import { Estado } from 'src/app/core/models/estado.model';
import { Juzgado } from 'src/app/core/models/juzgado.model';
import { Operacion } from 'src/app/core/models/operacion.model';
import { OperacionComponent } from 'src/app/core/pages/operacion/operacion.component';
import { BreadCrumbService } from 'src/app/core/services/bread-crumb.service';
import { EstadoService } from 'src/app/core/services/estado.service';
import { JuzgadoService } from 'src/app/core/services/juzgado.service';
import { LoggedUserService } from 'src/app/core/services/logged-user.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { OperacionService } from 'src/app/core/services/operacion.service';
import { TableBase } from 'src/app/core/utils/table.base';
import { OperacionesFormComponent } from '../operaciones-form/operaciones-form.component';
import { Unit } from './../../../models/unit.model';
import { WebSocketService } from 'src/app/core/services/ws/websocket.service';

@Component({
  selector: 'app-operaciones-tabla',
  templateUrl: './operaciones-tabla.component.html',
  styleUrls: ['./operaciones-tabla.component.less'],
})
export class OperacionesTablaComponent
  extends TableBase
  implements OnInit, OnDestroy
{
  @Input() selectedUnit!: Unit;
  @Input() selectedOper!: any;
  @Output() selectOperation = new EventEmitter<any>();
  @Output() accionChange = new EventEmitter<boolean>();

  operacionModalRef!: NzModalRef<OperacionComponent>;
  listOfOperaciones: Operacion[] = [];
  selectedOperacion: any = null;
  balizasEstados!: Array<Estado>;

  selectedIndex = 0;
  pageSizeOfic = 10;
  pageIndexOfic = 1;
  sortOperacion: Sort = {
    'p.fechaCreacion': 'DESC',
  };
  paramsOperacion: PageParam = {
    page: this.pageIndexOfic - 1,
    size: this.pageSizeOfic,
  };

  searchCriteria = {
    descripcion: '',
    idOperacion: 0,
    estado: 0,
  };

  juzgadosList: Juzgado[] = [];
  estadosList: Estado[] = [];

  suscriptions: Array<any> = [];

  constructor(
    private _operacionService: OperacionService,
    private modalService: NzModalService,
    private _notificationService: NotificationService,
    private notificationService: NotificationService,
    private _breadrumbService: BreadCrumbService,
    private _loggedUserService: LoggedUserService,
    private _estadoService: EstadoService,
    private _juzgadoService: JuzgadoService,
    private webSocketService: WebSocketService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = false;
    const searchEstados = {
      id: 0,
      idTipoEntidad: 6,
      descripcion: '',
    };
    this.suscriptions.push(
      this._estadoService.filterByType(searchEstados).subscribe((result) => {
        this.balizasEstados = result.resources;
      })
    );
    this.loadJuzgadosData();
    this.loadEstadosData();
    // this.webSocketService.connect();
    // this.webSocketService.socket.onmessage=(event)=>{
    //   this.onMessage(event);
    // };
  }

  onMessage(event:any): void {
    console.log("onMessage");
    console.log(event);
    
    this.notificationService.notificationError(
      'Error',
      event.data
    );
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
    // this.webSocketService.disconnect();
  }

  isNullBusqueda() {
    return Object.values(this.searchCriteria).every((value) => {
      if (value == '' || value == 0) {
        return true;
      }
      return false;
    });
  }
  resetForm(): void {
    this.searchCriteria.descripcion = '';
    this.searchCriteria.idOperacion = 0;
    this.searchCriteria.estado = 0;
    this.onSearchUnitOfOperaciones();
  }
  closeSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.searchCriteria.descripcion = '';
    this.searchCriteria.idOperacion = 0;
    this.searchCriteria.estado = 0;
    this.onSearchUnitOfOperaciones();
  }
  //---CRUD---//
  override showModal(isEdit?: boolean) {
    // this.webSocketService.sendMessage('SHOWMODAL');
    const modalTitle = isEdit ? 'Editar Operación' : 'Agregar Operación';
    const modalRef = this.modalService.create({
      nzTitle: modalTitle,
      nzStyle: { top: '20px' },
      nzMaskClosable: false,
      nzContent: OperacionesFormComponent,
      nzComponentParams: {
        operacionToEdit: isEdit ? this.selectedOper : null,
        selectedUnit: this.selectedUnit,
        juzgadosList: this.juzgadosList,
        estadosList: this.estadosList,
      },
    });
    modalRef.afterClose.subscribe((result) => {
      if (result.accion != FrmActions.CANCELAR) {
        this.clearSelection();
        this.onSearchUnitOfOperaciones();
      }
    });
  }

  deleteOperacion() {
    this.modalService.confirm({
      nzTitle: 'Confirmación',
      nzContent: `Está seguro de eliminar la operacion ${this.selectedOper.descripcion}?`,
      nzOnOk: () => {
        this.suscriptions.push(
          this._operacionService.detele(this.selectedOper).subscribe({
            next: (result) => {
              this.clearSelection();
              this.onSearchUnitOfOperaciones();
              this._notificationService.notificationSuccess(
                'Información',
                'La operación ha sido eliminada correctamente'
              );
              this.accionChange.emit(true);
            },
            error: (error) => {
              this.handleErrorMessage(
                error,
                'Ha ocurrido un error al eliminar la operación.'
              );
            },
          })
        );
        this.updateBreadCrumb('obje');
        this.expandSet.delete(this.selectedOper.id);
      },
    });
  }

  onExpandChangeOperacion(operacion: Operacion, checked: boolean): void {
    this.expandSet.clear();
    if (checked) {
      this.expandSet.add(operacion.id);
      this.selectedOperacion = operacion;
      this.selectOperation.emit(operacion);
      this.updateBreadCrumb('oper', operacion.descripcion);
    } else {
      this.expandSet.delete(operacion.id);
      this.selectedOperacion = null;
      this.selectOperation.emit(null);
      this.updateBreadCrumb('oper');
    }
  }

  onQueryParamsChangeUnitOperacion(params: NzTableQueryParams): void {
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
    this.onSearchUnitOfOperaciones();
  }

  onSearchUnitOfOperaciones(): void {
    this.loading = true;
    this.suscriptions.push(
      this._operacionService
        .search(
          {
            idunidad: this.selectedUnit?.id,
            fechaInicio: '',
            fechaFin: '',
            descripcion: this.searchCriteria.descripcion,
            idEstado: this.searchCriteria.estado,
          },
          this.params,
          this.sort
        )
        .subscribe({
          next: (relations: PagedResourceCollection<any>) => {
            this.loading = false;
            this.listOfOperaciones = [...relations.resources];
            this.total = relations.totalElements;
            //this.totalOfic = relations.totalElements;
          },
          error: (err) => {
            this.loading = false;
            this.listOfOperaciones = [];
            this.notificationService.notificationError(
              'Error',
              'Ha ocurrido un error al cargar las operaciones.'
            );
          },
        })
    );
  }
  //---CRUD---//

  //--BreadCrumb---//
  updateBreadCrumb(valor: any, seleccionado?: any) {
    this._breadrumbService.updateBreadCrumb.emit({
      valor: valor,
      seleccionado: seleccionado,
    });
  }

  get setSpand() {
    const loggedUserRole =
      this._loggedUserService.getLoggedUser().perfil.descripcion;
    return loggedUserRole == this.userRoles.SUPER_ADMIN ||
      loggedUserRole == this.userRoles.UNIT_ADMIN
      ? 6
      : 18;
  }
  //--BreadCrumb---//

  clearSelection() {
    this.expandSet.clear();
    this.selectedOperacion = null;
    this.selectedOper = null;
    this.selectOperation.emit(null);
  }

  loadJuzgadosData() {
    this.loading = true;
    const paramsJuzgado: PageParam = {
      page: 0,
      size: 1000,
    };
    this.suscriptions.push(
      this._juzgadoService.getAll(paramsJuzgado, this.sort).subscribe({
        next: (result) => {
          this.juzgadosList = [...result.resources];
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this._notificationService.notificationError(
            'Error',
            'Error cargando los juzgados'
          );
        },
      })
    );
  }

  loadEstadosData() {
    this.loading = true;
    const filterEstado = {
      descripcion: '',
      id: 0,
      idTipoEntidad: 6,
    };

    this.suscriptions.push(
      this._estadoService.filterByType(filterEstado).subscribe({
        next: (result) => {
          this.estadosList = [...result.resources];
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this._notificationService.notificationError(
            'Error',
            'Error cargando los estados'
          );
        },
      })
    );
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
}
