import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Baliza } from 'src/app/core/models/baliza.model';
import { configDataMimerInterfece } from 'src/app/core/models/interfaces';
import { ConfigBalizaAPIService } from 'src/app/core/services/config-baliza-api.service';
import { ConfiguracionBalizaService } from 'src/app/core/services/configuracion-baliza.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { formatISO } from 'date-fns';

@Component({
  selector: 'app-configuracion-anti-barrido',
  templateUrl: './configuracion-anti-barrido.component.html',
  styleUrls: ['./configuracion-anti-barrido.component.less'],
})
export class ConfiguracionAntiBarridoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() balizaSelected!: Baliza;
  @Input() allowEdit: boolean = false;
  @Input() dataApi!: any;
  @Input() isConfigAntiBarridoSelected!: boolean;
  @Output() loadingGeneral = new EventEmitter<any>();

  configReadAntiBarrido: Array<any> = [];
  configWriteAntiBarrido: Array<any> = [];
  arrayConfigAntiBarrido!: configDataMimerInterfece[];

  valueAntibarrido!: any | null;
  spinerAntibarrido = false;
  estadoPeticionAntibarrido = 'error al cargar';
  nuevoValueAntibarrido!: string | null;

  valueFechaInicioAntiBarridoHora!: any | null;
  valueFechaFinAntiBarridoHora!: any | null;
  valueFechaInicioAntiBarrido!: any | null;
  spinerFechaInicioAntiBarrido = false;
  estadoPeticionFechaInicioAntiBarrido = 'error al cargar';
  nuevoValueFechaInicioAntiBarrido!: string | null;

  valueFechaFinAntiBarrido!: any | null;
  spinerFechaFinAntiBarrido = false;
  estadoPeticionFechaFinAntiBarrido = 'error al cargar';
  nuevoValueFechaFinAntiBarrido!: string | null;

  spinerAntiBarrido = false;
  estadoPeticionAntiBarrido = 'error al cargar';
  estadoEnviarConfigAntiBarridoEstado: boolean = true;
  estadoEnviarConfigAntiBarridoFechaFin: boolean = true;
  estadoEnviarConfigAntiBarridoFechaInicio: boolean = true;

  myInterval : any;
  suscriptions: Array<any> = [];

  constructor(
    private _configBalizaAPIService: ConfigBalizaAPIService,
    private configuracionBalizaService: ConfiguracionBalizaService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // this._configBalizaAPIService.selectedItem5$.subscribe((value) => {
    //   this.arrayConfigAntiBarrido = value;
    //   if (value) {
    //     this.configReadAntiBarrido = value.filter(
    //       (config) => config.Type == 'Read'
    //     );
    //     this.configWriteAntiBarrido = value.filter(
    //       (config) => config.Type == 'Write'
    //     );
    //     this.cargarDatosApi();
    //     this.obtenerEstadoPeticionConfigAntiBarrido();
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
    if (changes['isConfigAntiBarridoSelected']) {
      if (changes['isConfigAntiBarridoSelected'].currentValue) {
        this.myInterval = setInterval(() => {
            this.getConfigAntiBarridos()
        }, 20000);
        this.getConfigAntiBarridos(true);
        this.obtenerEstadoPeticionConfigAntiBarrido();
      }
      if (!changes['isConfigAntiBarridoSelected'].currentValue) {
        clearInterval(this.myInterval);
      }
    }
  }

  getConfigAntiBarridos(emitir? :boolean) {
    emitir ? this.loadingGeneral.emit(true) : null;
    this.suscriptions.push(
      this.configuracionBalizaService
        .getConfiguracionAntiBarridos({
          idDataminer: this.balizaSelected.idDataminer,
          idElement: this.balizaSelected.idElement,
        })
        .subscribe({
          next: (result) => {
            let value = result.body.d;
            this.arrayConfigAntiBarrido = value;
            this.configReadAntiBarrido = value.filter(
              (config: { Type: string }) => config.Type == 'Read'
            );
            this.configWriteAntiBarrido = value.filter(
              (config: { Type: string }) => config.Type == 'Write'
            );            
            this.cargarDatosApi();
            emitir ? this.loadingGeneral.emit(false) : null;
          },
          error: (err) => {
            emitir ? this.loadingGeneral.emit(false) : null;
            this._notificationService.notificationError(
              'Error',
              'Error al cargar la configuracion anti_barridos.'
            );
          },
        })
    );
  }

  nuevoEstadoAntibarrido() {
    this.spinerAntibarrido = true;
    this.estadoPeticionAntibarrido = '';
    this.suscriptions.push(
      this.configuracionBalizaService
        .nuevaConfiguracionEstadoAntiBarrido({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
          nuevoEstadoAntiBarrido: this.valueAntibarrido,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.spinerAntibarrido = false;
              this.nuevoValueAntibarrido =
                this.valueAntibarrido == 0
                  ? 'Desactivado'
                  : this.valueAntibarrido == 1
                  ? 'Activado (Todo Apagado)'
                  : 'Activado (Módem Apagado)';
              this.estadoPeticionAntibarrido = 'Ok';
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su petición, debe aplicar los cambios'
              );
              // this.estadoEnviarConfigAntiBarridoEstado = false;            
            } else {
              this.spinerAntibarrido = false;
              this.estadoPeticionAntibarrido = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al realizar la configuración.'
              );
            }
          },
        })
    );
  }

  nuevoEstadoFechaInicioAntiBarrido() {
    this.valueFechaInicioAntiBarrido.setHours(this.valueFechaInicioAntiBarridoHora.getHours());
    this.valueFechaInicioAntiBarrido.setMinutes(this.valueFechaInicioAntiBarridoHora.getMinutes());
    this.valueFechaInicioAntiBarrido.setSeconds(this.valueFechaInicioAntiBarridoHora.getSeconds());    

    this.spinerFechaInicioAntiBarrido = true;
    this.estadoPeticionFechaInicioAntiBarrido = '';
    this.suscriptions.push(
    this.configuracionBalizaService
      .nuevaConfiguracionFechaInicioAntiBarrido({
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
        nuevaFechaIniAntiBarrido: formatISO(this.valueFechaInicioAntiBarrido),
      })
      .subscribe({
        next: (result) => {},
        error: (err) => {
          if (err.status == 202) {
            this.spinerFechaInicioAntiBarrido = false;
            
            this.nuevoValueFechaInicioAntiBarrido = (
            this.valueFechaInicioAntiBarrido.toLocaleString()
            );            
            this.estadoPeticionFechaInicioAntiBarrido = 'Ok';
            this._notificationService.notificationInfo(
              'Información',
              'Se ha enviado su petición, debe aplicar los cambios'
            );
            // this.estadoEnviarConfigAntiBarridoFechaInicio = false;
          } else {
            this.spinerFechaInicioAntiBarrido = false;
            this.estadoPeticionFechaInicioAntiBarrido = 'Fallido';
            this._notificationService.notificationError(
              'Error',
              'Error al realizar la configuración.'
            );
          }
        },
      })
    )
  }

  nuevoEstadoFechaFinAntiBarrido() {
    this.valueFechaFinAntiBarrido.setHours(this.valueFechaFinAntiBarridoHora.getHours());
    this.valueFechaFinAntiBarrido.setMinutes(this.valueFechaFinAntiBarridoHora.getMinutes());
    this.valueFechaFinAntiBarrido.setSeconds(this.valueFechaFinAntiBarridoHora.getSeconds());

    this.spinerFechaFinAntiBarrido = true;
    this.estadoPeticionFechaFinAntiBarrido = '';
    this.suscriptions.push(
      this.configuracionBalizaService
        .nuevaConfiguracionFechaFinAntiBarrido({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
          nuevaFechaFinAntiBarrido: formatISO(this.valueFechaFinAntiBarrido),
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.spinerFechaFinAntiBarrido = false;
              this.nuevoValueFechaFinAntiBarrido =
                this.valueFechaInicioAntiBarrido.toLocaleString();
              this.estadoPeticionFechaFinAntiBarrido = 'OK';
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su petición, debe aplicar los cambios'
              );
              // this.estadoEnviarConfigAntiBarridoFechaFin = false;
            } else {
              this.spinerFechaFinAntiBarrido = false;
              this.estadoPeticionFechaFinAntiBarrido = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al realizar la configuración.'
              );
            }
          },
        })
    );
  }

  aplicarConfigAntiBarrido() {
    this.spinerAntiBarrido = true;
    this.estadoPeticionAntiBarrido = '';
    this.suscriptions.push(
      this.configuracionBalizaService
        .aplicarAntiBarrido({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {},
          error: (err) => {
            if (err.status == 202) {
              this.estadoPeticionAntiBarrido = 'OK';
              this._notificationService.notificationInfo(
                'Información',
                'Se ha enviado su configuración'
              );
              setTimeout(() => {
                this.obtenerEstadoPeticionConfigAntiBarrido(true);
              }, 2000);
            } else {
              this.spinerAntiBarrido = false;
              this.estadoPeticionAntiBarrido = 'Fallido';
              this._notificationService.notificationError(
                'Error',
                'Error al realizar la configuración.'
              );
            }
          },
        })
    );
  }

  obtenerEstadoPeticionConfigAntiBarrido(msg?: boolean) {
    this.suscriptions.push(
      this.configuracionBalizaService
        .obtenerEstadoPeticionAntiBarrido({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {
            this.estadoPeticionAntiBarrido = result.d.DisplayValue;
            this.spinerAntiBarrido = false;
            msg ? this.mostrarMensaje(result.d) : null;
          },
          error: (err) => {
            this.spinerAntiBarrido = false;
            // this._notificationService.notificationError(
            //   'Error',
            //   err.error.message
            // );
          },
        })
    );
  }

  cargarDatosApi() {
    this.valueAntibarrido =
      this.configWriteAntiBarrido[0].Value == 'EMPTY'
        ? null
        : this.configWriteAntiBarrido[0].Value;
    this.nuevoValueAntibarrido = this.configWriteAntiBarrido[0].DisplayValue;
    this.estadoEnviarConfigAntiBarridoEstado = this.nuevoValueAntibarrido != 'Not initialized' ? false : true;

    this.valueFechaInicioAntiBarrido = this.configWriteAntiBarrido[1].Value == 'EMPTY' ? null : (new Date(this.configWriteAntiBarrido[1].Value));    
    this.valueFechaInicioAntiBarridoHora = this.valueFechaInicioAntiBarrido;   
    this.nuevoValueFechaInicioAntiBarrido = this.configWriteAntiBarrido[1].DisplayValue;
    this.estadoEnviarConfigAntiBarridoFechaFin = this.nuevoValueFechaInicioAntiBarrido != 'Not initialized' ? false : true;
    
    this.valueFechaFinAntiBarrido = this.configWriteAntiBarrido[2].Value == 'EMPTY' ? null : (new Date(this.configWriteAntiBarrido[2].Value));
    this.valueFechaFinAntiBarridoHora = this.valueFechaFinAntiBarrido;   
    this.nuevoValueFechaFinAntiBarrido = this.configWriteAntiBarrido[2].DisplayValue;
    this.estadoEnviarConfigAntiBarridoFechaInicio = this.nuevoValueFechaFinAntiBarrido != 'Not initialized' ? false : true;

  }

  mostrarMensaje(data: any) {
    this.getConfigAntiBarridos();
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
