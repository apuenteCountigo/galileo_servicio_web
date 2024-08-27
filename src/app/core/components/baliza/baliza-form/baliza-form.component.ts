import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { PagedResourceCollection, Sort } from '@lagoshny/ngx-hateoas-client';
import { Baliza } from 'src/app/core/models/baliza.model';
import { Estado } from 'src/app/core/models/estado.model';
import {
  ModeloBaliza,
  TipoBaliza,
  TipoContrato,
} from 'src/app/core/models/momencaldores.model';
import { Server } from 'src/app/core/models/server.model';
import { BalizaService } from 'src/app/core/services/baliza.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ButtonInterface } from '../../user/user-form/user-form.component';
import { SearchData } from '../stock-table/stock-table.component';
import { validatePhoneNumber } from 'src/app/core/utils/validate-phone';
import { NomencladorModelosBalizasService } from 'src/app/core/services/nomencladores/modelosbalizas.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-baliza-form',
  templateUrl: './baliza-form.component.html',
  styleUrls: ['./baliza-form.component.less'],
})
export class BalizaFormComponent implements OnInit, AfterViewInit, OnDestroy {
  /** Variables */
  @Input() balizaToEdit?: Baliza;

  formModalBaliza: FormGroup;

  button: ButtonInterface = {
    label: 'AGREGAR',
    icon: 'plus',
  };

  @Input() tipoBalizaList: any;
  @Input() tipoContratoList: any;
  @Input() estadoBalizaList: Estado[] = [];
  @Input() serverList: Server[] = [];
  searchStateQueyParams = {
    descripcion: '',
    id: 0,
    idTipoEntidad: 3,
  };

  searchCriteria: SearchData = {
    clave: '',
    marca: '',
    numSeries: '',
    compania: '',
    fechaInicio: '',
    fechaFin: '',
    unidad: 0,
    idEstadoBaliza: 0,
  };

  buttonSending = false;

  suscriptions: Array<any> = [];

  formatterNumber = (value: number): string => `+${value}`;

  listModelosBalizas: any[] = [];
  isLoading: boolean=true;

