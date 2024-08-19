import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PagedResourceCollection, Sort } from '@lagoshny/ngx-hateoas-client';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { EstadosBaliza } from 'src/app/core/enums/estados.enum';
import { Estado } from 'src/app/core/models/estado.model';
import { Unit } from 'src/app/core/models/unit.model';
import { BalizaService } from 'src/app/core/services/baliza.service';
import { EstadoService } from 'src/app/core/services/estado.service';
import { LoggedUserService } from 'src/app/core/services/logged-user.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TableBase } from 'src/app/core/utils/table.base';
import { Baliza } from './../../../models/baliza.model';
export interface SearchData {
  clave: string;
  marca: string;
  numSeries: string;
  compania: string;
  objetivo?: string;
  unidad?: number;
  idEstadoBaliza?: number;
}
interface BusquedaBaliza {
  idEstadoBaliza: number | null;
}

@Component({
  selector: 'app-balizas-tabla',
  templateUrl: './balizas-tabla.component.html',
  styleUrls: ['./balizas-tabla.component.less'],
})
export class BalizasTablaComponent extends TableBase implements OnInit {
  @Input() selectedUnit!: Unit;
  @Output() removeBalizaToStock = new EventEmitter();

  searchCriteria: SearchData = {
    clave: '',
    marca: '',
    numSeries: '',
    compania: '',
    unidad: 0,
    idEstadoBaliza: 0,
  };

  listOfBalizas: Baliza[] = [];

  selectedBaliza: any | null;

  estadoDisponible?: Estado;
  isBalizaDisponible: boolean = false;

  constructor(
    private _balizaService: BalizaService,
    private _notificationService: NotificationService,
    private _loggedUserService: LoggedUserService,
    private _estadoService: EstadoService
  ) {
    super();
  }

  ngOnInit(): void {
    this._estadoService.getAll().subscribe((result) => {
      this.estadoDisponible = result.resources.find(
        (estado) => estado.descripcion == 'Disponible en Unidad'
      );
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
    this.searchCriteria.clave = '';
    this.searchCriteria.marca = '';
    this.searchCriteria.numSeries = '';
    this.searchCriteria.compania = '';
    (this.searchCriteria.unidad = 0),
      (this.searchCriteria.idEstadoBaliza = 0),
      this.onSearchUnitOfBalizas();
  }
  closeSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.resetForm();
  }
  onQueryParamsChangeUnitBaliza(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const rr = sort.map((item) => {
      if (item.value === 'ascend') {
        item.value = 'ASC';
        return item;
      }
      if (item.value === 'descend') {
        item.value = 'DESC';
        return item;
      }
      return;
    });
    this.sort = rr.find((item) => item?.value) as Sort;
    this.params.page = pageIndex - 1;
    this.params.size = pageSize;
    this.onSearchUnitOfBalizas();
  }
  onSearchUnitOfBalizas(): void {
    this.searchCriteria.unidad = this.selectedUnit.id;

    const userLogeado = this._loggedUserService.getLoggedUser();
    this.loading = true;
    this.sort = { ...this.sort, fechaCreacion: 'DESC' };
    this._balizaService
      .search(this.searchCriteria, this.params, this.sort)
      .subscribe({
        next: (relations: PagedResourceCollection<any>) => {
          this.loading = false;
          this.listOfBalizas = [...relations.resources];
          //this.totalOfic = relations.totalElements;
        },
        error: (err) => {
          this.loading = false;
          this.listOfBalizas = [];
          this._notificationService.notificationError(
            'Error',
            'Ha ocurrido un error al cargar las balizas.'
          );
        },
      });
  }

  onCheckChange(baliza: Baliza, checked: boolean): void {
    this.expandSet.clear();
    if (checked) {
      this.expandSet.add(baliza.id);
      this.selectedBaliza = baliza;
      if (
        baliza.estados.descripcion == EstadosBaliza.OPERATIVA ||
        baliza.estados.descripcion == EstadosBaliza.EN_INSTALACION
      ) {
        this.isBalizaDisponible = false;
      } else {
        this.isBalizaDisponible = true;
      }
    } else {
      this.selectedBaliza = null;
      this.isBalizaDisponible = false;
    }
  }

  removeBalizaToGeneralStock(): void {
    this.loading = true;
    if (this.selectedBaliza) {
      this.selectedBaliza.unidades = undefined;
      this.selectedBaliza.estados = { id: this.estadoDisponible!.id } as Estado;
      this._balizaService.put(this.selectedBaliza).subscribe({
        next: (result) => {
          this.loading = false;
          this.expandSet.clear();
          this.selectedBaliza = null;
          this.removeBalizaToStock.emit();
          this.onSearchUnitOfBalizas();
          this._notificationService.notificationSuccess(
            'Información',
            'Baliza enviada al stock general correctamente.'
          );
        },
        error: (err) => {
          this.loading = false;
          this._notificationService.notificationError(
            'Error',
            'Ha ocurrido un error al enviar la baliza al stock general.'
          );
        },
      });
    }
  }

  setStyleClass() {
    return !this.isNullBusqueda() ? 'icon-class' : 'icon-disabled';
  }

  setStyleClassIcon() {
    return this.expandSet.size > 0 && this.isBalizaDisponible
      ? 'icon-class'
      : 'icon-disabled';
  }
}
