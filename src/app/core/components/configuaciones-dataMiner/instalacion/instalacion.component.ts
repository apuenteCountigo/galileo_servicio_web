import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { Baliza } from 'src/app/core/models/baliza.model';
import { configDataMimerInterfece } from 'src/app/core/models/interfaces';
import { ConfigBalizaAPIService } from 'src/app/core/services/config-baliza-api.service';
import { ConfiguracionBalizaService } from 'src/app/core/services/configuracion-baliza.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { formatISO, format } from 'date-fns';
import { toNumber } from 'ng-zorro-antd/core/util';

@Component({
  selector: 'app-instalacion',
  templateUrl: './instalacion.component.html',
  styleUrls: ['./instalacion.component.less'],
})
export class InstalacionComponent implements OnInit, OnChanges, OnDestroy {
  @Input() balizaSelected!: Baliza;
  @Input() allowEdit: boolean = false;
  @Input() dataApi!: any;
  @Input() isInstallSelected!: boolean;
  @Output() loadingGeneral = new EventEmitter<any>();

  configReadInstalacion: Array<any> = [];
  configWriteInstalacion: Array<any> = [];
  arrayConfig!: configDataMimerInterfece[];

  valueUnidadAdjudicataria!: number | null;
  spinerUnidadAdjudicataria = false;
  estadoPeticionUnidadAdjudicataria = 'error al cargar';
  nuevoValueUnidadAdjudicataria!: string | null;

  valueEstado!: any | null;
  spinerEstado = false;
  estadoPeticionEstado = 'error al cargar';
  nuevoValueEstado!: string | null;

  valueFechaInicioInstalacionHora!: any | null;
  valueFechaInicioInstalacion!: any | null;
  spinerFechaInicioInstalacion = false;
  estadoPeticionFechaInicioInstalacion = 'error al cargar';
  nuevoValueFechaInicioInstalacion!: string | null;

  valueCargaBateriaInstalada!: number | null;
  spinerCargaBateriaInstalada = false;
  estadoPeticionCargaBateriaInstalada = 'error al cargar';
  nuevoValueCargaBateriaInstalada!: string | null;

  valueFechaFinAutorizacionHora!: any | null;
  valueFechaFinAutorizacion!: any | null;
  nuevoValueFechaFinAutorizacion!: any | null;

  myInterval: any;
  suscriptions: Array<any> = [];

  constructor(
    private _configBalizaAPIService: ConfigBalizaAPIService,
    private configuracionBalizaService: ConfiguracionBalizaService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // this._configBalizaAPIService.selectedItem6$.subscribe((value) => {
    //   this.arrayConfig = value;
    //   if (value) {
    //     this.configReadInstalacion = value.filter(
    //       (config) => config.Type == 'Read'
    //     );
    //     this.configWriteInstalacion = value.filter(
    //       (config) => config.Type == 'Write'
    //     );
    //     this.cargarDatosApi();
    //     this.obtenerEstadoPeticionFechaInicioInstalacion();
    //   }
    // })
  }

  ngOnDestroy(): void {
    // this.suscriptions.forEach((s) => s.unsubscribe());
    this.suscriptions.forEach((s) => s.unsubscribe());
    if (this.myInterval) {
      clearInterval(this.myInterval);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isInstallSelected']) {
      if (changes['isInstallSelected'].currentValue) {
        this.myInterval = setInterval(() => {
          this.getConfigInstalacion();
        }, 20000);
        this.obtenerEstadoPeticionFechaInicioInstalacion();
        this.getConfigInstalacion(true);
      }
      if (!changes['isInstallSelected'].currentValue) {
        clearInterval(this.myInterval);
      }
    }
  }

