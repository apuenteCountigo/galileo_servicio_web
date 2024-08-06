import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin } from 'rxjs';
import { UserUnitSearchQuery } from 'src/app/core/constants/user-unit.query';
import { Estado } from 'src/app/core/models/estado.model';
import { Unit, UnitUserRelation } from 'src/app/core/models/unit.model';
import { User } from 'src/app/core/models/users.model';
import { EstadoService } from 'src/app/core/services/estado.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UnitUserRelationService } from 'src/app/core/services/unit-user-relation.service';
import { UnitService } from 'src/app/core/services/unit.service';
import { TableBase } from 'src/app/core/utils/table.base';
import { SelectUnidadesComponent } from '../select-unidades/select-unidades.component';

import { formatISO } from 'date-fns';

@Component({
  selector: 'app-unidad-asociada',
  templateUrl: './unidad-asociada.component.html',
  styleUrls: ['./unidad-asociada.component.less'],
})
export class UnidadAsociadaComponent
  extends TableBase
  implements OnInit, OnChanges, OnDestroy
{
  @Input() selectedUser!: User;
  @Input() override loading!: boolean;

  listOfUserUnidades!: UnitUserRelation[];
  query: UserUnitSearchQuery = new UserUnitSearchQuery();

  selectedUnitUser?: UnitUserRelation;
  listOfUnidades?: Unit[];
  estados?: Estado[];
  unitUserActions = true;
  filter = {
    descripcion: '',
    id: 0,
    idTipoEntidad: 4,
  };

  searchCriteria = {
    unidad: 0,
    estado: 0,
    fechaInicio: '',
    fechaFin: '',
  };

  fechaExpiracion?: Array<Date>;
  dateFormat = 'dd/MM/yyyy';

  suscriptions: Array<any> = [];

  constructor(
    private modalService: NzModalService,
    private _unitUserRelationService: UnitUserRelationService,
    private _notificationService: NotificationService,
    private _unidadService: UnitService,
    private _estadosService: EstadoService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUser'].currentValue) {
      const user = changes['selectedUser'].currentValue as User;
      this.loadUnitsData(user);
    }
  }

  ngOnInit(): void {
    this.suscriptions.push(
      this._unidadService
        .getAll({ page: 0, size: 1000 })
        .subscribe((result) => {
          this.listOfUnidades = [...result.resources];
        })
    );
    this.suscriptions.push(
      this._estadosService.filterByType(this.filter).subscribe({
        next: (result) => {
          this.estados = [...result.resources];
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  showAsignUnitModal() {
    const modalTitle = 'Asignar a unidad';
    const modalRefUnidades = this.modalService.create({
      nzTitle: modalTitle,
      nzStyle: { top: '20px', width: '800px' },
      nzMaskClosable: false,
      nzContent: SelectUnidadesComponent,
      nzComponentParams: {
        user: this.selectedUser,
      },
    });

    modalRefUnidades.afterClose.subscribe({
      next: (result) => {
        const userUnitArray: any[] = [];
        result.selectedUnidades.forEach((unit: Unit) => {
          const userAssign = {
            usuario: { id: this.selectedUser.id },
            unidad: { id: unit.id },
            estado: { id: result.estado.id },
            expira: result.expira ? result.expira : '',
          };
          userUnitArray.push(this._unitUserRelationService.create(userAssign));
        });
        this.suscriptions.push(
          forkJoin(userUnitArray as []).subscribe((createdRel) => {
            this.loadUnitsData(this.selectedUser);
          })
        );
        setTimeout(() => {
          const msg =
            result.estado.descripcion == 'PERMANENTE'
              ? 'El usuario ha sido asignado como permanente correctamente a la unidad'
              : 'El usuario ha sido invitado correctamente a la unidad';
          this._notificationService.notificationSuccess('Información', msg);
        }, 2000);
      },
      error: (error) => {
        this._notificationService.notificationError(
          'Error',
          'Ha ocurrido un error'
        );
      },
    });
  }

  loadUnitsData(user: User) {
    this.loading = true;
    this.suscriptions.push(
      this._unitUserRelationService
        .searchBy(
          { idUsuario: user.id, idEstado: 0 },
          this.query.FILTRAR_UNIDADES
        )
        .subscribe({
          next: (result) => {
            this.listOfUserUnidades = result.resources;

            this.loading = false;
          },
          error: (error) => {
            this.loading = false;
          },
        })
    );
  }

  deleteUserUnit() {
    this.modalService.confirm({
      nzTitle: 'Confirmación',
      nzContent: `Está seguro que desea eliminar el usuario ${this.selectedUnitUser?.usuario?.tip} de la unidad ${this.selectedUnitUser?.unidad?.denominacion}?`,
      nzOnOk: () => {
        if (this.selectedUnitUser) {
          this.suscriptions.push(
            this._unitUserRelationService
              .detele(this.selectedUnitUser.id!)
              .subscribe((result) => {
                this.selectedUnitUser = undefined;
                this.unitUserActions = true;
                this.expandSet.clear();
                setTimeout(() => {
                  this._notificationService.notificationSuccess(
                    'Información',
                    'El usuario ha sido removido de la unidad correctamente'
                  );
                }, 2000);
                this.loadUnitsData(this.selectedUser);
              })
          );
        }
      },
    });
  }

  onExpandChangeUserUnit(userUnit: UnitUserRelation, checked: boolean): void {
    if (checked) {
      this.selectedUnitUser = userUnit;
      this.unitUserActions = false;
      this.expandSet.add(userUnit.id!);
    } else {
      this.selectedUnitUser = undefined;
      this.unitUserActions = true;
      this.expandSet.delete(userUnit.id!);
    }
  }

  closeSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.resetForm();
  }

  resetForm(): void {
    this.searchCriteria.unidad = 0;
    this.searchCriteria.estado = 0;
    this.searchCriteria.fechaInicio = '';
    this.searchCriteria.fechaFin = '';
    this.fechaExpiracion = [];
    this.loadUnitsData(this.selectedUser);
  }

  isNullBusqueda() {
    return Object.values(this.searchCriteria).every((value) => {
      if (value === null || value === '' || value === 0) {
        return true;
      }
      return false;
    });
  }

  onSearch() {
    if (this.isNullBusqueda()) {
      this.loadUnitsData(this.selectedUser);
    } else {
      this.searchData(this.selectedUser);
    }
  }

  searchData(user: User) {
    this.loading = true;
    const filter = {
      idUsuario: user.id,
      idEstado: this.searchCriteria.estado,
      fechaInicio: this.searchCriteria.fechaInicio,
      fechaFin: this.searchCriteria.fechaFin,
    };
    this.suscriptions.push(
      this._unitUserRelationService
        .searchBy(filter, this.query.FILTRAR_UNIDADES)
        .subscribe({
          next: (result) => {
            this.listOfUserUnidades = result.resources;
            this.loading = false;
          },
          error: (error) => {
            this.loading = false;
          },
        })
    );
  }

  onDateChange(event: Array<Date>) {
    event[0].setHours(0, 0, 0, 0);
    event[1].setHours(23, 59, 59);
    this.searchCriteria.fechaInicio = event[0] ? formatISO(event[0]) : '';
    this.searchCriteria.fechaFin = event[1] ? formatISO(event[1]) : '';
    if (event.length == 0 && this.isNullBusqueda()) {
      this.loadUnitsData(this.selectedUser);
    }
  }
}
