import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourceCollection } from '@lagoshny/ngx-hateoas-client';
import { differenceInCalendarDays } from 'date-fns';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { EstadosOperacion } from 'src/app/core/enums/estados.enum';
import { TipoServidor } from 'src/app/core/enums/tipo-servidor';
import { Estado } from 'src/app/core/models/estado.model';
import { Juzgado } from 'src/app/core/models/juzgado.model';
import { Operacion } from 'src/app/core/models/operacion.model';
import { Server } from 'src/app/core/models/server.model';
import { Unit } from 'src/app/core/models/unit.model';
import { EstadoService } from 'src/app/core/services/estado.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { OperacionService } from 'src/app/core/services/operacion.service';
import { ServerService } from 'src/app/core/services/server.service';
import { ButtonInterface } from '../../user/user-form/user-form.component';
import { UnitService } from './../../../services/unit.service';
import { WebSocketService } from 'src/app/core/services/ws/websocket.service';
import { ErrorMessage } from 'src/app/core/dto/errorMessage';

@Component({
  selector: 'app-operaciones-form',
  templateUrl: './operaciones-form.component.html',
  styleUrls: ['./operaciones-form.component.less'],
})
export class OperacionesFormComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() operacionToEdit?: Operacion;
  @Input() selectedUnit?: Unit;
  @Input() juzgadosList?: Juzgado[];
  @Input() estadosList?: Estado[];

  listUnidades: Unit[] = [];
  loadingUnit = true;
  unitSelected: number = 0;

  formModalOperacion: FormGroup;

  filter = {
    descripcion: '',
    id: 0,
    idTipoEntidad: 6,
  };

 // disabledDate = (current: Date): boolean =>
    //differenceInCalendarDays(current, new Date()) < 0;
  disabledDateFin = (current: Date): boolean =>
    current < this.formModalOperacion.value.fechaInicio;

  serverList: Server[] = [];

  button: ButtonInterface = {
    label: 'AGREGAR',
    icon: 'plus',
  };
  var = true;

  dateFormat = 'dd/MM/yyyy';
  dateFormatNew = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

  buttonSending = false;

  suscriptions: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private _balizaUnidades: UnitService,
    private _notificationService: NotificationService,
    private _serverService: ServerService,
    private _operacionService: OperacionService,
    private webSocketService: WebSocketService
  ) {
    this.formModalOperacion = this.fb.group({
      descripcion: ['', [Validators.required, Validators.pattern]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      diligencias: ['', [Validators.required, Validators.maxLength]],
      //unidad: ['', [Validators.required]],
      juzgado: ['', [Validators.required]], // Autoridad judicial
      observaciones: ['', []],
      servidor: ['', []],
      estados: [{}, [Validators.required]], // situacion
    });
  }

  loadUnidades() {
    this.suscriptions.push(
      this._balizaUnidades.getAll().subscribe({
        next: (unidades: ResourceCollection<Unit>) => {
          this.listUnidades = [...unidades.resources];
          this.loadingUnit = false;
        },
        error: (err) => {
          this._notificationService.notificationError(
            'Error',
            'Ha ocurrido un error al cargar las unidades'
          );
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
    this.webSocketService.disconnect();
  }

  ngAfterViewInit(): void {
    // this.webSocketService.sendMessage('SHOWMODAL');

    if (this.operacionToEdit) {
      this.button.label = 'EDITAR';
      this.button.icon = 'edit';

      this.formModalOperacion.get('servidor')?.clearValidators();
      this.formModalOperacion.updateValueAndValidity();

      Promise.resolve().then(() => {
        this.unitSelected = this.operacionToEdit!.unidades
          ? this.operacionToEdit!.unidades.id
          : 0;
        this.formModalOperacion.controls['descripcion'].setValue(
          this.operacionToEdit!.descripcion
        );
        this.formModalOperacion.controls['descripcion'].disable();

        this.formModalOperacion.controls['fechaFin'].setValue(
          this.operacionToEdit!.fechaFin
        );
        this.formModalOperacion.controls['fechaInicio'].setValue(
          this.operacionToEdit!.fechaInicio
        );
        this.formModalOperacion.controls['diligencias'].setValue(
          this.operacionToEdit!.diligencias
        );
        this.formModalOperacion.controls['estados'].setValue(
          this.estadosList!.find(
            (e) => e.descripcion === this.operacionToEdit!.estados?.descripcion
          )
        );
        this.formModalOperacion.controls['observaciones'].setValue(
          this.operacionToEdit!.observaciones
        );
        this.formModalOperacion.controls['juzgado'].setValue(
          this.juzgadosList!.find(
            (j) => j.descripcion === this.operacionToEdit!.juzgado?.descripcion
          )
        );
        this.formModalOperacion.controls['servidor'].setValue(
          this.operacionToEdit!.servidor
        );
        this.formModalOperacion.controls['servidor'].disable();
      });
    } else {
      this.formModalOperacion.controls['estados'].setValue(
        this.estadosList!.find((e) => e.descripcion === EstadosOperacion.ACTIVA)
      );
    }
  }

  submitForm() {
    this.buttonSending = true;
    let newOperacion: any = {
      descripcion: this.formModalOperacion.value.descripcion,
      fechaFin: this.formModalOperacion.value.fechaFin
        ? (this.formModalOperacion.value.fechaFin as Date)
        : '',
      fechaInicio: this.formModalOperacion.value.fechaInicio
        ? (this.formModalOperacion.value.fechaInicio as Date)
        : '',
      observaciones: this.formModalOperacion.value.observaciones,
      idDataminer: null,
      idElement: null,
      diligencias: this.formModalOperacion.value.diligencias,
      unidades: this.operacionToEdit?.unidades
        ? { id: this.operacionToEdit.unidades.id }
        : { id: this.selectedUnit?.id },
      estados: this.operacionToEdit?.estados
        ? { id: this.operacionToEdit?.estados.id }
        : { id: this.formModalOperacion.value.estados.id },
      servidor: this.operacionToEdit
        ? {
            id: this.operacionToEdit?.servidor?.id,
          }
        : {
            id: this.formModalOperacion.value.servidor.id,
          },
      juzgado: this.formModalOperacion.value.juzgado
        ? { id: this.formModalOperacion.value.juzgado.id }
        : null,
    };
    if (this.operacionToEdit) {
      newOperacion = {
        id: this.operacionToEdit.id,
        descripcion: this.operacionToEdit.descripcion,
        fechaFin: this.formModalOperacion.value.fechaFin
          ? this.formModalOperacion.value.fechaFin
          : '',
        fechaInicio: this.formModalOperacion.value.fechaInicio
          ? this.formModalOperacion.value.fechaInicio
          : '',
        diligencias: this.formModalOperacion.value.diligencias,
        observaciones: this.formModalOperacion.value.observaciones,
        idDataminer: null,
        idElement: null,
        servidor: this.operacionToEdit.servidor,
        unidades: this.operacionToEdit?.unidades
          ? { id: this.operacionToEdit.unidades.id }
          : { id: this.selectedUnit?.id },
        estados: this.formModalOperacion.value.estados
          ? { id: this.formModalOperacion.value.estados.id }
          : { id: this.operacionToEdit?.estados?.id },
        juzgado: this.formModalOperacion.value.juzgado
          ? { id: this.formModalOperacion.value.juzgado.id }
          : null,
      };
    }

    if (!this.operacionToEdit) {
      this.suscriptions.push(
        this._operacionService.create(newOperacion).subscribe({
          next: () => {
            this.buttonSending = false;
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha creado la operación correctamente.'
            );
            this.modalRef.close({ accion: this.button.label });
          },
          error: (error) => {
            this.buttonSending = false;
            this.handleErrorMessage(
              error,
              'Ha ocurrido un error al crear la operación.'
            );
          },
        })
      );
    } else {
      this.suscriptions.push(
        this._operacionService.put(newOperacion).subscribe({
          next: (result) => {
            this.buttonSending = false;
            this._notificationService.notificationSuccess(
              'Información',
              'Ha sido modificada la operación correctamente.'
            );
            this.modalRef.close({ accion: this.button.label });
          },
          error: (error) => {
            this.buttonSending = false;
            this.handleErrorMessage(
              error,
              'Ha ocurrido un error con la operacion.'
            );
          },
        })
      );
    }
  }

  ngOnInit(): void {
    if (!this.operacionToEdit) {
      this.formModalOperacion
        .get('servidor')!
        .addValidators(Validators.required);
      this.formModalOperacion.updateValueAndValidity();
    }
    this._serverService.getAll({ page: 0, size: 1000 }).subscribe((result) => {
      this.serverList = result.resources.filter(
        (server) => server.servicio == TipoServidor.DATAMINER
      );
    });
    this.webSocketService.connect();
    this.webSocketService.socket.onmessage=(event)=>{
      this.onMessage(event);
    };
  }

  onMessage(event:any): void {
    console.log("onMessage");
    console.log(event);
    if (event.data != undefined && event.data != '') {
      let errMsg:ErrorMessage =JSON.parse(event.data);
      this._notificationService.notificationError(
        'Error',
        errMsg.message!
      );
    }
    
  }

  checkForm() {
    if (this.operacionToEdit && !this.formModalOperacion.invalid) {
      return false;
    }
    return this.formModalOperacion.invalid ? true : false;
  }

  closeForm() {
    this.modalRef.close(null);
  }

  onChange(event: any) {
    if (event !== this.operacionToEdit?.fechaInicio) {
      this.formModalOperacion.controls['fechaFin'].setValue('');
    }
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
