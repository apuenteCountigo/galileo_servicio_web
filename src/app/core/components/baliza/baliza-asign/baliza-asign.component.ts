import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Sort } from '@lagoshny/ngx-hateoas-client';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { FrmActions } from 'src/app/core/enums/form-acctios';
import { Unit } from 'src/app/core/models/unit.model';
import { UnitService } from 'src/app/core/services/unit.service';
import { TableBase } from 'src/app/core/utils/table.base';

@Component({
  selector: 'app-baliza-asign',
  templateUrl: './baliza-asign.component.html',
  styleUrls: ['./baliza-asign.component.less'],
})
export class BalizaAsignComponent
  extends TableBase
  implements OnInit, OnDestroy
{
  @Input() balizaToasignList = null;

  unidadesList: Unit[] = [];
  selectedUnidadId: number = 0;

  suscriptions: Array<any> = [];

  constructor(
    private _unidadesService: UnitService,
    private modalRef: NzModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadUnidadesData();
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  loadUnidadesData() {
    this.loading = true;
    this.suscriptions.push(
      this._unidadesService.getAll(this.params, this.sort).subscribe({
        next: (result) => {
          this.loading = false;
          this.unidadesList = result.resources;
          this.total = result.totalElements;
        },
      })
    );
  }

  AsignUnit() {
    this.modalRef.destroy({
      accion: FrmActions.ASIGNAR,
      unidadId: this.selectedUnidadId,
    });
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
    this.loadUnidadesData();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.clear();
      this.expandSet.add(id);
      this.selectedUnidadId = id;
    } else {
      this.expandSet.delete(id);
      this.selectedUnidadId = 0;
    }
  }

  closeForm() {
    this.modalRef.close({ accion: FrmActions.CANCELAR });
  }
}
