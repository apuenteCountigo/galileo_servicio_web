import { Component, OnInit } from '@angular/core';
import { Sort } from '@lagoshny/ngx-hateoas-client';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { JuzgadoSearchQuery } from '../../constants/juzgado.query';
import { Juzgado } from '../../models/juzgado.model';
import { JuzgadoService } from '../../services/juzgado.service';
import { NotificationService } from '../../services/notification.service';
import { TableBase } from '../../utils/table.base';
import { JuzgadosFormComponent } from '../juzgados-form/juzgados-form.component';

@Component({
  selector: 'app-juzgados',
  templateUrl: './juzgados.component.html',
  styleUrls: ['./juzgados.component.less'],
})
export class JuzgadosComponent extends TableBase implements OnInit {
  juzgadosList: Juzgado[] = [];
  selectedJuzgado?: Juzgado;
  disableJuzgadoActions = true;
  query: JuzgadoSearchQuery = new JuzgadoSearchQuery();

  searchCriteria = {
    descripcion: '',
  };

  constructor(
    private modalService: NzModalService,
    private _juzgadoService: JuzgadoService,
    private _notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this._juzgadoService.getAll(this.params, this.sort).subscribe({
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
    });
  }

  override onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    this.sort = {};
    sort.forEach((s) => {
      if (s.value) {
        this.sort[s.key] = s.value == 'ascend' ? 'ASC' : 'DESC';
      }
    });
    this.sort['fechaCreacion'] = 'DESC';
    this.params.page = pageIndex - 1;
    this.params.size = pageSize;
    this.onSearch();
  }

  onSearch() {
    if (this.isNullBusqueda()) {
      this.loadData();
    } else {
      this.searchData();
    }
  }

  searchData() {
    this.loading = true;
    this._juzgadoService
      .searchBy(this.query.FILTRAR, {
        descripcion: this.searchCriteria.descripcion,
        id: 0,
      })
      .subscribe((result) => {
        this.juzgadosList = [...result.resources];
        this.loading = false;
      });
  }

  isNullBusqueda() {
    return Object.values(this.searchCriteria).every((value) => {
      if (value === null || value === '') {
        return true;
      }
      return false;
    });
  }

  resetForm() {
    this.searchCriteria.descripcion = '';
    this.loadData();
  }

  closeSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.resetForm();
  }

  showModalJuzgados(isEdit: boolean) {
    const modalTitle = isEdit ? 'Editar Juzgado' : 'Agregar Juzgado';
    const modalRef = this.modalService.create({
      nzTitle: modalTitle,
      nzStyle: { top: '20px' },
      nzMaskClosable: false,
      nzContent: JuzgadosFormComponent,
      nzComponentParams: {
        juzgadoToEdit: isEdit ? this.selectedJuzgado : undefined,
      },
    });

    modalRef.afterClose.subscribe((result) => {
      if (!isEdit) {
        this._juzgadoService.create(result.newJuzgado).subscribe({
          next: () => {
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha insertado el juzgado correctamente'
            );
            this.selectedJuzgado = undefined;
            this.expandSet.clear();
            this.loadData();
          },
          error: (error) => {
            this.selectedJuzgado = undefined;
            this.expandSet.clear();
            this._notificationService.notificationError(
              'Error',
              'No se ha creado el juzgado'
            );
          },
        });
      } else {
        this._juzgadoService.update(result.newJuzgado).subscribe({
          next: () => {
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha modificado el juzgado correctamente'
            );
            this.selectedJuzgado = undefined;
            this.expandSet.clear();
            this.loadData();
          },
          error: (error) => {
            this.selectedJuzgado = undefined;
            this.expandSet.clear();
            this._notificationService.notificationError(
              'Error',
              'No se ha modificado el juzgado'
            );
          },
        });
      }
    });
  }

  deleteJuzgado() {
    this.modalService.confirm({
      nzTitle: 'Confirmación',
      nzContent: `Está seguro de eliminar el juzgado ${
        this.selectedJuzgado!.descripcion
      }?`,
      nzOnOk: () => {
        this._juzgadoService.detele(this.selectedJuzgado!).subscribe({
          next: () => {
            this.selectedJuzgado = undefined;
            this.expandSet.clear();
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha eliminado el juzgado correctamente'
            );
            this.loadData();
          },
          error: (error) => {
            this._notificationService.notificationError(
              'Error',
              'No se ha eliminado el juzgado'
            );
          },
        });
      },
    });
  }

  onExpandChangeJuzgado(juzgado: any, checked: boolean): void {
    this.expandSet.clear();
    if (checked) {
      this.expandSet.add(juzgado.id);
      this.selectedJuzgado = juzgado;
      this.disableJuzgadoActions = false;
    } else {
      this.selectedJuzgado = undefined;
      this.disableJuzgadoActions = true;
      this.expandSet.delete(juzgado.id);
    }
  }
}
