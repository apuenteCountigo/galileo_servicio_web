import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HateoasResourceService } from '@lagoshny/ngx-hateoas-client';
import { NzTableSortOrder, NzTableSortFn } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';
import {
  EstadoPeticionRequestDto,
  NoAsignadas,
} from 'src/app/core/models/geocerca.model';
import { GeocercaService } from 'src/app/core/services/geocerca.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TableBase } from 'src/app/core/utils/table.base';

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<NoAsignadas> | null;
}

@Component({
  selector: 'app-no-asignadas',
  templateUrl: './no-asignadas.component.html',
  styleUrls: ['./no-asignadas.component.less'],
})
export class NoAsignadasComponent extends TableBase implements OnInit {
  // @Input() geocercaTraccarList!: Array<GeocercaTraccar>;
  @Input() noAsignadas!: Array<NoAsignadas>;
  @Input() loadingNoAsignadas!: boolean;
  @Input() asignadasSize!: number;
  @Input() urlToReplace!: string;
  @Input() allowEdit!: boolean;

  @Output() onEventChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onStatusChange: EventEmitter<EstadoPeticionRequestDto> =
    new EventEmitter<EstadoPeticionRequestDto>();

  suscriptions: Array<any> = new Array();

  listOfColumns: ColumnItem[] = [
    {
      name: 'ID',
      sortOrder: null,
      sortFn: (a: NoAsignadas, b: NoAsignadas) => a.id - b.id,
    },
    {
      name: 'Nombre',
      sortOrder: null,
      sortFn: (a: NoAsignadas, b: NoAsignadas) => a.name.localeCompare(b.name),
    },
    {
      name: 'Descripción',
      sortOrder: null,
      sortFn: (a: NoAsignadas, b: NoAsignadas) =>
        a.description.localeCompare(b.description),
    },
    {
      name: 'Área',
      sortOrder: null,
      sortFn: (a: NoAsignadas, b: NoAsignadas) => a.area.localeCompare(b.area),
    },
  ];

  constructor(
    private _resourceService: HateoasResourceService,
    private _notificationService: NotificationService,
    private _geocercaService: GeocercaService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = false;
  }

  isDisabled() {
    if (this.allowEdit) {
      return true;
    } else {
      return this.expandSet.size == 0;
    }
  }

  onCheckedChangegeocerca(geocerca: NoAsignadas, event: boolean) {
    if (event) {
      this.expandSet.add(geocerca.id);
    }
    if (!event) {
      this.expandSet.delete(geocerca.id);
    }
  }

  setStyleClass() {
    return this.isDisabled()
      ? 'icon-disabled icon-size'
      : 'icon-class icon-size';
  }

  addGeocercas() {
    if (this.expandSet.size + this.asignadasSize > 10) {
      this._notificationService.notificationError(
        'Error',
        'No se adminten mas de 10 geocercas por baliza.'
      );
    } else {
      this.suscriptions = [];
      this.noAsignadas.forEach((geocerca) => {
        if (this.expandSet.has(geocerca.id)) {
          this.suscriptions.push(
            this._geocercaService.addGeocerca(geocerca, this.urlToReplace)
          );
        }
      });

      forkJoin(this.suscriptions as []).subscribe({
        next: () => {
          this.expandSet.clear();
          this._notificationService.notificationSuccess(
            'Confirmación',
            'La petición para agregar la(s) geocerca(s) ha sido enviada a Dataminer.'
          );
          this.onEventChange.emit(true);
        },
        error: (e) => {
          this._notificationService.notificationError('Error', e.error.message);
        },
      });
    }
  }
}
