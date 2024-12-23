import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PagedResourceCollection, Sort } from '@lagoshny/ngx-hateoas-client';
import { PageParam } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { LoggedUserRole } from '../../enums/user-role.enum';
import { BreadCrumbService } from '../../services/bread-crumb.service';
import { NotificationService } from '../../services/notification.service';
import { TracesService } from '../../services/traces.service';
import { Trace } from './../../models/trace.model';

import { formatISO } from 'date-fns';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.less'],
})
export class AuditComponent implements OnInit {
  selectedIndex = 0;
  selectedTrace: any = 0;
  showSearchForm: boolean = false;
  searchTraceForm!: FormGroup;

  traceList: Trace[] = [];
  actionList = [
    { id: 1, description: 'Creación' },
    { id: 2, description: 'Eliminación' },
    { id: 3, description: 'Actualización' },
  ];
  loading = false;
  expandRow: boolean = false;
  public userRoles: typeof LoggedUserRole = LoggedUserRole;

  /** Trace table */
  total = 1;
  pageSize = 10;
  pageIndex = 1;
  expandSet = new Set<number>();
  sort: Sort = {
    fecha: 'DESC',
  };
  params: PageParam = {
    page: this.pageIndex - 1,
    size: this.pageSize,
  };

  extraGutter = 8;
  extraSpan = 16;

  /** Filters */
  public fechaInicio: any;
  dateFormat = 'dd/MM/yyyy';

  constructor(
    private fb: FormBuilder,
    private _breadcrumbService: BreadCrumbService,
    private tracesService: TracesService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.updateBreadCrumb('audit', null);

    this.searchTraceForm = this.fb.group({
      tip: ['', null],
      action: [0, null],
      description: ['', null],
      startDate: ['', null],
      endDate: ['', null],
      fullDateRange: ['', null],
    });
  }

  updateBreadCrumb(valor: any, seleccionado?: any) {
    this._breadcrumbService.updateBreadCrumb.emit({
      valor: valor,
      seleccionado: seleccionado,
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const rr = sort.map((item) => {
      if (item.value === 'ascend') {
        item.value = 'ASC';
        return item;
      }
      if (item.value === 'descend') {
        item.value = 'DESC';
        return item;
      }
      return;
    });

    const columnSort = rr.find((item) => item?.value) as Sort;
    this.sort = columnSort ? columnSort : { fecha: 'DESC' };

    this.params.page = pageIndex - 1;
    this.params.size = pageSize;
    this.loadTraces();
    // this.onSearch();
  }

  onExpandChange(trace: any, checked: boolean): void {
    this.expandSet.clear();
    if (checked) {
      this.expandSet.add(trace.id);
      this.selectedTrace = trace;
      // this.updateBreadCrumb('unid', unit.denominacion);
    } else {
      this.expandSet.delete(trace.id);
      this.selectedTrace = null;
      // this.updateBreadCrumb('unid');
    }
  }

  showHideSearchFormTrace() {
    this.showSearchForm = !this.showSearchForm;
  }

  onSearch() {
    this.expandSet.clear();
    if (this.isNullSearchForm()) {
      this.loadTraces();
    } else {
      this.onSearchTrace();
    }
  }

  loadTraces() {
    this.loading = true;
    this.tracesService
      .searchCriterio(
        {
          idTraza: 0,
          tip: this.searchTraceForm.value.tip || '',
          descripcion: this.searchTraceForm.value.description || '',
          idTipoEntidad: 0,
          idAccionEntidad: this.searchTraceForm.value.action && this.searchTraceForm.value.action!='' ? this.searchTraceForm.value.action : 0,
          fechaInicio: this.searchTraceForm.value.startDate || '',
          fechaFin: this.searchTraceForm.value.endDate || '',
        },
        this.params,
        this.sort
      )
      .subscribe({
        next: (trace: PagedResourceCollection<Trace>) => {
          this.traceList = [...trace.resources];
          this.total = trace.totalElements;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.traceList = [];
          this.handleErrorMessage(
            err,
            'Ha ocurrido un error al cargar las unidades.'
          );
        },
      });
  }

  onSearchTrace() {
    this.sort = { fecha: 'DESC' };
    this.params.page=0;
    this.loading = true;
    this.tracesService
      .searchCriterio(
        {
          idTraza: 0,
          tip: this.searchTraceForm.value.tip,
          descripcion: this.searchTraceForm.value.description,
          idTipoEntidad: 0,
          idAccionEntidad: this.searchTraceForm.value.action,
          fechaInicio: this.searchTraceForm.value.startDate,
          fechaFin: this.searchTraceForm.value.endDate,
        },
        this.params,
        this.sort
      )
      .subscribe({
        next: (trace: PagedResourceCollection<Trace>) => {
          this.traceList = [...trace.resources];
          this.total = trace.totalElements;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.traceList = [];
          this.handleErrorMessage(
            err,
            'Ha ocurrido un error al cargar las unidades.'
          );
        },
      });
  }

  isNullSearchForm() {
    return Object.values(this.searchTraceForm.value).every((value) => {
      if (value === null || value === '' || value === 0) {
        return true;
      }
      return false;
    });
  }

  resetForm(): void {
    this.searchTraceForm.reset({
      tip: '',
      action: 0,
      description: '',
      startDate: '',
      endDate: '',
      fullDateRange: '',
    });
    this.loadTraces();
  }

  closeSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.resetForm();
  }

  handleErrorMessage(error: any, defaultMsg: string): void {
    if (error.status == 400) {
      this.notificationService.notificationError(
        'Error',
        error.error.message.toLowerCase()
      );
    } else if (error.status == 409) {
      this.notificationService.notificationError(
        'Error',
        error.error.message.toLowerCase()
      );
    } else if (error.status == 500) {
      if (error.error.message && error.error.message.toLowerCase().includes('fallo')) {
        this.notificationService.notificationError('Error', error.error.message);
      } else {
        this.notificationService.notificationError('Error', defaultMsg);
      }

    } else {
      this.notificationService.notificationError('Error', defaultMsg);
    }
  }

  onDateChange(event: Array<Date>) {
    const startDate: string = event[0].toISOString().split('Z')[0].split('T')[0] + "T00:00:00.000";
    const endDate: string = event[1].toISOString().split('Z')[0].split('T')[0] + "T23:59:59.000";
      
    this.searchTraceForm.controls['startDate'].setValue(
      startDate || ''
    );
    this.searchTraceForm.controls['endDate'].setValue(
      endDate || ''
    );
  }
}