  /** Constructor */
  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private _balizaService: BalizaService,
    private _notificationService: NotificationService,
    private _nomencladorModelosBalizas: NomencladorModelosBalizasService,
  ) {
    this.formModalBaliza = this.fb.group({
      clave: [
        '',
        [Validators.required, Validators.maxLength, Validators.pattern],
      ],
      tipoBaliza: ['', []],
      marca: ['', [Validators.required, Validators.maxLength(11)]],
      // idModeloBaliza: ['', [Validators.required, Validators.maxLength(11)]],
      numSerie: ['', [Validators.required, Validators.maxLength(50)]],
      coordenada: ['', []],
      telefono: ['', [Validators.required, Validators.pattern]],
      imei: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(20),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      compania: ['', [Validators.required]],
      tipoContrato: ['', []],
      pin1: [
        '',
        [
          Validators.maxLength(4),
          Validators.minLength(4),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      pin2: [
        '',
        [
          Validators.maxLength(4),
          Validators.minLength(4),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      puk: [
        '',
        [
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      iccTarjeta: ['', [Validators.maxLength]],
      estados: ['', []],
      idDataminer: ['', []],
      idElement: ['', []],
      puerto: ['', [Validators.required]],
      notas: ['', []],
      servidor: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
    });
  }

  /**On Init AfterView Methods */

  ngOnInit(): void {
    
    if (this.balizaToEdit) {
      this.formModalBaliza.controls['servidor'].clearValidators();
      this.formModalBaliza.updateValueAndValidity();
    }
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.isLoading = true;
    this._nomencladorModelosBalizas
      .getAll()
      .subscribe({
        next: (modeloBaliza: PagedResourceCollection<ModeloBaliza>) => {
          this.isLoading = false;
          this.listModelosBalizas = [...modeloBaliza.resources];
        },
        error: (error) => {
          this.isLoading = false;
          this.handleErrorMessage(
            error,
            'Error al obtener los modelos de balizas:'
          );
        }
      });

    if (this.balizaToEdit) {
      this.button.label = 'EDITAR';
      this.button.icon = 'edit';

      // this.formModalBaliza.setValue(this.balizaToEdit);
      this.formModalBaliza.controls['clave'].setValue(this.balizaToEdit!.clave);
      this.formModalBaliza.controls['clave'].disable();
      this.formModalBaliza.controls['tipoBaliza'].setValue(
        this.tipoBalizaList.find(
          (baliza: any) => baliza.id == this.balizaToEdit!.tipoBaliza?.id
        )
      );
      this.formModalBaliza.controls['marca'].setValue(this.balizaToEdit!.marca);
      this.formModalBaliza.controls['marca'].disable();
      // this.formModalBaliza.controls['modelo'].setValue(
      //   this.balizaToEdit!.idModeloBaliza
      // );
      // this.formModalBaliza.controls['modelo'].disable();
      this.formModalBaliza.controls['numSerie'].setValue(
        this.balizaToEdit!.numSerie
      );
      this.formModalBaliza.controls['numSerie'].disable();
      this.formModalBaliza.controls['coordenada'].setValue(
        this.balizaToEdit!.tipoCoordenada
      );
      this.formModalBaliza.controls['imei'].setValue(this.balizaToEdit!.imei);
      this.formModalBaliza.controls['telefono'].setValue(
        this.balizaToEdit!.telefono1
      );
      this.formModalBaliza.controls['pin1'].setValue(this.balizaToEdit!.pin1);
      this.formModalBaliza.controls['pin2'].setValue(this.balizaToEdit!.pin2);
      this.formModalBaliza.controls['puk'].setValue(this.balizaToEdit!.puk);
      this.formModalBaliza.controls['iccTarjeta'].setValue(
        this.balizaToEdit!.iccTarjeta
      );
      this.formModalBaliza.controls['estados'].setValue(
        this.estadoBalizaList.find(
          (estado) =>
            estado.descripcion == this.balizaToEdit!.estados.descripcion
        )
      );
      this.formModalBaliza.controls['compania'].setValue(
        this.balizaToEdit!.compania
      );
      this.formModalBaliza.controls['tipoContrato'].setValue(
        this.tipoContratoList.find(
          (contrato: any) => contrato.id == this.balizaToEdit!.tipoContrato?.id
        )
      );
      this.formModalBaliza.controls['idDataminer'].setValue(
        this.balizaToEdit!.idDataminer
      );
      this.formModalBaliza.controls['idElement'].setValue(
        this.balizaToEdit!.idElement
      );
      this.formModalBaliza.controls['puerto'].setValue(
        this.balizaToEdit!.puerto
      );
      this.formModalBaliza.controls['puerto'].disable();
      this.formModalBaliza.controls['servidor'].setValue(
        this.serverList!.find((s) => s.id === this.balizaToEdit!.servidor?.id)
      );
      this.formModalBaliza.controls['servidor'].disable();
      this.formModalBaliza.controls['modelo'].setValue(
        this.listModelosBalizas!.find((s) => s.id === this.balizaToEdit!.modelo?.id)
      );
      this.formModalBaliza.controls['notas'].setValue(this.balizaToEdit!.notas);
    }
  }

  /** Custom Methods */

  checkForm() {
    return this.formModalBaliza.invalid ? true : false;
  }

  submitForm() {
    this.buttonSending = true;
    const newBaliza = { ...this.balizaToEdit };
    newBaliza.clave = this.formModalBaliza.value.clave
      ? this.formModalBaliza.value.clave
      : this.balizaToEdit?.clave;
    if (this.formModalBaliza.value.tipoBaliza) {
      newBaliza.tipoBaliza = {
        id: this.formModalBaliza.value.tipoBaliza.id,
      } as TipoBaliza;
    } else {
      newBaliza.tipoBaliza = this.balizaToEdit?.tipoBaliza;
    }
    newBaliza.marca = this.formModalBaliza.value.marca
      ? this.formModalBaliza.value.marca
      : this.balizaToEdit?.clave;
    // newBaliza.idModeloBaliza = this.formModalBaliza.value.modelo
      // ? this.formModalBaliza.value.modelo
      // : this.balizaToEdit?.idModeloBaliza;
    newBaliza.numSerie = this.formModalBaliza.value.numSerie
      ? this.formModalBaliza.value.numSerie
      : this.balizaToEdit?.numSerie;
    newBaliza.tipoCoordenada = this.formModalBaliza.value.coordenada
      ? this.formModalBaliza.value.coordenada
      : this.balizaToEdit?.tipoCoordenada;
    newBaliza.imei = this.formModalBaliza.value.imei
      ? this.formModalBaliza.value.imei
      : this.balizaToEdit?.imei;
    newBaliza.telefono1 = this.formModalBaliza.value.telefono
      ? this.formModalBaliza.value.telefono
      : this.balizaToEdit?.telefono1;
    newBaliza.pin1 = this.formModalBaliza.value.pin1
      ? this.formModalBaliza.value.pin1
      : this.balizaToEdit?.pin1;
    newBaliza.pin2 = this.formModalBaliza.value.pin2
      ? this.formModalBaliza.value.pin2
      : this.balizaToEdit?.pin2;
    newBaliza.puk = this.formModalBaliza.value.puk
      ? this.formModalBaliza.value.puk
      : this.balizaToEdit?.puk;
    newBaliza.iccTarjeta = this.formModalBaliza.value.iccTarjeta
      ? this.formModalBaliza.value.iccTarjeta
      : this.balizaToEdit?.iccTarjeta;
    newBaliza.compania = this.formModalBaliza.value.compania
      ? this.formModalBaliza.value.compania
      : this.balizaToEdit?.compania;
    newBaliza.estados = {
      id: !this.balizaToEdit ? 18 : this.formModalBaliza.value.estados.id,
    } as Estado;
    if (this.formModalBaliza.value.tipoContrato) {
      newBaliza.tipoContrato = {
        id: this.formModalBaliza.value.tipoContrato.id,
      } as TipoContrato;
    } else {
      newBaliza.tipoContrato = this.balizaToEdit?.tipoContrato;
    }

    if(this.formModalBaliza.value.modelo){
      newBaliza.modelo = {
        id: this.formModalBaliza.value.modelo.id,
        descripcion: this.formModalBaliza.value.modelo.descripcion,
      } as ModeloBaliza;
    }else{
      newBaliza.modelo =this.balizaToEdit?.modelo;
    }

    newBaliza.idDataminer = this.formModalBaliza.value.idDataminer;
    newBaliza.idElement = this.formModalBaliza.value.idElement;
    newBaliza.serverIp = '';
    newBaliza.puerto = this.formModalBaliza.value.puerto
      ? this.formModalBaliza.value.puerto
      : this.balizaToEdit?.puerto;
    newBaliza.notas = this.formModalBaliza.value.notas
      ? this.formModalBaliza.value.notas
      : this.balizaToEdit?.notas;
    newBaliza.servidor = this.formModalBaliza.value.server
      ? this.formModalBaliza.value.server
      : this.balizaToEdit?.servidor;
    if (!this.balizaToEdit) {
      const fecha = new Date();
      newBaliza.fechaAlta = fecha;
      newBaliza.servidor = {
        id: this.formModalBaliza.value.servidor.id,
        servicio: this.formModalBaliza.value.servidor.servicio,
        puerto: this.formModalBaliza.value.servidor.puerto,
        ipServicio: this.formModalBaliza.value.servidor.ipServicio,
        usuario: this.formModalBaliza.value.servidor.usuario,
        password: this.formModalBaliza.value.servidor.password,
        dmaID: this.formModalBaliza.value.servidor.dmaID,
        viewIDs: this.formModalBaliza.value.servidor.viewIDs,
      } as Server;
    }

    const filter1 = { ...this.searchCriteria };
    const filter2 = { ...this.searchCriteria };
    filter1.clave = this.formModalBaliza.get('clave')?.value;
    filter1.unidad = -1;
    filter2.clave = this.formModalBaliza.get('clave')?.value;
    filter2.unidad = -2;

    if (!this.balizaToEdit) {
      this.suscriptions.push(
        this._balizaService.create(newBaliza as Baliza).subscribe({
          next: () => {
            this.buttonSending = true;
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha insertado la baliza correctamente'
            );
            this.modalRef.close({ accion: this.button.label });
          },
          error: (error) => {
            this.buttonSending = false;
            if (error.status == 500) {
              this.handleErrorMessage(error, error.error.message);
            } else {
              this.handleErrorMessage(
                error,
                'Ocurrió un error al insertar la baliza'
              );
            }
          },
        })
      );
    } else {
      this.suscriptions.push(
        this._balizaService.put(newBaliza as Baliza).subscribe({
          next: () => {
            this.buttonSending = true;
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha modificado la baliza correctamente'
            );
            this.modalRef.close({ accion: this.button.label });
          },
          error: (error) => {
            this.buttonSending = true;
            this.handleErrorMessage(
              error,
              'Ocurrió un error al editar la baliza'
            );
          },
        })
      );
    }
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
      this._notificationService.notificationError('Error', defaultMsg);
    } else {
      this._notificationService.notificationError('Error', defaultMsg);
    }
  }

  validatePhone(e: KeyboardEvent) {
    validatePhoneNumber(e, this.formModalBaliza.controls['telefono'].value);
  }
}
