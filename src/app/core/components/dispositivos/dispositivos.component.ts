import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Sort } from '@lagoshny/ngx-hateoas-client';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BalizaSearchQuery } from '../../constants/baliza.query';
import { EstadosBalizaDataminer } from '../../enums/estados.enum';
import { Objetivo } from '../../models/objetivo.modal';
import { BreadCrumbService } from '../../services/bread-crumb.service';
import { ConfigBalizaAPIService } from '../../services/config-baliza-api.service';
import { ConfiguracionBalizaService } from '../../services/configuracion-baliza.service';
import { LoggedUserService } from '../../services/logged-user.service';
import { NotificationService } from '../../services/notification.service';
import { ObjetivosService } from '../../services/objetivos.service';
import { TableBase } from '../../utils/table.base';
import { BreadCrumbComponent } from '../bread-crumb/bread-crumb.component';

@Component({
  selector: 'app-dispositivos',
  templateUrl: './dispositivos.component.html',
  styleUrls: ['./dispositivos.component.less'],
})
export class DispositivosComponent extends TableBase implements OnInit {
  @Output() selectBaliza = new EventEmitter<any>();
  @Input() dataApi!: any;

  devicesList!: Objetivo[];
  selectedDevice?: Objetivo;
  query: BalizaSearchQuery = new BalizaSearchQuery();

  idInterval: any;

  searchCriteria = {
    idUsuario: this._loggedUserService.getLoggedUser().id,
    clave: '',
    nombreUnidad: '',
    nombreOperacion: '',
    nombreObjetivo: '',
  };
  disableConfig: boolean = true;

  constructor(
    private _objetivoService: ObjetivosService,
    private _loggedUserService: LoggedUserService,
    private _breadcrumbService: BreadCrumbService,
    private configuracionBalizaService: ConfiguracionBalizaService,
    private _notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = false;
  }

  ngOnDestroy(): void {
    if (this.idInterval) {
      clearInterval(this.idInterval);
      this.idInterval=null;
    }
  }

  loadData() {
    this.loading = true;
    this._objetivoService
      .searchDevices(this.searchCriteria, this.params, this.sort)
      .subscribe({
        next: (result) => {
          this.loading = false;
          this.devicesList = [...result.resources];
          this.total = result.totalElements;
        },
        error: (error) => {
          this.loading = false;
        },
      });
  }

  onExpandChangeDevice(device: Objetivo, checked: boolean): void {
    this.expandSet.clear();
    if (checked) {
      this.selectedDevice = device;
      this.expandSet.add(device.id);
      this.updateBreadCrumb('informacion', device.balizas.clave);
      this.selectBaliza.emit(device);
      this.idInterval = setInterval(() => {
        this.isBalizaOn();
        this._breadcrumbService.estado$.subscribe((result) => {
          if (result == EstadosBalizaDataminer.ENCENDIDA) {
            clearInterval(this.idInterval);
          }
        });
      }, 10000);
    } else {
      this.selectedDevice = undefined;
      this.expandSet.delete(device.id);
      this.updateBreadCrumb('informacion');
      clearInterval(this.idInterval);
      this._breadcrumbService.setEstado(EstadosBalizaDataminer.SIN_INICIAR);
      this.selectBaliza.emit(null);
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

  isNullBusqueda() {
    return Object.values(this.searchCriteria).every((value) => {
      if (value === null || value === '') {
        return true;
      }
      return false;
    });
  }

  onSearch() {
    if (!this.isNullBusqueda()) {
      this.pageIndex = 1;
    }
    this.loadData();
  }

  resetForm(): void {
    this.searchCriteria.clave = '';
    this.searchCriteria.nombreUnidad = '';
    this.searchCriteria.nombreOperacion = '';
    this.searchCriteria.nombreObjetivo = '';
    this.loadData();
  }

  closeSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.resetForm();
  }

  updateBreadCrumb(valor: any, seleccionado?: any, isOn?: any) {
    this._breadcrumbService.updateBreadCrumb.emit({
      valor,
      seleccionado,
      isOn,
    });
  }

  isBalizaOn() {
    this.configuracionBalizaService
      .isBalizaOn({
        idDataminer: this.selectedDevice?.balizas.idDataminer,
        idElement: this.selectedDevice?.balizas.idElement,
      })
      .subscribe({
        next: (result) => {
          this._breadcrumbService.setEstado(
            result
              ? EstadosBalizaDataminer.ENCENDIDA
              : EstadosBalizaDataminer.APAGADA
          );
        },
        error: (err) => {
          this._notificationService.notificationError(
            'Error',
            'Error al conocer estado de la baliza.'
          );
        },
      });
  }
}