  nuevoEstado() {
    this.spinerEstado = true;
    this.estadoPeticionEstado = '';
    // this.suscriptions.push(
    this.configuracionBalizaService
      .aplicarEstadoBaliza({
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
        estadoBaliza: this.valueEstado,
      })
      .subscribe({
        next: (result) => {},

        error: (err) => {
          if (err.status == 202) {
            this.spinerEstado = false;
            switch (toNumber(this.valueEstado)) {
              case 1:
                this.nuevoValueEstado = 'Operativa';
                break;
              case 2:
                this.nuevoValueEstado = 'A Recuperar';
                break;
              case 3:
                this.nuevoValueEstado = 'Perdida';
                break;
              case 4:
                this.nuevoValueEstado = 'Baja';
                break;
              case 5:
                this.nuevoValueEstado = 'Disponible en Unidad';
                break;
              case 6:
                this.nuevoValueEstado = 'En Reparación';
                break;
              case 7:
                this.nuevoValueEstado = 'En Instalación';
                break;
              default:
                break;
            }
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha aplicado su configuración'
            );
            1;
            setTimeout(() => {
              this.getConfigInstalacion();
            }, 2000);
            //
          } else {
            this.spinerEstado = false;
            this.estadoPeticionEstado = 'Fallido';
            this._notificationService.notificationError(
              'Error',
              'Error al realizar la configuración.'
            );
          }
        },
      });
    // );
  }

  nuevoFechaInicioInstalacion() {
    this.valueFechaInicioInstalacion.setHours(
      this.valueFechaInicioInstalacionHora.getHours()
    );
    this.valueFechaInicioInstalacion.setMinutes(
      this.valueFechaInicioInstalacionHora.getMinutes()
    );

    this.spinerFechaInicioInstalacion = true;
    this.estadoPeticionFechaInicioInstalacion = '';
    // this.suscriptions.push(
    this.configuracionBalizaService
      .aplicarFechaInicioInstalacion({
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
        fechaInicInstalac: formatISO(this.valueFechaInicioInstalacion),
      })
      .subscribe({
        next: (result) => {},
        error: (err) => {
          if (err.status == 202) {
            this.nuevoValueFechaInicioInstalacion =
              this.valueFechaInicioInstalacion;
            // this.valueFechaInicioInstalacion = null;
            this._notificationService.notificationInfo(
              'Información',
              'Se enviaron los cambios.'
            );
            setTimeout(() => {
              this.obtenerEstadoPeticionFechaInicioInstalacion(true);
            }, 2000);
          } else {
            this.spinerFechaInicioInstalacion = false;
            this.estadoPeticionFechaInicioInstalacion = 'Fallido';
            this._notificationService.notificationError(
              'Error',
              'Error al realizar la configuración.'
            );
          }
        },
      });
    // );
  }

  nuevoFechaFinAutorizacion() {
    this.valueFechaFinAutorizacion.setHours(
      this.valueFechaFinAutorizacionHora.getHours()
    );
    this.valueFechaFinAutorizacion.setMinutes(
      this.valueFechaFinAutorizacionHora.getMinutes()
    );

    // this.spinerFechaInicioInstalacion = true;
    this.configuracionBalizaService
      .aplicarFechaFinAutorizacion({
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
        fechaFinAutorizacion: formatISO(this.valueFechaFinAutorizacion),
      })
      .subscribe({
        next: (result) => {},
        error: (err) => {
          if (err.status == 202) {
            this.nuevoValueFechaFinAutorizacion =
              this.valueFechaFinAutorizacion;
            // this.valueFechaInicioInstalacion = null;
            this._notificationService.notificationInfo(
              'Información',
              'Se enviaron los cambios.'
            );
            setTimeout(() => {
              this.obtenerEstadoPeticionFechaInicioInstalacion(true);
            }, 2000);
          } else {
            this.spinerFechaInicioInstalacion = false;
            this.estadoPeticionFechaInicioInstalacion = 'Fallido';
            this._notificationService.notificationError(
              'Error',
              'Error al realizar la configuración.'
            );
          }
        },
      });
    // );
  }

  nuevoCargaBateriaInstalada() {
    this.spinerCargaBateriaInstalada = true;
    this.estadoPeticionCargaBateriaInstalada = '';
    // this.suscriptions.push(
    this.configuracionBalizaService
      .aplicarCargaBateriaInstalada({
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
        cargaBatInst: this.valueCargaBateriaInstalada,
      })
      .subscribe({
        next: (result) => {},
        error: (err) => {
          if (err.status == 202) {
            this.spinerCargaBateriaInstalada = false;
            this.nuevoValueCargaBateriaInstalada = `${this.valueCargaBateriaInstalada} mAh`;
            this._notificationService.notificationSuccess(
              'Éxito',
              'Se ha aplicado su configuración'
            );
            setTimeout(() => {
              this.getConfigInstalacion();
            }, 2000);
          } else {
            this.spinerCargaBateriaInstalada = false;
            this.estadoPeticionCargaBateriaInstalada = 'Fallido';
            this._notificationService.notificationError(
              'Error',
              'Error al aplicar la configuración.'
            );
          }
        },
      });
    // );
  }

  isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  cargarDatosApi() {
    this.valueEstado =
      this.configWriteInstalacion[1].Value == 'EMPTY'
        ? null
        : this.configWriteInstalacion[1].Value;
    this.nuevoValueEstado = this.configWriteInstalacion[1].DisplayValue;

    if (this.configWriteInstalacion[9] && this.isValidDate(this.configWriteInstalacion[9].Value)) {
      this.valueFechaInicioInstalacion = new Date(this.configWriteInstalacion[9].Value);
    } else {
      this.valueFechaInicioInstalacion = null; // O asignar un valor por defecto
    }
    // this.valueFechaInicioInstalacion = new Date(
    //   this.configWriteInstalacion[9].Value
    // );
    this.valueFechaInicioInstalacionHora = this.valueFechaInicioInstalacion;
    this.nuevoValueFechaInicioInstalacion =
      this.configWriteInstalacion[9].DisplayValue == 'Not initialized'
        ? null
        : this.configWriteInstalacion[9].DisplayValue;

    if (this.configWriteInstalacion[8] && this.isValidDate(this.configWriteInstalacion[8].Value)) {
      this.valueFechaFinAutorizacion = new Date(this.configWriteInstalacion[8].Value);
    } else {
      this.valueFechaFinAutorizacion = null; // O asignar un valor por defecto
    }
    // this.valueFechaFinAutorizacion = new Date(
    //   this.configWriteInstalacion[8].Value
    // );
    this.valueFechaFinAutorizacionHora = this.valueFechaFinAutorizacion;
    this.nuevoValueFechaFinAutorizacion =
      this.configWriteInstalacion[8].DisplayValue == 'Not initialized'
        ? null
        : this.configWriteInstalacion[8].DisplayValue;

    this.valueCargaBateriaInstalada =
      this.configWriteInstalacion[10].Value == 'EMPTY'
        ? 0
        : +this.configWriteInstalacion[10].Value;
    this.nuevoValueCargaBateriaInstalada =
      this.configWriteInstalacion[10].DisplayValue;
  }

  mostrarMensaje(data: any) {
    this.getConfigInstalacion();
    if (data.Value == 1 || data.Value == 6) {
      this._notificationService.notificationSuccess(
        'Información',
        'Se ha aplicado la configuración.'
      );
    } else {
      let msg = `No se ha aplicado la configuracion, motivo: ${data.DisplayValue}`;
      this._notificationService.notificationWarning('Advertencia', msg);
    }
  }

  obtenerEstadoPeticionFechaInicioInstalacion(msg?: boolean) {
    this.suscriptions.push(
      this.configuracionBalizaService
        .obtenerEstadoPeticionIFechaInicioInstalacion({
          idDataminer: this.balizaSelected?.idDataminer,
          idElement: this.balizaSelected?.idElement,
        })
        .subscribe({
          next: (result) => {
            this.estadoPeticionFechaInicioInstalacion = result.d.DisplayValue;
            this.spinerFechaInicioInstalacion = false;
            msg ? this.mostrarMensaje(result.d) : null;
          },
          error: (err) => {
            this.spinerFechaInicioInstalacion = false;
          },
        })
    );
  }

  getConfigInstalacion(emitir?: boolean) {
    emitir ? this.loadingGeneral.emit(true) : null;
    this.suscriptions.push(
      this.configuracionBalizaService
        .getConfiguracionInstalacionBaliza({
          idDataminer: this.balizaSelected.idDataminer,
          idElement: this.balizaSelected.idElement,
        })
        .subscribe({
          next: (result) => {
            let value = result.body.d;
            this.arrayConfig = value;
            this.configReadInstalacion = value.filter(
              (config: { Type: string }) => config.Type == 'Read'
            );
            this.configWriteInstalacion = value.filter(
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
}
