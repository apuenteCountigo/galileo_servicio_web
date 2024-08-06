import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagedResourceCollection, Sort } from '@lagoshny/ngx-hateoas-client';
import { PageParam } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Estados } from 'src/app/core/enums/estados.enum';
import { Objetivo } from 'src/app/core/models/objetivo.modal';
import { BalizaService } from 'src/app/core/services/baliza.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ButtonInterface } from '../../../user/user-form/user-form.component';

@Component({
  selector: 'app-objetivo-desasignar-baliza',
  templateUrl: './objetivo-desasignar-baliza.component.html',
  styleUrls: ['./objetivo-desasignar-baliza.component.less'],
})
export class ObjetivoDesasignarBalizaComponent implements OnInit, OnDestroy {
  @Input() label!: string;
  @Input() idUnidad?: number;
  @Input() objetivo!: Objetivo;

  listBalizaz: any[] = [];
  loadingBalizas: boolean = true;
  totalBalizas: number = 0;

  pageSizeOfic = 10;
  pageIndexOfic = 1;
  sortObjetivo!: Sort;
  paramsObjetivo: PageParam = {
    page: this.pageIndexOfic - 1,
    size: this.pageSizeOfic,
  };

  formModalDesasignarBaiza: FormGroup;

  button: ButtonInterface = {
    label: 'Aceptar',
    icon: 'plus',
  };

  suscriptions: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private _balizasService: BalizaService,
    private _notificationService: NotificationService,
    private detectorChange: ChangeDetectorRef
  ) {
    this.formModalDesasignarBaiza = this.fb.group({
      items: ['', []],
    });
  }

  ngOnInit(): void {
    this.loadBalizasOfUnidad();
  }
  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }
  submitForm() {
    let id = this.formModalDesasignarBaiza.value.items
      ? this.formModalDesasignarBaiza.value.items.id
      : 0;
    this.modalRef.close({ id, accion: this.button.label });
  }
  loadBalizasOfUnidad(): void {
    this.loadingBalizas = true;
    this.suscriptions.push(
      this._balizasService
        .searchFiltrar(
          {
            unidad: this.idUnidad,
            idEstadoBaliza: Estados.DISPONIBLE,
          },
          this.paramsObjetivo,
          this.sortObjetivo
        )
        .subscribe({
          next: (balizas: PagedResourceCollection<any>) => {
            this.loadingBalizas = false;
            this.listBalizaz = [...balizas.resources];
            this.totalBalizas = balizas.totalElements;
            if (this.objetivo.balizas) {
              this.listBalizaz.push(this.objetivo.balizas);
              this.formModalDesasignarBaiza.controls['items'].setValue(
                this.objetivo.balizas
              );
              this.detectorChange.detectChanges();
              this.totalBalizas++;
            }
            // if (this.totalBalizas == 0) {
            //   this._notificationService.notificationError(
            //     'Error',
            //     'Su unidad no tiene balizas disponibles.'
            //   );
            // }
          },
          error: (err) => {
            this.loadingBalizas = true;
            this.listBalizaz = [];
            this._notificationService.notificationError(
              'Error',
              'Error al cargar las balizas disponibles de la unidad.'
            );
          },
        })
    );
  }

  checkForm() {
    return this.formModalDesasignarBaiza.invalid ? true : false;
  }

  closeForm() {
    this.modalRef.close({ accion: 'CANCELAR' });
  }
}
