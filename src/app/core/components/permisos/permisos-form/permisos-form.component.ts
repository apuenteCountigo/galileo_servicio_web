import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagedResourceCollection, Sort } from '@lagoshny/ngx-hateoas-client';
import { PageParam } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { FrmActions } from 'src/app/core/enums/form-acctios';
import { Operacion } from 'src/app/core/models/operacion.model';
import { Permiso } from 'src/app/core/models/permiso.model';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { TableBase } from 'src/app/core/utils/table.base';
import { ButtonInterface } from '../../user/user-form/user-form.component';
import { Objetivo } from './../../../models/objetivo.modal';
import { User } from './../../../models/users.model';

interface BusquedaPermiso {
  tip: string | null;
}

@Component({
  selector: 'app-permisos-form',
  templateUrl: './permisos-form.component.html',
  styleUrls: ['./permisos-form.component.less'],
})
export class PermisosFormComponent
  extends TableBase
  implements OnInit, OnDestroy
{
  @Input() selectedOper!: Operacion;
  @Input() selectedObj?: Objetivo;

  expandSetWrite = new Set<number | string>();
  expandSetRead = new Set<number | string>();

  listUsuarios: any[] = [];
  selectedOficialListWrite: Array<User> = [];
  selectedOficialListRead: Array<User> = [];

  searchCriteria: BusquedaPermiso = {
    tip: '',
  };

  selectAllRead: boolean = false;
  selectAllWrite: boolean = false;

  suscriptions: Array<any> = [];

  constructor(
    private _permisoService: PermisosService,
    private _notificationService: NotificationService,
    private modalRef: NzModalRef
  ) {
    super();
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnInit(): void {
    //this.loadUser();
  }

  override onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    this.sort = {} as Sort;
    sort.forEach((s) => {
      if (s.value) {
        this.sort[s.key] = s.value == 'ascend' ? 'ASC' : 'DESC';
      }
    });

    this.params.page = pageIndex - 1;
    this.params.size = pageSize;

    this.loadUser();
  }
  loadUser(): void {
    this.loading = true;
    var query = this.selectedObj ? 'objetivo' : 'operacion';
    var idEntidad = this.selectedObj
      ? this.selectedObj.id
      : this.selectedOper.id;

    this.suscriptions.push(
      this._permisoService
        .searchPermisosSinAsignar(
          {
            tip: this.searchCriteria.tip,
            nombre: '',
            apellidos: '',
            idEntidad: idEntidad,
            unidad: this.selectedOper.unidades?.id,
          },
          this.params,
          this.sort,
          query
        )
        .subscribe({
          next: (usuariosPermisos: PagedResourceCollection<Permiso>) => {
            this.loading = false;
            this.listUsuarios = [...usuariosPermisos.resources];
            this.total = usuariosPermisos.totalElements;
            if (!this.total) {
              this._notificationService.notificationWarning(
                'Advertencia',
                'Su unidad no cuenta con usuarios, no podrá asignar permisos'
              );
            }
          },
          error: (err) => {
            this._notificationService.notificationError(
              'Error',
              'Ha ocurrido un error al cargar los usuarios'
            );
            this.loading = false;
          },
        })
    );
  }
  onItemCheckedWrite(user: User, checked: boolean): void {
    if (checked) {
      this.expandSetWrite.add(user.id);
      this.selectedOficialListWrite.push(user);

      //SI esta marcado en lectura lo eliminamos del array d elos de lectura
      const index = this.selectedOficialListRead.findIndex(
        (so) => so.id == user.id
      );
      if (index >= 0) {
        this.selectedOficialListRead = this.selectedOficialListRead.filter(
          (so) => so.id != user.id
        );
        this.expandSetRead.delete(user.id);
      }
      //Si esta marcado en lectura lo eliminamos del array de los de lectura
    } else {
      this.expandSetWrite.delete(user.id);
      const index = this.selectedOficialListWrite.findIndex(
        (so) => so.id == user.id
      );
      this.selectedOficialListWrite.splice(index, 1);
    }
  }
  onItemCheckedRead(user: User, checked: boolean): void {
    if (checked) {
      this.expandSetRead.add(user.id);
      this.selectedOficialListRead.push(user);

      const index = this.selectedOficialListWrite.findIndex(
        (so) => so.id == user.id
      );
      if (index >= 0) {
        this.selectedOficialListWrite = this.selectedOficialListWrite.filter(
          (so) => so.id != user.id
        );
        this.expandSetWrite.delete(user.id);
      }
    } else {
      this.expandSetRead.delete(user.id);
      const index = this.selectedOficialListRead.findIndex(
        (so) => so.id == user.id
      );
      this.selectedOficialListRead.splice(index, 1);
    }
  }
  cancelForm(): void {
    this.modalRef.close({ accion: FrmActions.CANCELAR });
  }
  checkFormValidity() {
    return this.selectedOficialListWrite.length == 0 &&
      this.selectedOficialListRead.length == 0
      ? true
      : false;
  }
  assignPermisos() {
    this.modalRef.close({
      accion: FrmActions.ASIGNAR,
      data: {
        usuarios: this.selectedOficialListWrite,
        tipoEntidad: this.selectedObj ? { id: 8 } : { id: 6 },
        idEntidad: this.selectedObj
          ? this.selectedObj.id
          : this.selectedOper.id,
        oficialListRead: this.selectedOficialListRead,
        oficialListWrite: this.selectedOficialListWrite,
        // usuarios: { id: this.formModalPermiso.value.usuarios },
        // permisos: this.formModalPermiso.value.permisos ? 'e' : 'l',
      },
    });
  }

  //Search
  isNullBusqueda() {
    return Object.values(this.searchCriteria).every((value) => {
      if (value === null || value === '' || value === 0) {
        return true;
      }
      return false;
    });
  }
  resetForm(): void {
    this.searchCriteria.tip = '';
    this.loadUser();
  }
  closeSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.resetForm();
  }

  onAllCheckedRead(): void {
    if (!this.selectAllRead) {
      this.listUsuarios.forEach((user) => {
        //Marco todos los elementos de lectura
        this.expandSetRead.add(user.id);
        this.selectedOficialListRead.push(user);
        //Marco todos los elementos de escritura
        this.expandSetWrite.delete(user.id);
      });
      this.selectedOficialListWrite = [];
    } else {
      this.listUsuarios.forEach((user) => {
        //Marco todos los elementos de lectura
        this.expandSetRead.delete(user.id);
      });
      this.selectedOficialListRead = [];
    }

    this.selectAllRead = !this.selectAllRead;
    this.selectAllWrite = false;
  }

  onAllCheckedWrite(): void {
    if (!this.selectAllWrite) {
      this.listUsuarios.forEach((user) => {
        //Marco todos los elementos de lectura
        this.expandSetWrite.add(user.id);
        this.selectedOficialListWrite.push(user);
        //Marco todos los elementos de escritura
        this.expandSetRead.delete(user.id);
      });
      this.selectedOficialListRead = [];
    } else {
      this.listUsuarios.forEach((user) => {
        //Marco todos los elementos de lectura
        this.expandSetWrite.delete(user.id);
      });
      this.selectedOficialListWrite = [];
    }

    this.selectAllWrite = !this.selectAllWrite;
    this.selectAllRead = false;
  }
}
