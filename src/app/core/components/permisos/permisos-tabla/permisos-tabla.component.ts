import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PagedResourceCollection, Sort } from '@lagoshny/ngx-hateoas-client';
import { PageParam } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';
import { Permiso } from 'src/app/core/models/permiso.model';
import { BreadCrumbService } from 'src/app/core/services/bread-crumb.service';
import { TableBase } from 'src/app/core/utils/table.base';
import { Objetivo } from './../../../models/objetivo.modal';
import { Operacion } from './../../../models/operacion.model';
import { NotificationService } from './../../../services/notification.service';
import { PermisosService } from './../../../services/permisos.service';
import { PermisosFormComponent } from './../permisos-form/permisos-form.component';

interface BusquedaPermiso {
  tip: string | null;
  nombre: string | null;
}

@Component({
  selector: 'app-permisos-tabla',
  templateUrl: './permisos-tabla.component.html',
  styleUrls: ['./permisos-tabla.component.less'],
})
export class PermisosTablaComponent
  extends TableBase
  implements OnInit, OnDestroy
{
  @Input() selectedOper!: Operacion;
  @Input() selectedObj?: Objetivo;

  listOfPermisos: Permiso[] = [];
  selectedPermiso: any = null;

  pageSizeOfic = 2;
  pageIndexOfic = 1;
  sortPermisos!: Sort;
  paramsPermiso: PageParam = {
    page: this.pageIndexOfic - 1,
    size: this.pageSizeOfic,
  };

  searchCriteria: BusquedaPermiso = {
    tip: '',
    nombre: '',
  };

  query: string = '';

  suscriptions: Array<any> = [];

  constructor(
    private _permisoService: PermisosService,
    private _notificationService: NotificationService,
    private modalService: NzModalService,
    private _breadrumbService: BreadCrumbService
  ) {
    super();
  }

  isNullBusqueda() {
    return Object.values(this.searchCriteria).every((value) => {
      if (value === null || value === '' || value === 0) {
        return true;
      }
      return false;
    });
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  resetForm(): void {
    this.searchCriteria.tip = '';
    this.searchCriteria.nombre = '';
    this.onSearchPermisosOperacion();
  }

  closeSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.searchCriteria.tip = '';
    this.searchCriteria.nombre = '';
    this.onSearchPermisosOperacion();
  }

  override showModal() {
    const modalTitle = 'Agregar Permiso';
    const modalRef = this.modalService.create({
      nzTitle: modalTitle,
      nzStyle: { top: '20px' },
      nzMaskClosable: false,
      nzContent: PermisosFormComponent,
      nzComponentParams: {
        //operacionToEdit: isEdit ? this.selectedOperacion : null,
        selectedOper: this.selectedOper,
        selectedObj: this.selectedObj,
      },
    });

    modalRef.afterClose.subscribe({
      next: (result) => {

        if (result != undefined) {
          const userPermisoRead: any[] = [];
        const userPermisoWrite: any[] = [];

        result.data.oficialListRead.forEach((usuario: Permiso) => {
          const permiso = {
            tipoEntidad: { id: result.data.tipoEntidad.id },
            idEntidad: result.data.idEntidad,
            usuarios: { id: usuario.id },
            permisos: 'l',
          };
          userPermisoRead.push(this._permisoService.create(permiso));
        });
        this.suscriptions.push(
          forkJoin(userPermisoRead as []).subscribe({
            next: () => {
              this.onSearchPermisosOperacion();
            },
            error: (error) => {
              this._notificationService.notificationError(
                'Error',
                error.error.message
              );
            },
          })
        );

        result.data.oficialListWrite.forEach((usuario: Permiso) => {
          const permiso = {
            tipoEntidad: { id: result.data.tipoEntidad.id },
            idEntidad: result.data.idEntidad,
            usuarios: { id: usuario.id },
            permisos: 'e',
          };
          userPermisoWrite.push(this._permisoService.create(permiso));
        });
        this.suscriptions.push(
          forkJoin(userPermisoWrite as []).subscribe((createdRel) => {
            this.onSearchPermisosOperacion();
          })
        );
        }        
      },
      error: (error) => {
        this._notificationService.notificationError(
          'Error',
          'Ha ocurrido un error al asignar los permisos'
        );
      },
    });
  }

  onQueryParamsChangePermisosOperacion(params: NzTableQueryParams): void {
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
    this.onSearchPermisosOperacion();
  }

  onSearchPermisosOperacion(): void {
    this.query = this.selectedObj ? 'objetivo' : 'operacion';
    var idEntidad = this.selectedObj
      ? this.selectedObj.id
      : this.selectedOper.id;
    this.loading = true;
    this.suscriptions.push(
      this._permisoService
        .searchPermisosAsignados(
          {
            tip: this.searchCriteria.tip,
            nombre: this.searchCriteria.nombre,
            apellidos: '',
            idEntidad: idEntidad,
            unidad: this.selectedOper.unidades?.id,
          },
          this.params,
          this.sort,
          this.query
        )
        .subscribe({
          next: (relations: PagedResourceCollection<any>) => {
            this.loading = false;
            this.listOfPermisos = [...relations.resources];
          },
          error: (err) => {
            this.loading = false;
            this.listOfPermisos = [];
            this._notificationService.notificationError(
              'Error',
              'Ha ocurrido un error al cargar los permisos.'
            );
          },
        })
    );
  }
  onExpandChangePermiso(permiso: Permiso, checked: boolean): void {
    if (checked) {
      this.expandSet.add(permiso.id);
      this.selectedPermiso = permiso;
    } else {
      this.expandSet.delete(permiso.id);
      this.selectedPermiso = null;
    }
  }

  updateBreadCrumb(valor: any, seleccionado?: any) {
    this._breadrumbService.updateBreadCrumb.emit({
      valor: valor,
      seleccionado: seleccionado,
    });
  }

  deleteOperacion() {
    this.modalService.confirm({
      nzTitle: 'Confirmación',
      nzContent: `Está seguro de eliminar el permiso del usuario ${this.selectedPermiso.usuarios.tip}?`,
      nzOnOk: () => {
        this.suscriptions.push(
          this._permisoService
            .detele(this.selectedPermiso)
            .subscribe(() => this.onSearchPermisosOperacion())
        );
        this.updateBreadCrumb('obje');
        this.expandSet.delete(this.selectedPermiso.id);
      },
    });
  }

  ngOnInit(): void {
    //this.loadData();
  }

  ActualizarPermiso(permiso: Permiso, checked: boolean) {
    this.suscriptions.push(
      this._permisoService
        .patch({ id: permiso.id, permisos: checked ? 'e' : 'l' })
        .subscribe({
          next: (result) => {
            this._notificationService.notificationSuccess(
              'Información',
              'Permiso creado correctamente'
            );
            this.onSearchPermisosOperacion();
          },
          error: (error) => {
            this._notificationService.notificationError(
              'Error',
              'Ha ocurrido un error al cambiar el permiso'
            );
          },
        })
    );
  }

  setStyleClass() {
    return this.selectedPermiso ? 'icon-class' : 'icon-disabled';
  }

  setStyleClassBusqueda() {
    return !this.isNullBusqueda() ? 'icon-class' : 'icon-disabled';
  }
}
