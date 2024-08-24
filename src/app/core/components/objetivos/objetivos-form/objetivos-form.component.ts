import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  PageParam,
  Sort,
} from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { differenceInCalendarDays } from 'date-fns';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { UserSearchQuery } from 'src/app/core/constants/user.query';
import { ButtonInterface } from '../../user/user-form/user-form.component';
import { Objetivo } from './../../../models/objetivo.modal';
import { Operacion } from './../../../models/operacion.model';

import { Baliza } from 'src/app/core/models/baliza.model';
import { Estado } from 'src/app/core/models/estado.model';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ObjetivosService } from 'src/app/core/services/objetivos.service';

@Component({
  selector: 'app-objetivos-form',
  templateUrl: './objetivos-form.component.html',
  styleUrls: ['./objetivos-form.component.less'],
})
export class ObjetivosFormComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  @Input() objetivoToEdit!: Objetivo;
  @Input() selectedOperacion!: Operacion;
  @Input() listBalizaz!: any[];
  @Input() listJuzgados!: any[];
  @Input() listUsuarios!: any[];

  query: UserSearchQuery = new UserSearchQuery();

  formModalOObjetivo: FormGroup;

  estados!: Array<Estado>;

  buttonSending = false;

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0;
  };

  button: ButtonInterface = {
    label: 'AGREGAR',
    icon: 'plus',
  };
  pageSizeOfic = 10;
  pageIndexOfic = 1;
  sortUser!: Sort;
  paramsUser: PageParam = {
    page: this.pageIndexOfic - 1,
    size: this.pageSizeOfic,
  };

  loadingJusgados: boolean = true;

  juzgadoSelected: number = 0;
  balizaSelected?: Baliza;
  responsableSelected: number = 0;
  urgenciaSelected: any = 0;
  diligenciaSelected: any = 0;

  balizaOriginal?: Baliza;

  pageSize = 10;
  pageIndex = 1;
  sort: Sort = {
    fechaCreacion: 'DESC',
  };
  params: PageParam = {
    page: this.pageIndex - 1,
    size: this.pageSize,
  };

  estadoConfiguracion = [
    {
      id: 1,
      descripcion: 'Sí',
    },
    {
      id: 2,
      descripcion: 'No',
    },
  ];

  dateFormat = 'dd/MM/yyyy';
  fechaInicioOP!: Date;
  fechaFinOP!: Date;

  suscriptions: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private _objetivoService: ObjetivosService,
    private _notificationService: NotificationService,
    private detectorChangeRef: ChangeDetectorRef
  ) {
    this.formModalOObjetivo = this.fb.group({
      descripcion: ['', [Validators.required]],
      urgencia: ['', [Validators.required]],
      finalAuto: ['', [Validators.required]],
      emailIncidenciaJud: ['', [Validators.required, Validators.pattern]],
      observaciones: ['', [Validators.required]],
      balizas: ['', []],
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  ngAfterViewInit(): void {
    if (this.objetivoToEdit) {
      this.balizaOriginal = this.objetivoToEdit.balizas;

      this.button.label = 'EDITAR';
      this.button.icon = 'edit';
      Promise.resolve().then(() => {
        this.formModalOObjetivo.controls['descripcion'].setValue(
          this.objetivoToEdit!.descripcion
        );
        this.formModalOObjetivo.controls['descripcion'].disable();
        this.formModalOObjetivo.controls['finalAuto'].setValue(
          this.objetivoToEdit!.finalAuto
        );
        this.formModalOObjetivo.controls['emailIncidenciaJud'].setValue(
          this.objetivoToEdit!.emailIncidenciaJud
        );
        this.formModalOObjetivo.controls['observaciones'].setValue(
          this.objetivoToEdit!.observaciones
        );
        this.urgenciaSelected = this.objetivoToEdit!.urgencia
          ? this.objetivoToEdit!.urgencia
          : 0;
        this.balizaSelected = this.objetivoToEdit!.balizas
          ? this.objetivoToEdit!.balizas
          : undefined;
        this.formModalOObjetivo.controls['balizas'].setValue(
          this.objetivoToEdit!.balizas
        );
        this.detectorChangeRef.detectChanges();
      });
    }
  }

  submitForm() {
    this.buttonSending = true;
    let newObjetivo: any = {
      descripcion: this.objetivoToEdit?.descripcion
        ? this.objetivoToEdit.descripcion
        : this.formModalOObjetivo.value.descripcion,
      urgencia: this.formModalOObjetivo.value.urgencia,
      finalAuto: this.formModalOObjetivo.value.finalAuto,
      emailIncidenciaJud: this.formModalOObjetivo.value.emailIncidenciaJud,
      observaciones: this.formModalOObjetivo.value.observaciones,
      balizas: this.formModalOObjetivo.value.balizas
        ? { id: this.formModalOObjetivo.value.balizas.id }
        : undefined,
      operaciones: { id: this.selectedOperacion.id },
    };
    if (this.objetivoToEdit) {
      newObjetivo.id = this.objetivoToEdit.id;
    }

    if (!this.objetivoToEdit) {
      this.suscriptions.push(
        this._objetivoService.create(newObjetivo).subscribe({
          next: () => {
            this.buttonSending = false;
            this.modalRef.close({ accion: this.button.label });
          },
          error: (error) => {
            this.buttonSending = false;
            this.handleErrorMessage(
              error,
              'Ocurrió un error al crear el objetivo.'
            );
          },
        })
      );
    } else {
      this.suscriptions.push(
        this._objetivoService.put(newObjetivo).subscribe({
          next: () => {
            this.buttonSending = false;
            this.modalRef.close({ accion: this.button.label });
          },
          error: (error) => {
            this.buttonSending = false;
            this.handleErrorMessage(
              error,
              'Ocurrió un error al crear el objetivo.'
            );
          },
        })
      );
    }
  }

  checkForm() {
    return this.formModalOObjetivo.invalid ? true : false;
  }

  closeForm() {
    this.modalRef.close({ accion: 'CANCELAR' });
  }

  handleErrorMessage(error: any, defaultMsg: string): void {
    if (error.status == 400) {
      this._notificationService.notificationError(
        'Error',
        error.error.message.toLowerCase()
      );
    } else if (error.status == 409) {
      this._notificationService.notificationError(
        'Error',
        error.error.message.toLowerCase()
      );
    } else if (error.status == 500) {
      if (
        error.error.message &&
        error.error.message.toLowerCase().includes('fallo')
      ) {
        this._notificationService.notificationError(
          'Error',
          error.error.message
        );
      } else {
        this._notificationService.notificationError('Error', defaultMsg);
      }
    } else {
      this._notificationService.notificationError('Error', defaultMsg);
    }
  }
}
