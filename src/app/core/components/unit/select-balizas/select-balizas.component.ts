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
import { Unit } from 'src/app/core/models/unit.model';

import { PagedResourceCollection, Sort } from '@lagoshny/ngx-hateoas-client';
import { LoggedUserService } from 'src/app/core/services/logged-user.service';
import { BalizaService } from 'src/app/core/services/baliza.service';
import { NzCardModule } from 'ng-zorro-antd/card';

import { formatISO } from 'date-fns';
import { SearchData } from '../../unidades/balizas-tabla/balizas-tabla.component';
import { Baliza } from 'src/app/core/models/baliza.model';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-select-balizas',
  templateUrl: './select-balizas.component.html',
  styleUrls: ['./select-balizas.component.less'],
})
export class SelectBalizasComponent
  extends TableBase
  implements OnInit, OnDestroy
{
//   @Input() unidad!: Unit;
//   freeOficialList: Array<User> = [];
//   selectedOficialList: Array<User> = [];
//   filter = {
//     descripcion: '',
//     id: 0,
//     idTipoEntidad: 4,
//   };

  searchCriteria: SearchData = {
    clave: '',
    marca: '',
    numSeries: '',
    compania: '',
    unidad: 0,
    idEstadoBaliza: 0,
  };

  listUnAsigned: Baliza[] = [];
  selectedBalizasList: Baliza[] = [];

  estados!: Array<Estado>;
  defaultState?: Estado;

  dateFormat = 'dd/MM/yyyy';

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) <= 0;

  statusRelationForm!: FormGroup;

  isGuestStatus: boolean = false;

  suscriptions: Array<any> = [];

  constructor(
    private _balizaService: BalizaService,
    private _notificationService: NotificationService,
    private _loggedUserService: LoggedUserService,
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
    // this.searchCriteria.asignar = EstadosUser.PERMANENTE;
  }

  ngOnInit(): void {
    this.loading = true;
    this.searchCriteria.unidad = -2;
    this.loadData();
    //this.unidad.id;
    // this.suscriptions.push(
    //   this._estadoService.filterByType(this.filter).subscribe({
    //     next: (result) => {
    //       this.estados = [...result.resources];
    //       this.defaultState = this.estados.find(
    //         (e) => e.descripcion == EstadosUser.PERMANENTE
    //       );
    //     },
    //   })
    // );
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  loadData() {
    this.loading = true;
    this.searchCriteria.unidad = -2;//this.selectedUnit.id;
    const userLogeado = this._loggedUserService.getLoggedUser();
    this.sort = { ...this.sort, fechaCreacion: 'DESC' };
    this._balizaService
      .search(this.searchCriteria, this.params, this.sort)
      .subscribe({
        next: (relations: PagedResourceCollection<any>) => {
            // this.loading = false;
            this.listUnAsigned = [...relations.resources];
            this.loading = false;
            //this.totalOfic = relations.totalElements;
        },
        error: (err) => {
          // this.loading = false;
          this.listUnAsigned = [];
          this.loading = false;
          this._notificationService.notificationError(
            'Error',
            'Ha ocurrido un error al cargar las balizas.'
          );
        },
      });
    // this.suscriptions.push(
    //   this._userService
    //     .searchFreeOficials(this.searchCriteria, this.params, this.sort)
    //     .subscribe({
    //       next: (result) => {
    //         this.freeOficialList = result.resources;
    //         this.total = result.totalElements;
    //         this.loading = false;
    //       },
    //     })
    // );
  }

  override onQueryParamsChange(params: NzTableQueryParams): void {
    console.log("onQueryParamsChange");
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

//   selectStatusChange(event: any) {
//     if (event) {
//       if (event.id == Estados.INVITADO) {
//         this.statusRelationForm
//           .get('fecha')
//           ?.addValidators(Validators.required);
//       } else {
//         this.statusRelationForm.get('fecha')?.clearValidators();
//       }
//       this.statusRelationForm.updateValueAndValidity();
//       this.isGuestStatus = event.id == Estados.INVITADO;
//       this.searchCriteria.asignar =
//         event.descripcion == EstadosUser.PERMANENTE
//           ? EstadosUser.PERMANENTE
//           : '';
//       this.loadData();
//     }
//   }

  cancelForm(): void {
    this.modalRef.close({ accion: FrmActions.CANCELAR });
  }

  assignUsers() {
    alert('ASIGNAR BALIZAS');
    // let dateFinal;
    // if (this.isGuestStatus) {
    //   dateFinal = formatISO(
    //     this.statusRelationForm.value.fecha.setHours(23, 59, 59)
    //   );
    //   dateFinal = dateFinal.slice(0, -6);
    // }
    // this.modalRef.close({
    //   accion: FrmActions.ASIGNAR,
    //   data: {
    //     usuarios: this.selectedOficialList,
    //     unidad: this.unidad,
    //     estado: this.statusRelationForm.value.estado,
    //     expira: this.statusRelationForm.value.fecha
    //       ? // ? formatISO(this.statusRelationForm.value.fecha)
    //         dateFinal
    //       : '',
    //   },
    // });
  }

  checkFormValidity() {
    return this.statusRelationForm.invalid ||
      this.selectedBalizasList.length == 0
      ? true
      : false;
  }

  onSearchFilterGuest() {
    this.loadData();
  }

  isNullSearchGestForm() {
    return (
      this.searchCriteria.clave == '' &&
      this.searchCriteria.compania == '' &&
      this.searchCriteria.numSeries == ''
    );
  }

  setIconClass() {
    return this.isNullSearchGestForm() ? 'icon-disabled' : 'icon-class';
  }

  resetForm() {
    this.searchCriteria.clave == '';
    this.searchCriteria.compania == '';
    this.searchCriteria.numSeries == '';
    this.loadData();
  }

  closeSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.resetForm();
  }

  onItemChecked(baliza: Baliza, checked: boolean): void {
    // this.updateCheckedSet(id, checked);
    if (checked) {
      this.expandSet.add(baliza.id);
      this.selectedBalizasList.push(baliza);
    } else {
      this.expandSet.delete(baliza.id);
      const index = this.selectedBalizasList.findIndex(
        (so) => so.id == baliza.id
      );
      this.selectedBalizasList.splice(index, 1);
    }
    console.log("******selectedBalizasList");
    console.log(this.selectedBalizasList);
  }
}
