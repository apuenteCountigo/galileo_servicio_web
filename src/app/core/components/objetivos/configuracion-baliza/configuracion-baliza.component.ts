import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Baliza } from 'src/app/core/models/baliza.model';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ButtonInterface } from '../../user/user-form/user-form.component';
import { ConfiguracionBalizaService } from './../../../services/configuracion-baliza.service';

@Component({
  selector: 'app-configuracion-baliza',
  templateUrl: './configuracion-baliza.component.html',
  styleUrls: ['./configuracion-baliza.component.less'],
})
export class ConfiguracionBalizaComponent implements OnInit {
  @Input() baliza!: Baliza;
  respuestaApi: any;
  ngOnInit(): void {
    this.cargarConfigBaliza();
  }

  formModalConfiguracion: FormGroup;

  button: ButtonInterface = {
    label: 'AGREGAR',
    icon: 'plus',
  };

  estadoConfiguracion = [
    {
      id: 1,
      descripcion: 'Activado',
    },
    {
      id: 0,
      descripcion: 'Desactivado',
    },
  ];

  enableEstadoConfig = true;
  enableUmbralSonido = true;
  enableNuevoEstadoConfig = true;
  enableNuevoTemporizador = true;
  enableUmbralSensibilidad = true;

  esperandoAPI = true;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private _notificationService: NotificationService,
    private http: HttpClient,
    private configuracionBalizaService: ConfiguracionBalizaService
  ) {
    this.formModalConfiguracion = this.fb.group({
      estadoConfiguracion: ['', [Validators.required]],
      umbralSonido: ['', [Validators.required, Validators.pattern]],
      nuevoEstadoConfiguracion: ['', [Validators.required]],
      nuevoTemporizador: ['', [Validators.required]],
      umbralSensibilidad: ['', [Validators.required]],
    });
  }

  checkForm() {
    return this.formModalConfiguracion.invalid ? true : false;
  }

  closeForm() {
    this.modalRef.close({ accion: 'CANCELAR' });
  }

  desahbilitarEstadoConfig(e: string) {
    if (e) {
      this.enableEstadoConfig = false;
    } else {
      this.enableEstadoConfig = true;
    }
  }
  desahbilitarUmbralSonido(e: number) {
    if (e > 0) {
      this.enableUmbralSonido = false;
    } else {
      this.enableUmbralSonido = true;
    }
  }
  desahbilitarNuevoEstadoConfig(e: string) {
    if (e) {
      this.enableNuevoEstadoConfig = false;
    } else {
      this.enableNuevoEstadoConfig = true;
    }
  }
  desahbilitarNuevoTemporizador(e: number) {
    if (e > 0) {
      this.enableNuevoTemporizador = false;
    } else {
      this.enableNuevoTemporizador = true;
    }
  }
  desahbilitarUmbralSensibilidad(e: number) {
    if (e > 0) {
      this.enableUmbralSensibilidad = false;
    } else {
      this.enableUmbralSensibilidad = true;
    }
  }

  submitEstadoConfig() {
    this.esperandoAPI = true;
    this.configuracionBalizaService
      .submitEstadoConfig({
        idDataminer: this.baliza.idDataminer,
        idElement: this.baliza.idElement,
        estado: this.formModalConfiguracion.value.estadoConfiguracion,
      })
      .subscribe({
        next: () => {
          this.enableUmbralSonido = true;
          this.formModalConfiguracion.controls['estadoConfiguracion'].setValue(
            ''
          );
          this._notificationService.notificationSuccess(
            'Información',
            'Se ha configurado correctamente la baliza.'
          );
          this.esperandoAPI = false;
        },
        error: (err) => {
          this.enableUmbralSonido = true;
          this.formModalConfiguracion.controls['estadoConfiguracion'].setValue(
            ''
          );
          this._notificationService.notificationError(
            'Error',
            'Error al configurar el estado de configuración LED de la baliza.'
          );
          this.esperandoAPI = false;
        },
      });
  }
  submitUmbralSonido() {
    this.esperandoAPI = true;
    this.configuracionBalizaService
      .submitUmbralSonido({
        idDataminer: this.baliza.idDataminer,
        idElement: this.baliza.idElement,
        estado: this.formModalConfiguracion.value.umbralSonido,
      })
      .subscribe({
        next: () => {
          this.enableUmbralSonido = true;
          this.formModalConfiguracion.controls['umbralSonido'].setValue('');
          this._notificationService.notificationSuccess(
            'Información',
            'Se ha configurado la baliza correctamente.'
          );
          this.esperandoAPI = false;
        },
        error: (err) => {
          this.enableUmbralSonido = true;
          this.formModalConfiguracion.controls['umbralSonido'].setValue('');
          this._notificationService.notificationError(
            'Error',
            'Error al configurar el umbral de sensibilidad de la baliza.'
          );
          this.esperandoAPI = false;
        },
      });
  }
  submitNuevoEstado() {
    this.esperandoAPI = true;
    this.configuracionBalizaService
      .submitNuevoEstado({
        idDataminer: this.baliza.idDataminer,
        idElement: this.baliza.idElement,
        estado: this.formModalConfiguracion.value.nuevoEstadoConfiguracion,
      })
      .subscribe({
        next: () => {
          this.enableNuevoEstadoConfig = true;
          this.formModalConfiguracion.controls[
            'nuevoEstadoConfiguracion'
          ].setValue('');
          this._notificationService.notificationSuccess(
            'Información',
            'Se ha configurado la baliza correctamente.'
          );
          this.esperandoAPI = false;
        },
        error: (err) => {
          this.enableNuevoEstadoConfig = true;
          this.formModalConfiguracion.controls[
            'nuevoEstadoConfiguracion'
          ].setValue('');
          this._notificationService.notificationError(
            'Error',
            'Error al configurar el Nuevo estado configuración LED de la baliza.'
          );
          this.esperandoAPI = false;
        },
      });
  }
  submitNuevoTemp() {
    this.esperandoAPI = true;
    this.configuracionBalizaService
      .submitNuevoTemp({
        idDataminer: this.baliza.idDataminer,
        idElement: this.baliza.idElement,
        estado: this.formModalConfiguracion.value.nuevoTemporizador,
      })
      .subscribe({
        next: () => {
          this.enableNuevoTemporizador = true;
          this.formModalConfiguracion.controls['nuevoTemporizador'].setValue(
            ''
          );
          this._notificationService.notificationSuccess(
            'Información',
            'Se ha configurado la baliza correctamente.'
          );
          this.esperandoAPI = false;
        },
        error: (err) => {
          this.enableNuevoTemporizador = true;
          this.formModalConfiguracion.controls['nuevoTemporizador'].setValue(
            ''
          );
          this._notificationService.notificationError(
            'Error',
            'Error al configurar el nuevo temporizador la baliza.'
          );
          this.esperandoAPI = false;
        },
      });
  }

  submitUmbralSensibilidad() {
    this.esperandoAPI = true;
    this.configuracionBalizaService
      .submitUmbralSensibilidad({
        idDataminer: this.baliza.idDataminer,
        idElement: this.baliza.idElement,
        estado: this.formModalConfiguracion.value.umbralSensibilidad,
      })
      .subscribe({
        next: () => {
          this.enableUmbralSensibilidad = true;
          this.formModalConfiguracion.controls['umbralSensibilidad'].setValue(
            ''
          );
          this._notificationService.notificationSuccess(
            'Información',
            'Se ha configurado la baliza correctamente.'
          );
          this.esperandoAPI = false;
        },
        error: (err) => {
          this.enableUmbralSensibilidad = false;
          this.formModalConfiguracion.controls['umbralSensibilidad'].setValue(
            ''
          );
          this._notificationService.notificationError(
            'Error',
            'Error al aplicar el umbral de configuración de la baliza.'
          );
          this.esperandoAPI = false;
        },
      });
  }
  cargarConfigBaliza() {
    this.esperandoAPI = true;

    this.configuracionBalizaService
      .getConfiguracionBalizaConfigLed({
        idDataminer: this.baliza.idDataminer,
        idElement: this.baliza.idElement,
      })
      .subscribe({
        next: (result) => {
          this.respuestaApi = result;
          this._notificationService.notificationSuccess(
            'Información',
            'Se ha cargado la configuración de la baliza correctamente.'
          );
          this.esperandoAPI = false;
          this.llenarFormulario(this.respuestaApi);
        },
        error: (err) => {
          this._notificationService.notificationError(
            'Error',
            'Error al cargar los datos de la baliza.'
          );
          this.esperandoAPI = false;
        },
      });
  }
  llenarFormulario(data: any) {
    let arrayCongig = data.body.d;

    arrayCongig.forEach((element: any) => {
      switch (element.ParameterName) {
        case 'Estado Configuración LED':
          this.formModalConfiguracion.controls['estadoConfiguracion'].setValue(
            parseInt(element.Value)
          );
          break;
        case 'Umbral de Sensibilidad':
          this.formModalConfiguracion.controls['umbralSonido'].setValue(
            parseInt(element.Value)
          );
          break;
        case 'Nuevo Estado Configuración LED':
          this.formModalConfiguracion.controls[
            'nuevoEstadoConfiguracion'
          ].setValue(parseInt(element.Value));
          break;
        case 'Nuevo Temporizador (Segundos)':
          this.formModalConfiguracion.controls['nuevoTemporizador'].setValue(
            parseInt(element.Value)
          );
          break;
        case 'Apply Umbral Config':
          this.formModalConfiguracion.controls['umbralSensibilidad'].setValue(
            parseInt(element.Value)
          );
          break;
        default:
          break;
      }
    });
  }
}
