import { toNumber } from 'ng-zorro-antd/core/util';
import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Baliza } from 'src/app/core/models/baliza.model';
import { configDataMimerInterfece } from 'src/app/core/models/interfaces';
import { ConfigBalizaAPIService } from 'src/app/core/services/config-baliza-api.service';
import { ConfiguracionBalizaService } from 'src/app/core/services/configuracion-baliza.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-configuracion-gps',
  templateUrl: './configuracion-gps.component.html',
  styleUrls: ['./configuracion-gps.component.less'],
})
export class ConfiguracionGpsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() balizaSelected!: Baliza;
  @Input() allowEdit: boolean = false;
  @Input() dataApi!: any;
  @Input() isConfigGpsSelected!: boolean;
  @Output() loadingGeneral = new EventEmitter<any>();

  configReadGPS: Array<any> = [];
  configWriteGPS: Array<any> = [];
  arrayConfig!: configDataMimerInterfece[];

  valueConfigGPS: any | null = 1;
  spinerConfigGPS = false;
  estadoPeticionConfigGPS = 'error al cargar';
  nuevoValueConfigGPS!: string | null;

  valueTiempoAdqMovimiento!: number | null;
  spinerTiempoAdqMovimiento = false;
  estadoPeticionTiempoAdqMovimiento = 'error al cargar';
  nuevoValueTiempoAdqMovimiento!: string | null;

  valueTiempoAdqEstacionamiento!: number | null;
  spinerTiempoAdqEstacionamiento = false;
  estadoPeticionTiempoAdqEstacionamiento = 'error al cargar';
  nuevoValueTiempoAdqEstacionamiento!: string | null;

  valueTiempoPreAdquisicion!: number | null;
  spinerTiempoPreAdquisicion = false;
  estadoPeticionTiempoPreAdquisicion = 'error al cargar';
  nuevoValueTiempoPreAdquisicion!: string | null;

  spinerAplicarConfigBaliza = false;
  estadoPeticionAplicarConfigBaliza = 'error al cargar';

  estadoEnviarConfigGPSTiempoPreAdq: Boolean = true;
  estadoEnviarConfigGPSGPS: Boolean = true;
  estadoEnviarConfigGPSTiempoAdq: Boolean = true;
  estadoEnviarConfigGPSTiempoAdqEst: Boolean = true;

  valueConfigGPSive!: any | null;
  spinerConfigGPSLive = false;
  estadoPeticionConfigGPSive = 'error al cargar';
  nuevoValueConfigGPSive!: string | null;

  valueIntervaloDescarga!: number | null;
  spinerIntervaloDescarga = false;
  estadoPeticionIntervaloDescarga = 'error al cargar';
  nuevoValueIntervaloDescarga!: string | null;

  spinerAplicarConfigGPSLive = false;
  estadoPeticionAplicarConfigGPSLive = 'error al cargar';
  estadoEnviarConfigGPSLive: number = 0;
  estadoEnviarConfigGPSLiveGPSLive: boolean = true;
  estadoEnviarConfigGPSLiveIntDescarga: boolean = true;

  valueConfigEstadoReceptorGlonass!: any | null;
  spinerConfigEstadoReceptorGlonass = false;
  estadoPeticionConfigEstadoReceptorGlonass = 'error al cargar';
  nuevoValueConfigEstadoReceptorGlonass!: string | null;

  spinerAplicarConfigGlonass = false;
  estadoPeticionAplicarConfigGlonass = 'error al cargar';
  estadoEnviarConfigGlonass: number = 0;

  myInterval : any;
  suscriptions: Array<any> = [];

  constructor(
    private _configBalizaAPIService: ConfigBalizaAPIService,
    private configuracionBalizaService: ConfiguracionBalizaService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // this._configBalizaAPIService.selectedItem3$.subscribe((value) => {
    //   this.arrayConfig = value;
    //   if (value) {
    //     this.configReadGPS = value.filter((config) => config.Type == 'Read');
    //     this.configWriteGPS = value.filter((config) => config.Type == 'Write');
    //     this.cargarDatosApi();
    //     this.obtenerEstadoPeticionConfigGPS();
    //     this.obtenerEstadoPeticionConfigGPSLive();
    //     this.obtenerEstadoPeticionConfigGlonass();
    //   }
    // });
  }

  ngOnDestroy(): void {
    if (this.myInterval) {
      clearInterval(this.myInterval);
    }
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isConfigGpsSelected']) {
      if (changes['isConfigGpsSelected'].currentValue) {
        this.myInterval = setInterval(() => {
            this.getConfigBalizaGPS()
        }, 20000);
        this.getConfigBalizaGPS(true);
        this.obtenerEstadoPeticionConfigGPS();
        this.obtenerEstadoPeticionConfigGPSLive();
        this.obtenerEstadoPeticionConfigGlonass();
      }
      if (!changes['isConfigGpsSelected'].currentValue) {
        clearInterval(this.myInterval);
      }
    }
  }

  getConfigBalizaGPS(emitir? :boolean) {
    emitir ? this.loadingGeneral.emit(true) : null;
    this.suscriptions.push(
      this.configuracionBalizaService
        .getConfiguracionBalizaGPS({
          idDataminer: this.balizaSelected.idDataminer,
          idElement: this.balizaSelected.idElement,
        })
        .subscribe({
          next: (result) => {
            let value = result.body.d;
            this.arrayConfig = value;
            this.configReadGPS = value.filter(
              (config: { Type: string }) => config.Type == 'Read'
            );
            this.configWriteGPS = value.filter(
              (config: { Type: string }) => config.Type == 'Write'
            );    
            this.cargarDatosApi();
            emitir ? this.loadingGeneral.emit(false) : null;
          },
          error: (err) => {
            emitir ? this.loadingGeneral.emit(false) : null;
            this._notificationService.notificationError(
              'Error',
              'Error al cargar la nueva configuracion GPS.'
            );
          },
        })
    );
  }

  nuevoConfigGPS() {
    this.spinerConfigGPS = true;
    this.estadoPeticionConfigGPS = '';
    this.suscriptions.push(
      this.configuracionBalizaService
        .nuevaConfiguracionBalizaGPS({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
          valorGps: this.valueConfigGPS,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.spinerConfigGPS = false;
              this.nuevoValueConfigGPS =
                this.valueConfigGPS == 1
                  ? 'Siempre encendido'
                  : this.valueConfigGPS == 2
                  ? 'Siempre apagado'
                  : 'Optimización de Encendido';
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su petición, debe aplicar los cambios'
              );
              // this.estadoEnviarConfigGPSGPS = false;
            } else {
              this.spinerConfigGPS = false;
              this.estadoPeticionConfigGPS = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al realizar la configuración.'
              );
            }
          },
        })
    );
  }

  nuevoTiempoAdqBaliza() {
    this.spinerTiempoAdqMovimiento = true;
    this.estadoPeticionTiempoAdqMovimiento = '';
    this.suscriptions.push(
      this.configuracionBalizaService
        .nuevaConfiguracionTiempoAdqBaliza({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
          valorTiempAdquisMov: this.valueTiempoAdqMovimiento,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.spinerTiempoAdqMovimiento = false;
              this.nuevoValueTiempoAdqMovimiento = `${this.valueTiempoAdqMovimiento} s`;
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su petición, debe aplicar los cambios'
              );
              // this.estadoEnviarConfigGPSTiempoAdq = false;
            } else {
              this.spinerTiempoAdqMovimiento = false;
              this.estadoPeticionTiempoAdqMovimiento = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al realizar la configuración.'
              );
            }
          },
        })
    );
  }

  nuevoTiempoAdqEstacionamiento() {
    this.spinerTiempoAdqEstacionamiento = true;
    this.estadoPeticionTiempoAdqEstacionamiento = '';
    this.suscriptions.push(
      this.configuracionBalizaService
        .nuevaConfiguracionTiempoAdqEstacionBaliza({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
          valorTiempAdquisEst: this.valueTiempoAdqEstacionamiento,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.spinerTiempoAdqEstacionamiento = false;
              this.nuevoValueTiempoAdqEstacionamiento = `${this.valueTiempoAdqEstacionamiento} h`;
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su petición, debe aplicar los cambios'
              );
              // this.estadoEnviarConfigGPSTiempoAdqEst = false;
            } else {
              this.spinerTiempoAdqEstacionamiento = false;
              this.estadoPeticionTiempoAdqEstacionamiento = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al realizar la configuración.'
              );
            }
          },
        })
    );
  }

  nuevoTiempoPreAdquisicion() {
    this.spinerTiempoPreAdquisicion = true;
    this.estadoPeticionTiempoPreAdquisicion = '';
    this.suscriptions.push(
      this.configuracionBalizaService
        .nuevaConfiguracionTiempoPreAdqBaliza({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
          valorTiempPreAdquis: this.valueTiempoPreAdquisicion,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.spinerTiempoPreAdquisicion = false;
              this.nuevoValueTiempoPreAdquisicion = `${this.valueTiempoPreAdquisicion} s`;
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su petición, debe aplicar los cambios'
              );
              // this.estadoEnviarConfigGPSTiempoPreAdq = false;
            } else {
              this.spinerTiempoPreAdquisicion = false;
              this.estadoPeticionTiempoPreAdquisicion = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al realizar la configuración.'
              );
            }
          },
        })
    );
  }

  aplicarConfigGPS() {
    this.spinerAplicarConfigBaliza = true;
    this.estadoPeticionAplicarConfigBaliza = '';
    this.suscriptions.push(
      this.configuracionBalizaService
        .aplicarConfiguracionBalizaGPS({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su configuración'
              );
              setTimeout(() => {
                this.obtenerEstadoPeticionConfigGPS(true);
              }, 2000);
            } else {
              this.spinerAplicarConfigBaliza = false;
              this.estadoPeticionAplicarConfigBaliza = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al realizar la configuración.'
              );
            }
          },
        })
    );
  }

  obtenerEstadoPeticionConfigGPS(msg?: boolean) {
    this.suscriptions.push(
      this.configuracionBalizaService
        .obtenerEstadoPeticionGPS({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {
            this.estadoPeticionAplicarConfigBaliza = result.d.DisplayValue;
            this.spinerAplicarConfigBaliza = false;
            msg ? this.mostrarMensaje(result.d) : null;
          },
          error: (err) => {
            this.spinerAplicarConfigBaliza = false;
            // this._notificationService.notificationError(
            //   'Error',
            //   err.error.message
            // );
          },
        })
    );
  }

  nuevoConfigGPSive() {
    this.spinerConfigGPSLive = true;
    this.estadoPeticionConfigGPSive = '';
    this.suscriptions.push(
      this.configuracionBalizaService
        .nuevaConfiguracionGPSLive({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
          valorNuevaConfigGpsLive: this.valueConfigGPSive,
        })
        .subscribe({
          next: (result) => {
            this.spinerConfigGPSLive = false;
            this.nuevoValueConfigGPSive =
              this.valueConfigGPSive == 0 ? 'Habilitado' : 'Deshabilitado';
            this._notificationService.notificationInfo(
              'Información',
              'Se ha enviado su petición, debe aplicar los cambios'
            );
            this.estadoEnviarConfigGPSLiveGPSLive = false;
          },
          error: (err) => {
            this.spinerConfigGPSLive = false;
            this.estadoPeticionConfigGPS = 'Fallido';
            this._notificationService.notificationError(
              'Error',
              'Error al realizar la configuración.'
            );
          },
        })
    );
  }

  nuevoIntervaloDescarga() {
    this.spinerIntervaloDescarga = true;
    this.estadoPeticionIntervaloDescarga = '';
    this.suscriptions.push(
      this.configuracionBalizaService
        .nuevaConfiguracionIntervaloDescargaBaliza({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
          valorIntervaloMin: this.valueIntervaloDescarga,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.spinerIntervaloDescarga = false;
              this.nuevoValueIntervaloDescarga = `${this.valueIntervaloDescarga} min`;
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su petición, debe aplicar los cambios'
              );
              this.estadoEnviarConfigGPSLiveIntDescarga = false;
            } else {
              this.spinerIntervaloDescarga = false;
              this.estadoPeticionConfigGPS = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al realizar la configuración.'
              );
            }
          },
        })
    );
  }

  aplicarConfigGPSLive() {
    this.spinerAplicarConfigGPSLive = true;
    this.estadoPeticionAplicarConfigGPSLive = '';
    this.suscriptions.push(
      this.configuracionBalizaService
        .aplicarConfiguracionGPSLive({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.getConfigBalizaGPS();
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su configuración'
              );
              setTimeout(() => {
                this.obtenerEstadoPeticionConfigGPSLive(true);
              }, 2000);
            } else {
              this.spinerAplicarConfigGPSLive = false;
              this.estadoPeticionAplicarConfigGPSLive = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al realizar la configuración.'
              );
            }
          },
        })
    );
  }
  obtenerEstadoPeticionConfigGPSLive(msg?: boolean) {
    this.suscriptions.push(
      this.configuracionBalizaService
        .obtenerEstadoPeticionGPSLive({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {
            this.estadoPeticionAplicarConfigGPSLive = result.d.DisplayValue;
            this.spinerAplicarConfigGPSLive = false;
            msg ? this.mostrarMensaje(result.d) : null;
          },
          error: (err) => {
            this.spinerAplicarConfigGPSLive = false;
            // this._notificationService.notificationError(
            //   'Error',
            //   err.error.message
            // );
          },
        })
    );
  }

  nuevoConfigEstadoReceptorGlonass() {
    this.spinerConfigEstadoReceptorGlonass = true;
    this.estadoPeticionConfigEstadoReceptorGlonass = '';
    this.suscriptions.push(
      this.configuracionBalizaService
        .nuevaConfiguracionEstadoReceptorGlonass({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
          valorRecepGlonass: this.valueConfigEstadoReceptorGlonass,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.spinerConfigEstadoReceptorGlonass = false;
              this.nuevoValueConfigEstadoReceptorGlonass =
                this.valueConfigEstadoReceptorGlonass == 0
                  ? 'Deshabilitado'
                  : 'Habilitado';
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su petición, debe aplicar los cambios'
              );
              this.estadoEnviarConfigGlonass++;
            } else {
              this.spinerConfigEstadoReceptorGlonass = false;
              this.estadoPeticionConfigEstadoReceptorGlonass = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al realizar la configuración.'
              );
            }
          },
        })
    );
  }

  aplicarConfigGlonass() {
    this.spinerAplicarConfigGlonass = true;
    this.estadoPeticionAplicarConfigGlonass = '';
    this.suscriptions.push(
      this.configuracionBalizaService
        .aplicarConfiguracionGlonass({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.getConfigBalizaGPS();
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su configuración'
              );
              setTimeout(() => {
                this.obtenerEstadoPeticionConfigGlonass(true);
              }, 2000);
            } else {
              this.spinerAplicarConfigGlonass = false;
              this.estadoPeticionAplicarConfigGlonass = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al realizar la configuración.'
              );
            }
          },
        })
    );
  }

  obtenerEstadoPeticionConfigGlonass(msg?: boolean) {
    this.suscriptions.push(
      this.configuracionBalizaService
        .obtenerEstadoPeticionGlonass({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {
            this.estadoPeticionAplicarConfigGlonass = result.d.DisplayValue;

            this.spinerAplicarConfigGlonass = false;
            msg ? this.mostrarMensaje(result.d) : null;
          },
          error: (err) => {
            this.spinerAplicarConfigGlonass = false;
            // this._notificationService.notificationError(
            //   'Error',
            //   err.error.message
            // );
          },
        })
    );
  }

  cargarDatosApi() {
    this.valueConfigGPS = this.configWriteGPS[0].Value == 'EMPTY'
        ? null
        : this.configWriteGPS[0].Value;
    this.nuevoValueConfigGPS = this.configWriteGPS[0].DisplayValue;
    this.estadoEnviarConfigGPSGPS = this.nuevoValueConfigGPS != 'Not initialized' ? false : true;

    this.valueTiempoAdqMovimiento = this.configWriteGPS[1].Value == 'EMPTY'
        ? 0
        : +this.configWriteGPS[1].Value;
    this.nuevoValueTiempoAdqMovimiento = this.configWriteGPS[1].DisplayValue;
    this.estadoEnviarConfigGPSTiempoAdq = this.nuevoValueTiempoAdqMovimiento != 'Not initialized' ? false : true;


    this.valueTiempoAdqEstacionamiento = this.configWriteGPS[2].Value == 'EMPTY'
        ? 0
        : +this.configWriteGPS[2].Value;
    this.nuevoValueTiempoAdqEstacionamiento = this.configWriteGPS[2].DisplayValue;
    this.estadoEnviarConfigGPSTiempoAdqEst = this.nuevoValueTiempoAdqEstacionamiento != 'Not initialized' ? false : true;

    this.valueTiempoPreAdquisicion = this.configWriteGPS[3].Value == 'EMPTY'
        ? 0
        : +this.configWriteGPS[3].Value;
    this.nuevoValueTiempoPreAdquisicion = this.configWriteGPS[3].DisplayValue;
    this.estadoEnviarConfigGPSTiempoPreAdq = this.nuevoValueTiempoPreAdquisicion != 'Not initialized' ? false : true;
    
    this.valueConfigGPSive = this.configWriteGPS[5].Value == 'EMPTY'
        ? null
        : this.configWriteGPS[5].Value;
    this.nuevoValueConfigGPSive = this.configWriteGPS[5].DisplayValue;

    this.valueIntervaloDescarga = this.configWriteGPS[6].Value == 'EMPTY'
        ? 0
        : +this.configWriteGPS[6].Value;
    this.nuevoValueIntervaloDescarga = this.configWriteGPS[6].DisplayValue;

    this.valueConfigEstadoReceptorGlonass = this.configWriteGPS[8].Value == 'EMPTY'
        ? null
        : this.configWriteGPS[8].Value;
    this.nuevoValueConfigEstadoReceptorGlonass = this.configWriteGPS[8].DisplayValue;    
  }

  mostrarMensaje(data: any) {
    this.getConfigBalizaGPS();
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
}
