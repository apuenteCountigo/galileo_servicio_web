import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagedResourceCollection, Sort } from '@lagoshny/ngx-hateoas-client';
import { differenceInCalendarDays, formatISO } from 'date-fns';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Objetivo } from 'src/app/core/models/objetivo.modal';
import { Unit } from 'src/app/core/models/unit.model';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ObjetivosService } from 'src/app/core/services/objetivos.service';
import { TableBase } from 'src/app/core/utils/table.base';

interface BusquedaObjetivo {
  descripcion: string | null;
  idresponsable: number | null;
}

@Component({
  selector: 'app-wizard-positions',
  templateUrl: './wizard-positions.component.html',
  styleUrls: ['./wizard-positions.component.scss'],
})
export class WizardPositionsComponent
  extends TableBase
  implements OnInit, OnDestroy
{
  @Input() listUsuarios?: any[];
  @Input() perfil: any;
  @Input() unidad!: Unit;
  @Input() idUsuario: any;
  @Input() idoperacion: any;
  @Input() diligencias: any;

  current = 0;
  index = 'First-content';

  searchObjetivesForm: FormGroup;
  formModalWizard: FormGroup;

  balizasArray: any[] = [];

  listPosTypes: any = [
    {
      id: 1,
      description: 'Posiciones GPS',
      value: 'GPS',
    },
    {
      id: 2,
      description: 'Todas las posiciones',
      value: 'Todas las posiciones',
    },
  ];

  selectedObjetivo?: Objetivo;

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) > 0;

  startValue: Date | null = null;
  endValue: Date | null = null;

  noSelection: boolean = false;
  showSearchFormObj: boolean = true;

  searchCriteria: BusquedaObjetivo = {
    descripcion: '',
    idresponsable: 0,
  };

  // total = 0;
  // loading = true;
  // pageSize = 10;
  // pageIndex = 1;
  // sort!: Sort;
  // params: PageParam = {
  //   page: this.pageIndex - 1,
  //   size: this.pageSize,
  // };

  listOfObjetivos: Objetivo[] = [];
  listOfSelectedObjetivos: Array<Objetivo> = [];
  selectedObj?: Objetivo;
  setOfCheckedObjetivestId = new Set<number>();

  dateFormat = 'dd/MM/yyyy HH:mm:ss';

  suscriptions: Array<any> = [];

  checked = false;
  indeterminate = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private _notificationService: NotificationService,
    private _objetivoService: ObjetivosService
  ) {
    super();
    this.formModalWizard = this.fb.group({
      postype: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    });

    this.searchObjetivesForm = this.fb.group({
      descripcion: ['', []],
      idresponsable: [0, []],
    });
    this.total = 50;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  pre(): void {
    this.current -= 1;
    this.goBackForm();
  }

  next(): void {
    this.current += 1;
  }

  cancelForm() {
    this.balizasArray = [];
    this.setOfCheckedObjetivestId.clear();
    this.modalRef.close({ accion: 'CANCEL' });
  }

  closeForm() {
    if (this.startValue && this.endValue) {
      this.formModalWizard.controls['startDate'].setValue(
        formatISO(this.startValue).slice(
          0,
          formatISO(this.startValue!).length - 6
        )
      );
      this.formModalWizard.controls['endDate'].setValue(
        formatISO(this.endValue).slice(0, formatISO(this.endValue!).length - 6)
      );
    }
    const objectData = {
      idUnidad: this.unidad.id,
      posType: this.formModalWizard.value.postype.value,
      startDate: this.formModalWizard.value.startDate,
      endDate: this.formModalWizard.value.endDate,
      objetivos: this.listOfSelectedObjetivos,
    };
    this.modalRef.close({ accion: 'GENERATE', data: objectData });
    this.balizasArray = [];
    this.setOfCheckedObjetivestId.clear();
  }

  onStartDateChange(event: any) {
    this.startValue = event;

    // let dd = this.startValue?.toUTCString();
    // console.log(dd);
    // console.log(this.startValue?.toISOString());
    // console.log(formatISO(this.startValue!));

    // console.log(
    //   formatISO(this.startValue!).slice(
    //     0,
    //     formatISO(this.startValue!).length - 6
    //   )
    // );
  }

  onEndDateChange(event: Date) {
    this.endValue = event;
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() <= this.startValue.getTime();
  };

  isNullBusqueda() {
    return Object.values(this.searchObjetivesForm.value).every((value) => {
      if (value === null || value === '' || value === 0) {
        return true;
      }
      return false;
    });
  }

  onSearch(): void {
    // this.balizasArray = [];
    // this.setOfCheckedObjetivestId.clear();
    this.onSearchUnitOfObjetivos();
  }

  resetForm(): void {
    this.searchObjetivesForm.reset();
    // this.balizasArray = [];
    this.setOfCheckedObjetivestId.clear();
    this.onSearchUnitOfObjetivos();
  }

  goBackForm() {
    this.searchObjetivesForm.reset();
    this.onSearchUnitOfObjetivos();
  }

  closeSearchForm() {
    this.showSearchFormObj = !this.showSearchFormObj;
    this.resetForm();
    this.onSearchUnitOfObjetivos();
  }

  onSearchUnitOfObjetivos(): void {
    this.loading = true;
    this.suscriptions.push(
      this._objetivoService
        .search(
          {
            perfil: this.perfil,
            unidad: this.unidad.id,
            idUsuario: this.idUsuario,
            descripcion: this.searchObjetivesForm.value.descripcion
              ? this.searchObjetivesForm.value.descripcion
              : '',
            idoperacion: this.idoperacion,
            idresponsable: this.searchObjetivesForm.value.idresponsable
              ? this.searchObjetivesForm.value.idresponsable
              : 0,
            idjuzgado: 0,
            id: 0,
          },
          this.params,
          this.sort
        )
        .subscribe({
          next: (relations: PagedResourceCollection<Objetivo>) => {
            this.loading = false;
            this.listOfObjetivos = [...relations.resources];
            this.total = relations.totalElements;
            this.refreshCheckedStatus();
          },
          error: (err) => {
            this.loading = false;
            this.listOfObjetivos = [];
            this._notificationService.notificationError(
              'Error',
              'Ha ocurrido un error al cargar los objetivos.'
            );
          },
        })
    );
  }

  override showHideSearchForm() {
    this.showSearchFormObj = !this.showSearchFormObj;
  }

  onQueryParamsChangeUnitObjetivos(params: NzTableQueryParams): void {
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
    this.sort = rr.find((item) => item?.value) as Sort;
    this.params.page = pageIndex - 1;
    this.params.size = pageSize;
    this.onSearch();
  }

  onItemChecked(item: any, checked: boolean): void {
    console.log("@@@@@@item#####");
    console.log(item);
    
    this.updateCheckedSet(item, checked);
  }

  updateCheckedSet(item: any, checked: boolean): void {
    if (checked) {
      this.setOfCheckedObjetivestId.add(item.id);
      this.listOfSelectedObjetivos.push(item);
      this.selectedObjetivo = item;
      this.refreshCheckedStatus();
      // this.balizasArray.push({
      //   id: item.balizas.id,
      //   clave: item.balizas.clave,
      // });
    } else {
      this.setOfCheckedObjetivestId.delete(item.id);
      const indexToRemove = this.listOfSelectedObjetivos.findIndex(
        (o) => o.id == item.id
      );
      this.listOfSelectedObjetivos.splice(indexToRemove, 1);
      this.refreshCheckedStatus();
      // this.balizasArray = this.balizasArray.filter(
      //   (b) => b.id !== item.balizas.id
      // );
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfObjetivos.every(({ id }) =>
      this.setOfCheckedObjetivestId.has(id)
    );
    this.indeterminate =
      this.listOfObjetivos.some(({ id }) =>
        this.setOfCheckedObjetivestId.has(id)
      ) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    // this.balizasArray = [];
    // this.listOfSelectedObjetivos = [];
    if (checked) {
      this.listOfObjetivos.forEach((obj) => {
        if (!this.balizasArray.some((ba) => ba.id == obj.id)) {
          this.setOfCheckedObjetivestId.add(obj.id);
          // this.balizasArray.push({
          //   id: obj.balizas.id,
          //   clave: obj.balizas.clave,
          // });
          this.listOfSelectedObjetivos.push(obj);
        }
      });
      this.listOfSelectedObjetivos;
      this.refreshCheckedStatus();
    } else {
      this.listOfObjetivos.forEach((o) => {
        if (this.setOfCheckedObjetivestId.has(o.id)) {
          this.setOfCheckedObjetivestId.delete(o.id);
          const index = this.listOfSelectedObjetivos.findIndex(
            (so) => so.id == o.id
          );
          this.listOfSelectedObjetivos.splice(index, 1);
        }
      });
      this.refreshCheckedStatus();
    }
  }

  setStyleClassBusqueda() {
    return !this.isNullBusqueda() ? 'icon-class' : 'icon-disabled';
  }
}
