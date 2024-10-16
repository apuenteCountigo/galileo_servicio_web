import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { PagedResourceCollection, Sort } from '@lagoshny/ngx-hateoas-client';
import { PageParam } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { firstValueFrom, forkJoin, Subscription } from 'rxjs';
import { TipoServidor } from 'src/app/core/enums/conexiones.enum';
import { FrmActions } from 'src/app/core/enums/form-acctios';
import { Baliza, DataminerElements } from 'src/app/core/models/baliza.model';
import { Estado } from 'src/app/core/models/estado.model';
import {
  TipoBaliza,
  TipoContrato,
} from 'src/app/core/models/momencaldores.model';
import { Unit } from 'src/app/core/models/unit.model';
import { BalizaService } from 'src/app/core/services/baliza.service';
import { EstadoService } from 'src/app/core/services/estado.service';
import { ExporterService } from 'src/app/core/services/exporter.service';
import { TipoBalizaService } from 'src/app/core/services/nomencladores/tipo-baliza.service';
import { TipoContratoService } from 'src/app/core/services/nomencladores/tipo-contrato.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ServerService } from 'src/app/core/services/server.service';
import { TableBase } from 'src/app/core/utils/table.base';
import { FileUploadModalComponent } from '../../file-upload-modal/file-upload-modal.component';
import { BalizaAsignComponent } from '../baliza-asign/baliza-asign.component';
import { BalizaFormComponent } from '../baliza-form/baliza-form.component';

import { formatISO } from 'date-fns';

export interface SearchData {
  clave: string;
  marca: string;
  modelo: string;
  numSerie: string;
  compania: string;
  objetivo?: string;
  unidad?: number;
  fechaInicio?: string;
  fechaFin?: string;
  idEstadoBaliza?: number;
}
export interface SearchDataObjetivo {
  objetivo: string;
}

