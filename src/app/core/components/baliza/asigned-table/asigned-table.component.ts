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
import { PagedResourceCollection } from '@lagoshny/ngx-hateoas-client';
import { Sort } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { formatISO } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';
import { EstadosBaliza } from 'src/app/core/enums/estados.enum';
import { Baliza } from 'src/app/core/models/baliza.model';
import { Estado } from 'src/app/core/models/estado.model';
import { Unit } from 'src/app/core/models/unit.model';
import { BalizaService } from 'src/app/core/services/baliza.service';
import { EstadoService } from 'src/app/core/services/estado.service';
import { ExporterService } from 'src/app/core/services/exporter.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UnitService } from 'src/app/core/services/unit.service';
import { TableBase } from 'src/app/core/utils/table.base';
import { SearchData } from '../stock-table/stock-table.component';

export interface SearchDataObjetivo {
  objetivo: string;
}

@Component({
  selector: 'asigned-table',
  templateUrl: './asigned-table.component.html',
  styleUrls: ['./asigned-table.component.less'],
})
export class AsignedTableComponent
  extends TableBase
  implements OnInit, OnChanges, OnDestroy
{
  @Input() isAsignedBalizas: boolean = false;
  @Input() estadoBalizaList: Array<Estado> = new Array();
  @Output() isAsignedBalizasChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  //para utilizar el componente desde la pantalla de unidades --Leo--
  @Input() selectedUnit?: Unit;

  disableBalizaActions = true;
  listOfBalizaAsigned: Baliza[] = [];
  listOfUnidades!: Unit[];
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  loadingUnidades = false;
  fechaAlta?: Date;
  dateFormat = 'dd/MM/yyyy';

  estadoDisponible?: Estado;
  override loading: boolean = false;

  override sort!: Sort;

  searchCriteria: SearchData = {
    clave: '',
    marca: '',
    modelo: '',
    numSeries: '',
    compania: '',
    fechaInicio: '',
    fechaFin: '',
    objetivo: '',
    unidad: 0,
    idEstadoBaliza: 0,
  };

  searchStateQueyParams = {
    descripcion: '',
    id: 0,
    idTipoEntidad: 3,
  };

  counter = 0;

  isCheckedObject: boolean = false;
  unidadesOfBalizasFilter: any[] = [];
  aux: any[] = [];

  suscriptions: Array<any> = [];

  constructor(
    private _balizaService: BalizaService,
    private _unidadService: UnitService,
    private _notificationService: NotificationService,
    private _exporterService: ExporterService,
    private _estadoService: EstadoService,
    private datepipe: DatePipe,
    private modalService: NzModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadUnidades();
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  disponibleStatusChange() {
    this.estadoDisponible = this.estadoBalizaList.find(
      (estado) => estado.descripcion == 'Disponible en Unidad'
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    //para poder reutilizar el componente en la pantalla de unidades --Leo--
    if (changes['isAsignedBalizas']) {
      if (changes['isAsignedBalizas'].currentValue) {
        this.loadData();
      }
    }
  }

  loadUnidades() {
    this.loadingUnidades = true;
    this.suscriptions.push(
      this._unidadService
        .getAll({ page: 0, size: 1000 })
        .subscribe({
            next: (result) => {
            this.listOfUnidades = [...result.resources];
            this.loadingUnidades = false;
          },
          error: (err) => {
            this.loadingUnidades = false;
          }
        }
      )
    );
  }

  loadData() {
    this.loading = true;
    this.searchCriteria.unidad = -1;
    this.suscriptions.push(
      this._balizaService
        .search(this.searchCriteria, this.params, this.sort)
        .subscribe({
          next: (result) => {
            this.counter++;
            this.listOfBalizaAsigned = result.resources;
            this.loading = false;
            this.isAsignedBalizas = false;
            this.total = result.totalElements;
            this.isAsignedBalizasChange.emit(false);
          },
          error: (err) => {
            this.loading = false;
          },
        })
    );
  }

  onAllChecked(value: boolean): void {
    this.listOfBalizaAsigned.forEach((item) => {
      this.onExpandChangeBaliza(item, value);
    });
    this.refreshCheckedStatus();
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfBalizaAsigned.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate =
      this.listOfBalizaAsigned.some((item) =>
        this.setOfCheckedId.has(item.id)
      ) && !this.checked;
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onExpandChangeBaliza(baliza: Baliza, checked: boolean): void {
    if (checked) {
      this.expandSet.add(baliza.id);
    } else {
      this.expandSet.delete(baliza.id);
    }
    switch (this.expandSet.size) {
      case 1:
        this.disableBalizaActions = false;
        break;

      default:
        this.disableBalizaActions = true;
        break;
    }
  }

  assignBaliza() {
    this.isAsignedBalizas = true;
    this.loadData();
    this.isAsignedBalizasChange.emit(true);
  }

  isSingle(id: number): boolean {
    return this.expandSet.has(id) && this.expandSet.size == 1 ? true : false;
  }

  removeBaliza() {
    let listOfBalizasToRemove: Baliza[];
    const temp = this.listOfBalizaAsigned.filter((baliza) =>
      this.expandSet.has(baliza.id)
    );
    const isInOperation = temp.some(
      (b) =>
        b.estados.descripcion == EstadosBaliza.OPERATIVA ||
        b.estados.descripcion == EstadosBaliza.EN_INSTALACION
    );
    const modalTitle = isInOperation
      ? 'Hay una o más balizas asociadas a objetivos, ¿desea continuar y devolver la baliza al stock general?'
      : '¿Desea continuar y devolver la baliza al stock general?';
    this.modalService.confirm({
      nzTitle: 'Confirmación',
      nzContent: modalTitle,
      nzOnOk: () => {
        listOfBalizasToRemove = JSON.parse(JSON.stringify(temp));
        listOfBalizasToRemove.forEach((balizaRemove) => {
          balizaRemove.unidades = undefined;
        });
        const suscriber: any[] = [];
        listOfBalizasToRemove.forEach((baliza) => {
          suscriber.push(this._balizaService.put(baliza));
        });
        this.suscriptions.push(
          forkJoin(suscriber as []).subscribe({
            next: (result) => {
              this.isAsignedBalizasChange.emit(true);
              this._notificationService.notificationSuccess(
                'Información',
                'Baliza(s) removida(s) al stock general'
              );
              this.loadData();
            },
            error: (e) => {
              this._notificationService.notificationError(
                'Error',
                e.error.message
              );
            },
          })
        );
      },
    });
  }

  isNullBusqueda() {
    return Object.values(this.searchCriteria).every((value) => {
      if (value === '' || value == 0 || value == -1) {
        return true;
      }
      return false;
    });
  }

  onSearch() {
    if (this.isNullBusqueda()) {
      this.loadData();
    } else if (!this.isCheckedObject) {
      this.params.page = 0;
      this.searchData();
    } else {
      this.searchDataByObjetiv();
    }
  }

  override onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    this.sort = {};
    sort.forEach((s) => {
      if (s.value) {
        this.sort[s.key] = s.value == 'ascend' ? 'ASC' : 'DESC';
      }
    });
    this.sort['fechaAlta'] = 'DESC';
    this.params.page = pageIndex - 1;
    this.params.size = pageSize;

    this.loadData();
  }

  searchData() {
    this.loading = true;
    this.params.page = 0;
    this.searchCriteria.unidad = this.searchCriteria.unidad
      ? this.searchCriteria.unidad
      : 0;
    this.suscriptions.push(
      this._balizaService
        .search(this.searchCriteria, this.params, this.sort)
        .subscribe({
          next: (balizas: PagedResourceCollection<Baliza>) => {
            this.loading = false;
            this.listOfBalizaAsigned = [];
            if (balizas.resources.length > 0) {
              this.listOfBalizaAsigned = balizas.resources.filter((baliza) => {
                return baliza.unidades;
              });
            }
            this.total = balizas.totalElements;
          },
          error: (err) => {
            this._notificationService.notificationError(
              'Error',
              'Ha ocurrido un error al cargar las balizas'
            );
            this.listOfBalizaAsigned = [];
            this.total = 0;
            this.loading = false;
          },
        })
    );
  }

  resetForm(): void {
    this.searchCriteria.clave = '';
    this.searchCriteria.marca = '';
    this.searchCriteria.modelo = '';
    this.searchCriteria.numSeries = '';
    this.searchCriteria.compania = '';
    this.searchCriteria.fechaFin = '';
    this.searchCriteria.fechaInicio = '';
    this.searchCriteria.idEstadoBaliza = 0;
    this.loadData();
  }

  closeSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.resetForm();
    this.loadData();
  }

  downloadData() {
    const listToExport = this.listOfBalizaAsigned.map((baliza) => {
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
        unidad: baliza.unidades?.denominacion,
        notas: baliza.notas,
        objetivo: baliza.objetivo,
        operacion: baliza.operacion,
        fechaAsignaOp: baliza.fechaAsignaOp,
        fechaAsignaUni: baliza.fechaAsignaUni,
      };
      return newData;
    });
    const headerList = Object.keys(listToExport[0]);
    const fecha = this.datepipe.transform(new Date(), 'dd/MM/yyyy h:mm:ss');
    this._exporterService.downloadFile(
      listToExport,
      `Balizas_Asignadas_${fecha}`,
      headerList
    );
  }
  desahbilitarCampos(e: string) {
    if (e.length > 0) {
      this.isCheckedObject = true;
    } else {
      this.isCheckedObject = false;
    }
  }
  searchDataByObjetiv() {
    this.loading = true;
    let parmetros = {
      idObjetivo: 0,
      objetivo: this.searchCriteria.objetivo,
    };
    this.params.page = 0;
    this.suscriptions.push(
      this._balizaService
        .searchByObjetiv(parmetros, this.params, this.sort)
        .subscribe({
          next: (balizas: PagedResourceCollection<Baliza>) => {
            this.loading = false;
            this.listOfBalizaAsigned = [...balizas.resources];
            this.total = balizas.totalElements;
          },
          error: (err) => {
            this._notificationService.notificationError(
              'Error',
              'Ha ocurrido un error al cargar las balizas'
            );
            this.listOfBalizaAsigned = [];
            this.total = 0;
            this.loading = false;
          },
        })
    );
  }

  onDateChange(event: Array<Date>) {
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

  setStyleClass() {
    return !this.isNullBusqueda() ? 'icon-class' : 'icon-disabled';
  }

  setStyleClassIcon() {
    return this.expandSet.size > 0 ? 'icon-class' : 'icon-disabled';
  }

  // setActionIconClass(action?: boolean) {
  //   return !this.isDisabled(action) ? 'icon-class' : 'icon-disabled';
  // }
}
