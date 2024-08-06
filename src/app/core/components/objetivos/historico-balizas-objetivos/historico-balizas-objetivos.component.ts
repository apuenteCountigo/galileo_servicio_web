import { Component, Input, OnInit } from '@angular/core';
import { Sort } from '@lagoshny/ngx-hateoas-client';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TableBase } from 'src/app/core/utils/table.base';
import { Objetivo } from '../../../models/objetivo.modal';

interface BusquedaBaliza {
  idEstadoBaliza: number | null;
}

@Component({
  selector: 'app-historico-balizas-objetivos',
  templateUrl: './historico-balizas-objetivos.component.html',
  styleUrls: ['./historico-balizas-objetivos.component.less'],
})
export class HistoricoBalizasObjetivosComponent
  extends TableBase
  implements OnInit
{
  @Input() selectedObj!: Objetivo;

  searchCriteria: BusquedaBaliza = {
    idEstadoBaliza: 0,
  };

  listOffHistoric: any[] = [];

  constructor() {
    super();
  }

  ngOnInit(): void {}

  isNullBusqueda() {
    return Object.values(this.searchCriteria).every((value) => {
      if (value === null || value === '' || value === 0) {
        return true;
      }
      return false;
    });
  }
  resetForm(): void {
    this.searchCriteria.idEstadoBaliza = 0;
    this.onSearchObjetivosHistorico();
  }
  closeSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.resetForm();
  }
  onQueryParamsChangeObjetivosHistorico(params: NzTableQueryParams): void {
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
    this.onSearchObjetivosHistorico();
  }
  onSearchObjetivosHistorico(): void {
    // const userLogeado = this._loggedUserService.getLoggedUser();
  }
}