@Component({
  selector: 'stock-table',
  templateUrl: './stock-table.component.html',
  styleUrls: ['./stock-table.component.less'],
})
export class StockTableComponent
  extends TableBase
  implements OnInit, OnChanges, OnDestroy
{
  override params: PageParam = {
    page: this.pageIndex - 1,
    size: this.pageSize,
  };

  @Input() isAsignedBalizas: boolean = false;
  @Input() estadoBalizaList: Array<Estado> = new Array();
  @Output() isAsignedBalizasChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  disableBalizaActions = true;
  listOfBalizaStock: Baliza[] = [];
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  balizaToEdit: any = null;
  tipoBalizaList!: TipoBaliza[];
  tipoContratoList!: TipoContrato[];

  override sort: Sort = {
    fechaAlta: 'DESC',
  };

  searchStateQueyParams = {
    descripcion: '',
    id: 0,
    idTipoEntidad: 3,
  };

  serverList: any;

  searchCriteria: SearchData = {
    clave: '',
    marca: '',
    modelo: '',
    numSerie: '',
    compania: '',
    fechaInicio: '',
    fechaFin: '',
    unidad: 0,
    idEstadoBaliza: 0,
  };

  fechaAlta!: Date;
  fi_ff?: Array<Date> = [];
  dateFormat = 'dd/MM/yyyy';

  estadoDisponible?: Estado;

  isCheckedObject: boolean = false;

  isLoadingData = false;

  suscriptions: Array<any> = [];

  dataminerElements!: DataminerElements;

  constructor(
    private _balizaService: BalizaService,
    private modalService: NzModalService,
    private _modalUploadService: NzModalService,
    private _notificationService: NotificationService,
    private _exporterService: ExporterService,
    private datepipe: DatePipe,
    private _estadoService: EstadoService,
    private _serverService: ServerService,
    private _tipoBalizaService: TipoBalizaService,
    private _tipoContratoService: TipoContratoService
  ) {
    super();
  }

  disponibleStatusChange() {
    this.estadoDisponible = this.estadoBalizaList.find(
      (estado) => estado.descripcion == 'Disponible en Unidad'
    );
  }

  onAllChecked(value: boolean): void {
    this.listOfBalizaStock.forEach((item) => {
      this.onExpandChangeBaliza(item, value);
    });
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfBalizaStock.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate =
      this.listOfBalizaStock.some((item) => this.setOfCheckedId.has(item.id)) &&
      !this.checked;
  }

  ngOnInit(): void {
    this.isLoadingData = true;
    this.disponibleStatusChange();
    this.suscriptions.push(
      forkJoin([
        this._serverService.getAll({ page: 0, size: 1000 }),
        this._tipoBalizaService.getAll({ page: 0, size: 1000 }),
        this._tipoContratoService.getAll({ page: 0, size: 1000 }),
      ]).subscribe({
        next: (result) => {
          this.serverList = result[0].resources.filter(
            (server) => server.servicio == TipoServidor.DATAMINER
          );
          this.tipoBalizaList = [...result[1].resources];
          this.tipoContratoList = [...result[2].resources];
          this.isLoadingData = false;
        },
        error: (err) => {
          this._notificationService.notificationError(
            'Error',
            'Ha ocurrido un error al cargar los nomencladores'
          );
          this.loading = false;
        },
      })
    );
    // this.loadData();
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isAsignedBalizas']) {
      if (changes['isAsignedBalizas'].currentValue) {
        this.loadData();
      }
    }
  }

  resetSelection() {
    this.balizaToEdit = null;
    this.expandSet.clear();
    this.disableBalizaActions = true;
  }

  loadData() {
    this.loading = true;
    this.isLoadingData = true;
    this.searchCriteria.idEstadoBaliza = 0;
    this.searchCriteria.unidad = -2;
    this.resetSelection();
    this.suscriptions.push(
      this._balizaService
        .search(this.searchCriteria, this.params, this.sort)
        .subscribe({
          next: (result) => {
            this.listOfBalizaStock = result.resources;
            this.loading = false;
            this.isLoadingData = false;
            this.isAsignedBalizas = false;
            this.isAsignedBalizasChange.emit(false);
            this.total = result.totalElements;
          },

          error: (err) => {
            this._notificationService.notificationError(
              'Error',
              'Ha ocurrido un error al cargar las balizas'
            );
            this.loading = false;
          },
        })
    );
  }

  async showModalBaliza(isEdit: boolean) {
    const modalTitle = isEdit ? 'Editar Baliza' : 'Crear Baliza';

    if (!isEdit) {
      const elements = await firstValueFrom(
        this._balizaService.getCountDataminer()
      );
      if (
        elements[0].amountElementsActive >= elements[0].amountElementsMaximum
      ) {
        this._notificationService.notificationError(
          'Error',
          'Ha alcanzado la cantidad máxima de balizas permitidas en el Dataminer, consulte al Administrador'
        );
        return;
      }
    }

    const modalRefBaliza = this.modalService.create({
      nzTitle: modalTitle,
      nzStyle: { top: '20px', width: '800px' },
      nzMaskClosable: false,
      nzContent: BalizaFormComponent,
      nzComponentParams: {
        balizaToEdit: isEdit ? this.balizaToEdit : null,
        estadoBalizaList: this.estadoBalizaList,
        serverList: this.serverList,
        tipoContratoList: this.tipoContratoList,
        tipoBalizaList: this.tipoBalizaList,
      },
    });

    modalRefBaliza.afterClose.subscribe((result) => {
      if (result.accion != FrmActions.CANCELAR) {
        this.loadData();
        this.resetSelection();
      }
    });
  }

  onExpandChangeBaliza(baliza: Baliza, checked: boolean): void {
    this.expandSet.clear();
    if (checked) {
      this.balizaToEdit = baliza;
      this.expandSet.add(baliza.id);
      this.disableBalizaActions = false;
    } else {
      this.balizaToEdit = null;
      this.expandSet.delete(baliza.id);
      this.disableBalizaActions = true;
    }
  }

  deleteBaliza() {
    this.modalService.confirm({
      nzTitle: 'Confirmación',
      nzContent: `Está seguro de eliminar la baliza ${
        this.balizaToEdit!.clave
      }?`,
      nzOnOk: () => {
        this.suscriptions.push(
          this._balizaService.detele(this.balizaToEdit!).subscribe({
            next: () => {
              this._notificationService.notificationSuccess(
                'Información',
                'Se ha eliminado la baliza correctamente'
              );
              this.loadData();
            },
            error: (error) => {
              this.resetSelection();

              this.handleErrorMessage(
                error,
                'Ocurrió un error al eliminar la baliza'
              );
            },
          })
        );
      },
    });
  }

  assignBaliza() {
    const modalTitle = 'Seleccione la Unidad';
    const modalRefBaliza = this.modalService.create({
      nzTitle: modalTitle,
      nzStyle: { top: '20px', width: '600px' },
      nzMaskClosable: false,
      nzContent: BalizaAsignComponent,
      nzComponentParams: {
        balizaToasignList: null,
      },
    });

    let listOfBalizasToAssign: Baliza[] = [];

    modalRefBaliza.afterClose.subscribe({
      next: (result: { accion: FrmActions; unidadId: number }) => {
        listOfBalizasToAssign = this.listOfBalizaStock.filter((baliza) =>
          this.expandSet.has(baliza.id)
        );
        listOfBalizasToAssign.forEach((baliza) => {
          baliza.unidades = { id: result.unidadId } as Unit;
        });
        const suscriber: any[] = [];
        listOfBalizasToAssign.forEach((baliza) => {
          suscriber.push(this._balizaService.put(baliza));
        });

        forkJoin(suscriber as []).subscribe({
          next: (result) => {
            this.isAsignedBalizasChange.emit(true);
            this.loadData();
          },
          error: (err) => {
            this._notificationService.notificationError(
              'Error',
              err.error.message
            );
          },
        });
      },
    });
  }

  isSingle(id: number): boolean {
    return this.expandSet.has(id) && this.expandSet.size == 1 ? true : false;
  }

  isNullBusqueda() {
    return Object.values(this.searchCriteria).every((value) => {
      if (value === '' || value == 0 || value == -2) {
        return true;
      }
      return false;
    });
  }

  checkCriteria(value: any){
    console.log("Value:", value);
    if ((value === '' || value == 0 || value == -2)) {
      if(this.isNullBusqueda())
        this.loadData();
    }
    // this.searchCriteria = value;
    // const currentIsNullBusqueda = this.isNullBusqueda;
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
      this.sort['fechaAlta'] = 'DESC';
    }

    this.params.page = pageIndex - 1;
    this.params.size = pageSize;
    this.onSearch();
  }

  searchData() {
    this.loading = true;
    this.params.page = 0;
    this.resetSelection();
    this._balizaService
      .search(this.searchCriteria, this.params, this.sort)
      .subscribe({
        next: (balizas: PagedResourceCollection<Baliza>) => {
          this.loading = false;
          this.listOfBalizaStock = [...balizas.resources];
          this.total = balizas.totalElements;
        },
        error: (err) => {
          this._notificationService.notificationError(
            'Error',
            'Ha ocurrido un error al cargar las balizas'
          );
          this.listOfBalizaStock = [];
          this.total = 0;
          this.loading = false;
        },
      });
  }

  resetForm(): void {
    this.searchCriteria.clave = '';
    this.searchCriteria.marca = '';
    this.searchCriteria.modelo = '';
    this.searchCriteria.numSerie = '';
    this.searchCriteria.compania = '';
    this.searchCriteria.fechaFin = '';
    this.searchCriteria.fechaInicio = '';
    this.searchCriteria.idEstadoBaliza = 0;
    this.fi_ff=[];
    this.loadData();
  }

  closeSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.resetForm();
    this.loadData();
  }

  showModalUpload() {
    this._balizaService.getCountDataminer().subscribe((result) => {
      if (result[0].amountElementsActive >= result[0].amountElementsMaximum) {
        this._notificationService.notificationError(
          'Error',
          'Ha alcanzado la cantidad máxima de balizas permitidas en el Dataminer, consulte al Administrador'
        );
        return;
      }
      const modalRef = this._modalUploadService.create({
        nzTitle: 'Importar desde un Fichero',
        nzStyle: { top: '20px' },
        nzMaskClosable: false,
        nzContent: FileUploadModalComponent,
        nzComponentParams: {
          isBaliza: true,
        },
      });
      modalRef.afterClose.subscribe({
        next: (result) => {
          this.loadData();
          if (result) {
            this.loadData();
            setTimeout(() => {
              this._notificationService.notificationSuccess(
                'Información',
                'Se han importado correctamente las balizas'
              );
            }, 1000);
          }
        },
        error: (error) => {
          this._notificationService.notificationError(
            'Error',
            'Ha ocurrido un error al importar las balizas'
          );
        },
      });
    });
  }

  downloadData() {
    const listToExport = this.listOfBalizaStock.map((baliza) => {
      const newData = {
        id: baliza.id,
        clave: baliza.clave,
        marca: baliza.marca,
        modelo: baliza.modelo,
        numSerie: baliza.numSerie,
        compania: baliza.compania,
        estados: baliza.estados?.descripcion,
        fechaAlta: baliza.fechaAlta,
        iccTarjeta: baliza.iccTarjeta,
        idDataminer: baliza.idDataminer,
        idElement: baliza.idElement,
        imei: baliza.imei,
        pin1: baliza.pin1,
        pin2: baliza.pin2,
        puk: baliza.puk,
        serverIp: baliza.serverIp,
        puerto: baliza.puerto,
        tipoBaliza: baliza.tipoBaliza?.descripcion,
        tipoContrato: baliza.tipoContrato?.descripcion,
        coordenada: baliza.tipoCoordenada ? baliza.tipoCoordenada : '',
        notas: baliza.notas,
      };
      return newData;
    });
    const headerList = Object.keys(listToExport[0]);
    const fecha = this.datepipe.transform(new Date(), 'dd/MM/yyyy h:mm:ss');
    this._exporterService.downloadFile(
      listToExport,
      `Balizas_Stock_${fecha}`,
      headerList
    );
  }

  onDateChange(event: Array<Date>) {
    if (event.length == 0) {
      this.searchCriteria.fechaInicio = '';
      this.searchCriteria.fechaFin = '';

      if(this.isNullBusqueda())
        this.loadData();

      return;
    }
    
    if (event && event[0] && event[1]) {
      const startDate: Date = event[0];
      const endDate: Date = event[1];

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59);

      this.searchCriteria.fechaInicio = startDate ? formatISO(startDate) : '';
      this.searchCriteria.fechaFin = endDate ? formatISO(endDate) : '';
    }
    // if (event.length == 0 && this.isNullBusqueda()) {
    //   this.loadData();
    // }
  }

  isDisabled(balizaAction?: boolean): boolean {
    return balizaAction || this.isLoadingData;
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
    return !this.isNullBusqueda() ? 'icon-class' : 'icon-disabled';
  }

  setActionIconClass(action?: boolean) {
    return !this.isDisabled(action) ? 'icon-class' : 'icon-disabled';
  }
}
