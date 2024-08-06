import { Component, OnInit } from '@angular/core';
import { Sort } from '@lagoshny/ngx-hateoas-client';
import { PageParam } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Baliza } from '../../models/baliza.model';
import { Estado } from '../../models/estado.model';
import { BalizaService } from '../../services/baliza.service';
import { BreadCrumbService } from '../../services/bread-crumb.service';
import { EstadoService } from '../../services/estado.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-baliza',
  templateUrl: './baliza.component.html',
  styleUrls: ['./baliza.component.less'],
})
export class BalizaComponent implements OnInit {
  isAsignedBalizas = false;
  selectedIndex = 0;

  searchStateQueyParams = {
    descripcion: '',
    id: 0,
    idTipoEntidad: 3,
  };

  estadoBalizaList: Array<Estado> = new Array();

  constructor(
    private _breadrumbService: BreadCrumbService,
    private _estadoService: EstadoService
  ) {}

  ngOnInit(): void {
    this.updateBreadCrumb('altaBalizas');
    this.updateBreadCrumb('stocks');
    this._estadoService.filterByType(this.searchStateQueyParams).subscribe({
      next: (result) => {
        this.estadoBalizaList = result.resources;
      },
      error: (e) => {},
    });
  }

  showModal() {}

  updateBreadCrumb(valor: any, seleccionado?: any) {
    this._breadrumbService.updateBreadCrumb.emit({
      valor: valor,
      seleccionado: seleccionado,
    });
  }
}
