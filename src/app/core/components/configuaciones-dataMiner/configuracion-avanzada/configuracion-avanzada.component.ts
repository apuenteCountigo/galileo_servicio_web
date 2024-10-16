import { Component, Input, OnInit, OnDestroy, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { toNumber } from 'ng-zorro-antd/core/util';
import { Observable } from 'rxjs';
import { Baliza } from 'src/app/core/models/baliza.model';
import { configDataMimerInterfece } from 'src/app/core/models/interfaces';
import { ConfigBalizaAPIService } from 'src/app/core/services/config-baliza-api.service';
import { ConfiguracionBalizaService } from 'src/app/core/services/configuracion-baliza.service';
import { NotificationService } from './../../../services/notification.service';
import { formatISO } from 'date-fns';

@Component({
  selector: 'app-configuracion-avanzada',
  templateUrl: './configuracion-avanzada.component.html',
  styleUrls: ['./configuracion-avanzada.component.less'],
})
export class ConfiguracionAvanzadaComponent implements OnInit, OnChanges, OnDestroy {
  @Input() balizaSelected!: Baliza;
  @Input() allowEdit!: boolean;
  @Input() dataApi!: any;
  @Input() isAvanzadaSelected!: boolean;
  @Output() loadingGeneral = new EventEmitter<any>();

  respuestaApi: any;

  configRead: Array<any> = [];
  configWrite: Array<any> = [];
  arrayConfig!: configDataMimerInterfece[];

  observable!: Observable<configDataMimerInterfece>;

  estadoConfigLed!: any | null;
  spinerConfigLed = false;
  estadoPeticionCOnfigLed = 'error al cargar';
  nuevoValueConfiguracionLed!: any | null;
  estadoEnviarConfigLed: boolean = true;

  valueUmbralSensibilidad!: number | null;
  spinerUmbralSensibilidad = false;
  estadoPeticionUmbralSensibilidad = 'error al cargar';
  nuevoValueUmbralSensibilidad!: any | null;
  estadoEnviarUmbralSensibilidad: boolean = true;

  valueDetectorSonido!: any | null;
  spinerDetectorSonido = false;
  estadoPeticionDetectorSonido = 'error al cargar';
  nuevoValueDetectorSonido!: string | null;
  estadoEnviarDetectorSonido: boolean = true;

  valueNuevoTemporizador!: number | null;
  spinerTemporizador = false;
  estadoPeticionTemporizador = 'error al cargar';
  nuevoValueTemporizador!: any | null;
  estadoEnviarTemporizador: boolean = true;

  valueConfigPais!: any | null;
  spinerConfigPais = false;
  estadoPeticionConfigPais = 'error al cargar';
  nuevoValueConfigPais!: string | null;

  valueConfigVoltajeApagado!: number | null;
  spinerConfigVoltajeApagado = false;
  estadoPeticionConfigVoltajeApagado = 'error al cargar';
  nuevoValueConfigVoltajeApagado!: any | null;

  valueConfigVoltajeEncendido!: number | null;
  spinerConfigVoltajeEncendido = false;
  estadoPeticionConfigVoltajeEncendido = 'error al cargar';
  nuevoValueConfigVoltajeEncendido!: any | null;

  spinerAplicarConfigLed: boolean = false;
  spinerAplicaUmbralSensibilidad: boolean = false;
  spinerAplicaDetectorSonido: boolean = false;
  spinerAplicaTemporizador: boolean = false;

  estadoPeticionUmbralUPS = 'error al cargar';
  spinerAplicaUmbralUPS: boolean = false;
  estadoEnviarUmbralUPSVoltajeEncendido: boolean = true;
  estadoEnviarUmbralUPSVoltajeApagado: boolean = true;

  myInterval : any;
  suscriptions: Array<any> = [];

  constructor(
    private _configBalizaAPIService: ConfigBalizaAPIService,
    private configuracionBalizaService: ConfiguracionBalizaService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // this._configBalizaAPIService.selectedItem1$.subscribe((value) => {
    //   this.arrayConfig = value;
    //   if (value) {
    //     this.configRead = value.filter((config) => config.Type == 'Read');
    //     this.configWrite = value.filter((config) => config.Type == 'Write');
    //     this.cargarDatosApi();
    //     this.obtenerEstadoPeticionConfigLed();
    //     this.obtenerEstadoPeticionUmbralSensibilidad();
    //     this.obtenerEstadoPeticionDetectorSonido();
    //     this.obtenerEstadoPeticionTemporizador();
    //     this.obtenerEstadoPeticionUmbralUPS();
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
    if (this.myInterval) {
      clearInterval(this.myInterval);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isAvanzadaSelected']) {
      if (changes['isAvanzadaSelected'].currentValue) {
        this.myInterval = setInterval(() => {
            this.getConfigBalizaAvanzada()
        }, 20000);
        this.getConfigBalizaAvanzada(true);
        this.obtenerEstadoPeticionConfigLed();
        this.obtenerEstadoPeticionUmbralSensibilidad();
        this.obtenerEstadoPeticionDetectorSonido();
        this.obtenerEstadoPeticionTemporizador();
        this.obtenerEstadoPeticionUmbralUPS();
      }
      if (!changes['isAvanzadaSelected'].currentValue) {
        clearInterval(this.myInterval);
      }
    }
  }

  getConfigBalizaAvanzada(emitir?: boolean) {
    emitir ? this.loadingGeneral.emit(true) : null;
    this.suscriptions.push(
      this.configuracionBalizaService
        .getConfiguracionBalizaConfigLed({
          idDataminer: this.balizaSelected.idDataminer,
          idElement: this.balizaSelected.idElement,
        })
        .subscribe({
          next: (result) => {
            let value = result.body.d;
            this.configRead = value.filter(
              (config: { Type: string }) => config.Type == 'Read'
            );
            this.configWrite = value.filter(
              (config: { Type: string }) => config.Type == 'Write'
            );          
            this.cargarDatosApi();
            emitir ? this.loadingGeneral.emit(false) : null;
          },
          error: (err) => {
            emitir ? this.loadingGeneral.emit(false) : null;
            this._notificationService.notificationError(
              'Error',
              'Error al cargar la configuración avanzada.'
            );
          },
        })
    );
  }

  //UMBRAL DE SENSIBILIDAD
  nuevoUmbralSensibilidad() {
    this.spinerUmbralSensibilidad = true;
    this.estadoPeticionUmbralSensibilidad = '';

    this.suscriptions.push(
      this.configuracionBalizaService
        .nuevoUmbralSensibilidad({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
          valor: this.valueUmbralSensibilidad,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.nuevoValueUmbralSensibilidad = this.valueUmbralSensibilidad;
              this.spinerUmbralSensibilidad = false;
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su petición, debe aplicar los cambios'
              );
              this.estadoEnviarUmbralSensibilidad = false;
            } else {
              this.spinerUmbralSensibilidad = false;
              this.estadoPeticionUmbralSensibilidad = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al realizar la configuración.'
              );
            }
          },
        })
    );
  }
  aplicarUmbralSensibilidad() {
    this.spinerAplicaUmbralSensibilidad = true;
    this.suscriptions.push(
      this.configuracionBalizaService
        .aplicarUmbralSensibilidad({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.nuevoValueUmbralSensibilidad = this.valueUmbralSensibilidad;
              this.valueUmbralSensibilidad = null;
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su configuración'
              );
              setTimeout(() => {
                this.obtenerEstadoPeticionUmbralSensibilidad(true);
              }, 2000);
              this.estadoEnviarUmbralSensibilidad = true;
            } else {
              this.spinerAplicaUmbralSensibilidad = false;
              this.estadoPeticionUmbralSensibilidad = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al aplicar la configuración.'
              );
            }
          },
        })
    );
  }
  obtenerEstadoPeticionUmbralSensibilidad(msg?: boolean) {
    this.suscriptions.push(
      this.configuracionBalizaService
        .obtenerEstadoEnvioUmbralSensibilidad({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {
            if (result.d.Value == 4) {
              this.estadoEnviarUmbralSensibilidad = false;
            }
            this.estadoPeticionUmbralSensibilidad = result.d.DisplayValue;
            this.spinerAplicaUmbralSensibilidad = false;
            msg ? this.mostrarMensaje(result.d) : null;
          },
          error: (err) => {
            this.spinerAplicaUmbralSensibilidad = false;
            // this._notificationService.notificationError(
            //   'Error',
            //   err.error.message
            // );
          },
        })
    );
  }

  //DETECTOR DE SONIDO
  nuevoEstadoDetectorDeSonido() {
    this.spinerDetectorSonido = true;
    this.estadoPeticionDetectorSonido = '';

    this.suscriptions.push(
      this.configuracionBalizaService
        .nuevoEstadoDetectorSonido({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
          estadoDetecSoni: this.valueDetectorSonido,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.spinerDetectorSonido = false;
              switch (toNumber(this.valueDetectorSonido)) {
                case 0:
                  this.nuevoValueDetectorSonido = 'Inactivo';
                  break;
                case 1:
                  this.nuevoValueDetectorSonido = 'Activo';
                  break;
                default:
                  break;
              }
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su petición, debe aplicar los cambios'
              );
              this.estadoEnviarDetectorSonido = false;
            } else {
              this.spinerDetectorSonido = false;
              this.estadoPeticionUmbralSensibilidad = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al realizar la configuración.'
              );
            }
          },
        })
    );
  }
  aplicarEstadoDetectorDeSonido() {
    this.spinerAplicaDetectorSonido = true;
    this.suscriptions.push(
      this.configuracionBalizaService
        .aplicarEstadoDetectorSonido({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.nuevoValueDetectorSonido = this.valueDetectorSonido;
              this.valueDetectorSonido = null;
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su configuración'
              );
              setTimeout(() => {
                this.obtenerEstadoPeticionDetectorSonido();
              }, 2000);
              this.estadoEnviarDetectorSonido = true;
            } else {
              this.spinerAplicaDetectorSonido = false;
              this.estadoPeticionDetectorSonido = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al aplicar la configuración.'
              );
            }
          },
        })
    );
  }
  obtenerEstadoPeticionDetectorSonido(msg?: Boolean) {
    this.suscriptions.push(
      this.configuracionBalizaService
        .obtenerEstadoEnvioDetectorSonido({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {
            if (result.d.Value == 4) {
              this.estadoEnviarDetectorSonido = false;
            }
            this.estadoPeticionDetectorSonido = result.d.DisplayValue;
            this.spinerAplicaDetectorSonido = false;
            msg ? this.mostrarMensaje(result.d) : null;
          },
          error: (err) => {
            this.spinerAplicaDetectorSonido = false;
            // this._notificationService.notificationError(
            //   'Error',
            //   err.error.message
            // );
          },
        })
    );
  }
  //TEMPORIZADOR
  nuevoNuevoTemporizador() {
    this.spinerTemporizador = true;
    this.estadoPeticionTemporizador = '';

    this.suscriptions.push(
      this.configuracionBalizaService
        .nuevoTemporizador({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
          valor_temporizador: this.valueNuevoTemporizador,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.spinerTemporizador = false;
              (this.nuevoValueTemporizador = `${this.valueNuevoTemporizador} Seg`),
                this._notificationService.notificationInfo(
                  'Información',
                  'Se ha enviado su petición, debe aplicar los cambios'
                );
              this.estadoEnviarTemporizador = false;
            } else {
              this.spinerUmbralSensibilidad = false;
              this.estadoPeticionUmbralSensibilidad = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al realizar la configuración.'
              );
            }
          },
        })
    );
  }
  aplicarNuevoTemporizador() {
    this.spinerAplicaTemporizador = true;
    this.suscriptions.push(
      this.configuracionBalizaService
        .aplicarTemporizador({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.nuevoValueTemporizador = this.valueNuevoTemporizador;
              this.valueNuevoTemporizador = null;
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su configuración'
              );
              setTimeout(() => {
                this.obtenerEstadoPeticionTemporizador(true);
              }, 2000);
              this.estadoEnviarTemporizador = true;
            } else {
              this.spinerAplicaTemporizador = false;
              this.estadoPeticionTemporizador = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al aplicar la configuración.'
              );
            }
          },
        })
    );
  }
  obtenerEstadoPeticionTemporizador(msg?: boolean) {
    this.suscriptions.push(
      this.configuracionBalizaService
        .obtenerEstadoEnvioModemTemporizador({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {
            if (result.d.Value == 4) {
              this.estadoEnviarTemporizador = false;
            }
            this.estadoPeticionTemporizador = result.d.DisplayValue;
            this.spinerAplicaTemporizador = false;
            msg ? this.mostrarMensaje(result.d) : null;
          },
          error: (err) => {
            this.spinerAplicaTemporizador = false;
            // this._notificationService.notificationError(
            //   'Error',
            //   err.error.message
            // );
          },
        })
    );
  }

  //CONFIGURACION LED
  nuevoConfigLed() {
    this.spinerConfigLed = true;
    this.estadoPeticionCOnfigLed = '';
    this.suscriptions.push(
      this.configuracionBalizaService
        .nuevoEstadoConfigLed({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
          estadoConfLed: this.estadoConfigLed,
        })
        .subscribe({
          next: (result) => {
            // let respuestaApi = result;
          },
          error: (err) => {
            if (err.status == 202) {
              this.spinerConfigLed = false;
              switch (toNumber(this.estadoConfigLed)) {
                case 0:
                  this.nuevoValueConfiguracionLed = 'Desactivado';
                  break;
                case 1:
                  this.nuevoValueConfiguracionLed = 'Activado';
                  break;
                default:
                  break;
              }
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su petición, debe aplicar los cambios'
              );
              this.estadoEnviarConfigLed = false;
            } else {
              this.spinerConfigLed = false;
              this.estadoPeticionCOnfigLed = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al realizar la configuración.'
              );
              //fin
            }
          },
        })
    );
  }
  aplicarConfiguracionLed() {
    this.spinerAplicarConfigLed = true;
    //luego que no me de error aplico la configuracion
    this.suscriptions.push(
      this.configuracionBalizaService
        .aplicarNuevoEstadoConfigLed({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.estadoConfigLed = null;
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su configuración'
              );
              setTimeout(() => {
                this.obtenerEstadoPeticionConfigLed(true);
              }, 2000);
              this.estadoEnviarConfigLed = true;
            } else {
              this.spinerAplicarConfigLed = false;
              this.estadoPeticionCOnfigLed = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al realizar la configuración.'
              );
            }
          },
        })
    );
  }
  obtenerEstadoPeticionConfigLed(msg?: boolean) {
    this.suscriptions.push(
      this.configuracionBalizaService
        .obtenerEstadoEnvioConfigLed({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {
            if (result.d.Value == 4) {
              this.estadoEnviarConfigLed = false;
            }
            this.estadoPeticionCOnfigLed = result.d.DisplayValue;
            this.spinerAplicarConfigLed = false;
            msg ? this.mostrarMensaje(result.d) : null;
          },
          error: (err) => {
            this.spinerAplicarConfigLed = false;
            // this._notificationService.notificationError(
            //   'Error',
            //   err.error.message
            // );
          },
        })
    );
  }

  //CONFIGURACION ALARMA PAIS
  aplicarAlarmaPais() {
    this.spinerConfigPais = true;
    this.estadoPeticionConfigPais = '';
    this.suscriptions.push(
      this.configuracionBalizaService
        .aplicarConfigPais({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
          confAlarmaPais: this.valueConfigPais,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.spinerConfigPais = false;
              switch (toNumber(this.valueConfigPais)) {
                case 0:
                  this.nuevoValueConfigPais = 'Inactiva';
                  break;
                case 1:
                  this.nuevoValueConfigPais = 'Activa';
                  break;
                default:
                  break;
              }
              this.valueConfigPais = null;
              this._notificationService.notificationSuccess(
                'Información',
                'Se aplicaron los cambios.'
              );
            } else {
              this.spinerConfigPais = false;
              this.estadoPeticionConfigPais = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al aplicar la configuración.'
              );
            }
          },
        })
    );
  }
  obtenerEstadoPeticionConfigPais() {
    this.suscriptions.push(
      this.configuracionBalizaService
        .obtenerEstadoConfigPais({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {
            this.estadoPeticionConfigPais = result.d.DisplayValue;
            this.spinerConfigPais = false;
            this.mostrarMensaje(result.d);
          },
          error: (err) => {
            this.spinerAplicaUmbralUPS = false;
            // this._notificationService.notificationError(
            //   'Error',
            //   err.error.message
            // );
          },
        })
    );
  }
  //NUEVO UMBRAL UPS
  nuevoVoltajeApagado() {
    this.spinerConfigVoltajeApagado = true;
    this.estadoPeticionConfigVoltajeApagado = '';
    this.suscriptions.push(
      this.configuracionBalizaService
        .aplicarNuevoVoltajeApagado({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
          nuevoVoltApag: this.valueConfigVoltajeApagado,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.nuevoValueConfigVoltajeApagado = `${this.valueConfigVoltajeApagado}.00 mV`;
              this.valueConfigVoltajeApagado = null;
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su petición, debe aplicar los cambios'
              );
              this.spinerConfigVoltajeApagado = false;
              // this.estadoEnviarUmbralUPSVoltajeApagado = false;
            } else {
              this.spinerConfigVoltajeApagado = false;
              this.estadoPeticionConfigVoltajeApagado = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al aplicar la configuración.'
              );
            }
          },
        })
    );
  }
  nuevoVoltajeEncendido() {
    this.spinerConfigVoltajeEncendido = true;
    this.estadoPeticionConfigVoltajeEncendido = '';
    this.suscriptions.push(
      this.configuracionBalizaService
        .aplicarNuevoVoltajeEncendido({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
          nuevoVoltEncen: this.valueConfigVoltajeEncendido,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.nuevoValueConfigVoltajeEncendido = `${this.valueConfigVoltajeEncendido}.00 mV`;
              this.valueConfigVoltajeEncendido = null;
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su petición, debe aplicar los cambios'
              );
              this.spinerConfigVoltajeEncendido = false;
              // this.estadoEnviarUmbralUPSVoltajeEncendido = false;
            } else {
              this.spinerConfigVoltajeEncendido = false;
              this.estadoPeticionConfigVoltajeEncendido = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al aplicar la configuración.'
              );
            }
          },
        })
    );
  }
  aplicarNuevoUmbralUPS() {
    this.spinerAplicaUmbralUPS = true;
    this.suscriptions.push(
      this.configuracionBalizaService
        .aplicarUmbralUPS({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.valueNuevoTemporizador = null;
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su configuración'
              );
              setTimeout(() => {
                this.obtenerEstadoPeticionUmbralUPS(true);
              }, 2000);
              this.estadoEnviarUmbralUPSVoltajeApagado = true;
              this.estadoEnviarUmbralUPSVoltajeEncendido = true;
            } else {
              this.spinerAplicaUmbralUPS = false;
              this.estadoPeticionUmbralUPS = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al aplicar la configuración.'
              );
            }
          },
        })
    );
  }
  obtenerEstadoPeticionUmbralUPS(msg?: boolean) {
    this.suscriptions.push(
      this.configuracionBalizaService
        .obtenerEstadoEnvioUmbralUPS({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {
            if (result.d.Value == 4) {
              //si el envio esta pendiente dejamos activo el boton              
              this.estadoEnviarUmbralUPSVoltajeApagado = false;
              this.estadoEnviarUmbralUPSVoltajeEncendido = false;
            }
            this.spinerAplicaUmbralUPS = false;
            this.estadoPeticionUmbralUPS = result.d.DisplayValue;
            msg ? this.mostrarMensaje(result.d) : null;
          },
          error: (err) => {
            this.spinerAplicaUmbralUPS = false;
            // this._notificationService.notificationError(
            //   'Error',
            //   err.error.message
            // );
          },
        })
    );
  }

  cargarDatosApi() {
    this.estadoConfigLed =
      this.configWrite[0].Value == 'EMPTY' ? null : this.configWrite[0].Value;
    this.nuevoValueConfiguracionLed = this.configWrite[0].DisplayValue;

    this.valueUmbralSensibilidad =
      this.configWrite[2].Value == 'EMPTY' ? 0 : +this.configWrite[2].Value;
    this.nuevoValueUmbralSensibilidad = this.configWrite[2].DisplayValue;

    this.valueDetectorSonido =
      this.configWrite[5].Value == 'EMPTY' ? null : this.configWrite[5].Value;
    this.nuevoValueDetectorSonido = this.configWrite[5].DisplayValue;

    this.valueNuevoTemporizador =
      this.configWrite[7].Value == 'EMPTY' ? 0 : +this.configWrite[7].Value;
    this.nuevoValueTemporizador = this.configWrite[7].DisplayValue;

    this.valueConfigPais =
      this.configWrite[4].Value == 'EMPTY' ? null : this.configWrite[4].Value;
    this.nuevoValueConfigPais = this.configWrite[4].DisplayValue;

    this.valueConfigVoltajeApagado =
      this.configWrite[9].Value == 'EMPTY' ? 0 : +this.configWrite[9].Value;
    this.nuevoValueConfigVoltajeApagado = this.configWrite[9].DisplayValue;
    this.estadoEnviarUmbralUPSVoltajeApagado = this.nuevoValueConfigVoltajeApagado > 0 ? false : true;

    this.valueConfigVoltajeEncendido =
      this.configWrite[10].Value == 'EMPTY' ? 0 : +this.configWrite[10].Value;
    this.nuevoValueConfigVoltajeEncendido = this.configWrite[10].DisplayValue;
    this.estadoEnviarUmbralUPSVoltajeEncendido = this.nuevoValueConfigVoltajeEncendido > 0 ? false : true;

  }
  mostrarMensaje(data: any) {
    this.getConfigBalizaAvanzada();
    if (data.Value == 1) {
      this._notificationService.notificationSuccess(
        'Información',
        'Se ha aplicado la configuración.'
      );
    } else {
      let msg = `No se ha aplicado la configuracion, motivo: ${data.DisplayValue}`;
      this._notificationService.notificationWarning('Advertencia', msg);
    }
  }
  changeSelect() {}
}
