import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HateoasResourceService } from '@lagoshny/ngx-hateoas-client';
import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { forkJoin, from } from 'rxjs';
import { Asignadas, Geocerca } from 'src/app/core/models/geocerca.model';
import { GeocercaService } from 'src/app/core/services/geocerca.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { replaceUrl } from 'src/app/core/utils/replace-url';
import { TableBase } from 'src/app/core/utils/table.base';
import { environment } from 'src/environments/environment';

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Asignadas> | null;
}

@Component({
  selector: 'app-asignadas',
  templateUrl: './asignadas.component.html',
  styleUrls: ['./asignadas.component.less'],
})
export class AsignadasComponent extends TableBase implements OnInit {
  @Input() asignadas!: Array<Asignadas>;
  @Input() loadingAsignadas!: boolean;
  @Input() urlToReplace!: string;
  @Output() onEventChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() allowEdit!: boolean;

  loadingSwitch: Array<boolean> = [];

  suscriptions: Array<any> = new Array();

  listOfColumns: ColumnItem[] = [
    {
      name: 'ID',
      sortOrder: null,
      sortFn: (a: Asignadas, b: Asignadas) => a.id - b.id,
    },
    {
      name: 'Nombre',
      sortOrder: null,
      sortFn: (a: Asignadas, b: Asignadas) => a.name.localeCompare(b.name),
    },
    {
      name: 'Bottom Latitud',
      sortOrder: null,
      sortFn: (a: Asignadas, b: Asignadas) =>
        a.bottomLeftLatitude.localeCompare(b.bottomLeftLatitude),
    },
    {
      name: 'Bottom Longitud',
      sortOrder: null,
      sortFn: (a: Asignadas, b: Asignadas) =>
        a.bottomLeftLongitude.localeCompare(b.bottomLeftLongitude),
    },
    {
      name: 'Top Latitud',
      sortOrder: null,
      sortFn: (a: Asignadas, b: Asignadas) =>
        a.topRightLatitude.localeCompare(b.topRightLatitude),
    },
    {
      name: 'Top Longitud',
      sortOrder: null,
      sortFn: (a: Asignadas, b: Asignadas) =>
        a.topRightLongitude.localeCompare(b.topRightLongitude),
    },
    {
      name: 'Estado',
      sortOrder: null,
      sortFn: (a: Asignadas, b: Asignadas) =>
        Number(a.activa) - Number(b.activa),
    },
  ];

  constructor(
    private _resourceService: HateoasResourceService,
    private _geocercaService: GeocercaService,
    private _notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = false;
    for (let index = 0; index < 9; index++) {
      this.loadingSwitch[index] = false;
    }
  }

  isDisabled() {
    if (this.allowEdit) {
      return true;
    } else {
      return this.expandSet.size == 0;
    }
  }

  onCheckedChangeGeocerca(idGeocerca: any, event: boolean) {
    if (event) {
      this.expandSet.add(idGeocerca);
    }
    if (!event) {
      this.expandSet.delete(idGeocerca);
    }
  }

  setStyleClass() {
    return this.isDisabled()
      ? 'icon-disabled icon-size'
      : 'icon-class icon-size';
  }

  isGeocercaIncomplete(geocerca: Asignadas): boolean {
    return (
      geocerca.bottomLeftLatitude === 'EMPTY' || geocerca.bottomLeftLatitude === '0' ||
      geocerca.bottomLeftLongitude === 'EMPTY' || geocerca.bottomLeftLongitude === '0' ||
      geocerca.topRightLatitude === 'EMPTY' || geocerca.topRightLatitude === '0' ||
      geocerca.topRightLongitude === 'EMPTY' || geocerca.topRightLongitude === '0'
    );
  }

  changeGeocercaState(geocerca: Asignadas, index: number) {
    if(!this.isGeocercaIncomplete(geocerca)){
      this.loadingSwitch[index] = true;
      this._geocercaService
        .changeGeocercaState(geocerca, this.urlToReplace)
        .subscribe({
          next: (result) => {
            this.loadingSwitch[index] = false;
            geocerca.activa = !geocerca.activa;
            this._notificationService.notificationSuccess(
              'Confirmación',
              'La petición para activar/desactivar la geocerca ha sido enviada a Dataminer.'
            );
            this.onEventChange.emit(true);
          },
          error: (e) => {
            this.loadingSwitch[index] = false;
            geocerca.activa
              ? this._notificationService.notificationError(
                  'Error',
                  'No se ha activado la geocerca en Dataminer.'
                )
              : this._notificationService.notificationError(
                  'Error',
                  'No se ha desactivado la geocerca en Dataminer.'
                );
          },
        });
    }
  }

  removeGeocercas() {
    this.suscriptions = [];
    this.asignadas.forEach((geocerca) => {
      if (this.expandSet.has(geocerca.id)) {
        this.suscriptions.push(
          this._geocercaService.deleteGeocerca(geocerca, this.urlToReplace)
        );
      }
    });

    forkJoin(this.suscriptions as []).subscribe({
      next: () => {
        this.expandSet.clear();
        this._notificationService.notificationSuccess(
          'Confirmación',
          'La petición para remover la(s) geocerca(s) ha sido enviada a Dataminer.'
        );
        this.resetValues();
        this.onEventChange.emit();
      },
      error: (e) => {
        this._notificationService.notificationError('Error', e.error.message);
      },
    });
  }

  resetValues() {
    this.expandSet.clear();
    this.suscriptions.forEach((s) => s.unsuscribe());
  }
}
