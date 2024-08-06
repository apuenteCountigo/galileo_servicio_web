import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@lagoshny/ngx-hateoas-client';
import { differenceInCalendarDays } from 'date-fns';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UserUnitSearchQuery } from 'src/app/core/constants/user-unit.query';
import { FiltroUnidades } from 'src/app/core/enums/unit-filters.enum';
import { Estado } from 'src/app/core/models/estado.model';
import { UnitSearchCriteria } from 'src/app/core/models/interfaces';
import { Unit } from 'src/app/core/models/unit.model';
import { User } from 'src/app/core/models/users.model';
import { EstadoService } from 'src/app/core/services/estado.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UnitUserRelationService } from 'src/app/core/services/unit-user-relation.service';
import { UnitService } from 'src/app/core/services/unit.service';
import { TableBase } from 'src/app/core/utils/table.base';

import { format } from 'date-fns';
import { LoggedUserRole } from 'src/app/core/enums/user-role.enum';
import { EstadosUser } from 'src/app/core/enums/estados.enum';

@Component({
  selector: 'app-select-unidades',
  templateUrl: './select-unidades.component.html',
  styleUrls: ['./select-unidades.component.less'],
})
export class SelectUnidadesComponent
  extends TableBase
  implements OnInit, OnDestroy
{
  @Input() user!: User;
  @Output() listOfUnidades!: Unit[];
  setOfCheckedUnitId = new Set<number>();
  listOfAllUnidades: Unit[] = [];

  query: UserUnitSearchQuery = new UserUnitSearchQuery();

  form!: FormGroup;

  filter = {
    descripcion: '',
    id: 0,
    idTipoEntidad: 4,
  };

  searchCriteria: UnitSearchCriteria = {
    perfil: 0,
    idUsuario: 0,
    denominacion: '',
    responsable: '',
    provinciaDescripcion: '',
    provinciaId: 0,
    localidad: '',
  };

  fechaExpiracion?: Date;

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) < 0;
  dateFormat = 'dd/MM/yyyy';

  unitSearchByDenominacion = '';

  estados!: Estado[];
  selectedEstado?: Estado;

  // userEstado!: Estado[];
  isGuestStatus: boolean = false;

  suscriptions: Array<any> = [];

  constructor(
    private _unidadesService: UnitService,
    private _estadosService: EstadoService,
    private _unitUserRelationService: UnitUserRelationService,
    private _notificationService: NotificationService,
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private changeRef: ChangeDetectorRef
  ) {
    super();
    this.form = this.fb.group({
      estado: ['', [Validators.required]],
      fechaExpiracion: ['', []],
    });
  }

  onClick(): void {
    let selectedUnidades: Unit[] = [];

    selectedUnidades = this.listOfAllUnidades.filter((unidad) => {
      return this.setOfCheckedUnitId.has(unidad.id);
    });

    if (this.form.get('estado')?.value.descripcion != 'PERMANENTE') {
      const expira = format(
        this.form.get('fechaExpiracion')?.value,
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
      );
      this.modalRef.destroy({
        selectedUnidades,
        expira: expira,
        estado: this.form.get('estado')?.value,
      });
    } else {
      const estado = this.estados.find(
        (estado) => estado.descripcion == 'PERMANENTE'
      );
      const filter = {
        idUsuario: this.user.id,
        idEstado: estado ? estado.id : 0,
        fechaInicio: '',
        fechaFin: '',
      };

      this.suscriptions.push(
        this._unitUserRelationService
          .searchBy(filter, this.query.FILTRAR_UNIDADES)
          .subscribe((result) => {
            if (result.resources.length == 0) {
              this.modalRef.destroy({
                selectedUnidades,
                expira: '',
                estado: this.form.get('estado')?.value,
              });
            } else {
              this._notificationService.notificationError(
                'Error',
                'El usuario ya pertenece a una unidad de forma permanente'
              );
            }
          })
      );
    }
  }

  loadUnidades() {
    this.loading = true;
    this.suscriptions.push(
      this._unidadesService
        .searchBy(
          { idUsuario: this.user.id, denominacion: '' },
          FiltroUnidades.SINASIGNAR,
          this.params,
          this.sort
        )
        .subscribe({
          next: (result) => {
            this.listOfAllUnidades = [...result.resources];
            this.total = result.totalElements;
            this.loading = false;
          },
          error: (error) => {
            this.loading = false;
          },
        })
    );
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

    this.loadUnidades();
  }

  loadEstados() {
    this.suscriptions.push(
      this._estadosService.filterByType(this.filter).subscribe({
        next: (result) => {
          this.estados = [...result.resources];
          if (this.user.perfil.descripcion === LoggedUserRole.GUEST_USER) {
            const index = this.estados.findIndex(
              (e) => e.descripcion == EstadosUser.PERMANENTE
            );
            this.estados.splice(index, 1);
          }
          this.selectedEstado = this.estados[0];
          this.changeRef.detectChanges();
        },
      })
    );
  }

  ngOnInit(): void {
    this.loadUnidades();
    this.loadEstados();
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      if (!this.isGuestStatus) {
        this.setOfCheckedUnitId.clear();
      }
      this.setOfCheckedUnitId.add(id);
    } else {
      this.setOfCheckedUnitId.delete(id);
    }
  }

  closeForm() {
    this.modalRef.close({ accion: 'CANCELAR' });
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
  }

  selectStatusChange(e: any): void {
    switch (e.descripcion) {
      case 'INVITADO':
        this.isGuestStatus = true;
        this.setOfCheckedUnitId.clear();
        // this.fechaExpiracion = undefined;
        this.form.get('fechaExpiracion')!.addValidators(Validators.required);
        this.form.updateValueAndValidity();
        break;
      default:
        this.isGuestStatus = false;
        this.setOfCheckedUnitId.clear();
        // this.fechaExpiracion = undefined;
        this.form.get('fechaExpiracion')!.clearValidators();
        this.form.updateValueAndValidity();
        break;
    }
  }

  resetForm() {
    this.loadUnidades();
  }

  setDateEvt(event: any) {
    const expira = format(event, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
  }

  checkForm() {
    return this.form.invalid || this.setOfCheckedUnitId.size == 0
      ? true
      : false;
  }
}
