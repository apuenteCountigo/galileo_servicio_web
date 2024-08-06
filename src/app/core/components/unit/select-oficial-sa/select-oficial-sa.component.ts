import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Estado } from 'src/app/core/models/estado.model';
import { User } from 'src/app/core/models/users.model';
import { EstadoService } from 'src/app/core/services/estado.service';
import { TableBase } from 'src/app/core/utils/table.base';
import { differenceInCalendarDays } from 'date-fns';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Estados, EstadosUser } from 'src/app/core/enums/estados.enum';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FrmActions } from 'src/app/core/enums/form-acctios';
import { UserService } from 'src/app/core/services/user.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Sort } from '@lagoshny/ngx-hateoas-client';
import { Unit } from 'src/app/core/models/unit.model';

import { formatISO } from 'date-fns';

@Component({
  selector: 'app-select-oficial-sa',
  templateUrl: './select-oficial-sa.component.html',
  styleUrls: ['./select-oficial-sa.component.less'],
})
export class SelectOficialSaComponent
  extends TableBase
  implements OnInit, OnDestroy
{
  @Input() unidad!: Unit;
  freeOficialList: Array<User> = [];
  selectedOficialList: Array<User> = [];
  filter = {
    descripcion: '',
    id: 0,
    idTipoEntidad: 4,
  };

  searchCriteria = {
    tip: '',
    nombre: '',
    apellidos: '',
    idunidad: 0,
    asignar: '',
  };

  estados!: Array<Estado>;
  defaultState?: Estado;

  dateFormat = 'dd/MM/yyyy';

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) <= 0;

  statusRelationForm!: FormGroup;

  isGuestStatus: boolean = false;

  suscriptions: Array<any> = [];

  constructor(
    private _estadoService: EstadoService,
    private _userService: UserService,
    private fb: FormBuilder,
    private modalRef: NzModalRef
  ) {
    super();
    this.statusRelationForm = fb.group({
      estado: [{}, [Validators.required]],
      fecha: ['', []],
    });
    this.searchCriteria.asignar = EstadosUser.PERMANENTE;
  }

  ngOnInit(): void {
    this.loading = true;
    this.searchCriteria.idunidad = this.unidad.id;
    this.suscriptions.push(
      this._estadoService.filterByType(this.filter).subscribe({
        next: (result) => {
          this.estados = [...result.resources];
          this.defaultState = this.estados.find(
            (e) => e.descripcion == EstadosUser.PERMANENTE
          );
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  loadData() {
    this.loading = true;
    this.suscriptions.push(
      this._userService
        .searchFreeOficials(this.searchCriteria, this.params, this.sort)
        .subscribe({
          next: (result) => {
            this.freeOficialList = result.resources;
            this.total = result.totalElements;
            this.loading = false;
          },
        })
    );
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

    this.loadData();
  }

  selectStatusChange(event: any) {
    if (event) {
      if (event.id == Estados.INVITADO) {
        this.statusRelationForm
          .get('fecha')
          ?.addValidators(Validators.required);
      } else {
        this.statusRelationForm.get('fecha')?.clearValidators();
      }
      this.statusRelationForm.updateValueAndValidity();
      this.isGuestStatus = event.id == Estados.INVITADO;
      this.searchCriteria.asignar =
        event.descripcion == EstadosUser.PERMANENTE
          ? EstadosUser.PERMANENTE
          : '';
      this.loadData();
    }
  }

  cancelForm(): void {
    this.modalRef.close({ accion: FrmActions.CANCELAR });
  }

  assignUsers() {
    let dateFinal;
    if (this.isGuestStatus) {
      dateFinal = formatISO(
        this.statusRelationForm.value.fecha.setHours(23, 59, 59)
      );
      dateFinal = dateFinal.slice(0, -6);
    }
    this.modalRef.close({
      accion: FrmActions.ASIGNAR,
      data: {
        usuarios: this.selectedOficialList,
        unidad: this.unidad,
        estado: this.statusRelationForm.value.estado,
        expira: this.statusRelationForm.value.fecha
          ? // ? formatISO(this.statusRelationForm.value.fecha)
            dateFinal
          : '',
      },
    });
  }

  checkFormValidity() {
    return this.statusRelationForm.invalid ||
      this.selectedOficialList.length == 0
      ? true
      : false;
  }

  onSearchFilterGuest() {
    this.loadData();
  }

  isNullSearchGestForm() {
    return (
      this.searchCriteria.tip == '' &&
      this.searchCriteria.nombre == '' &&
      this.searchCriteria.apellidos == ''
    );
  }

  setIconClass() {
    return this.isNullSearchGestForm() ? 'icon-disabled' : 'icon-class';
  }

  resetForm() {
    this.searchCriteria.tip = '';
    this.searchCriteria.nombre = '';
    this.searchCriteria.apellidos = '';
    this.loadData();
  }

  closeSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.resetForm();
  }

  onItemChecked(user: User, checked: boolean): void {
    // this.updateCheckedSet(id, checked);
    if (checked) {
      this.expandSet.add(user.id);
      this.selectedOficialList.push(user);
    } else {
      this.expandSet.delete(user.id);
      const index = this.selectedOficialList.findIndex(
        (so) => so.id == user.id
      );
      this.selectedOficialList.splice(index, 1);
    }
  }
}
