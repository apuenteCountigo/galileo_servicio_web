import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Baliza } from 'src/app/core/models/baliza.model';
import { configDataMimerInterfece } from 'src/app/core/models/interfaces';
import { ConfigBalizaAPIService } from 'src/app/core/services/config-baliza-api.service';
import { ConfiguracionBalizaService } from 'src/app/core/services/configuracion-baliza.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-alertas-operativa',
  templateUrl: './alertas-operativa.component.html',
  styleUrls: ['./alertas-operativa.component.less'],
})
export class AlertasOperativaComponent implements OnInit, OnChanges, OnDestroy {
  @Input() balizaSelected!: Baliza;
  @Input() allowEdit: boolean = false;
  @Input() dataApi!: any;
  @Input() isAlertaOperativaSelected!: boolean;
  @Output() loadingGeneral = new EventEmitter<any>();

  configReadAlertasOperativas: Array<any> = [];
  configWriteAlertasOperativas: Array<any> = [];
  arrayConfigAlertasOperativas!: configDataMimerInterfece[];

  valueEmailAvisoCargaBateria!: string | null;
  spinerEmailAvisoCargaBateria = false;
  estadoPeticionEmailAvisoCargaBateria = 'error al cargar';
  nuevoValueEmailAvisoCargaBateria!: string | null;

  valueEmailAvisoInicioMovimiento!: string | null;
  spinerEmailAvisoInicioMovimiento = false;
  estadoPeticionEmailAvisoInicioMovimiento = 'error al cargar';
  nuevoValueEmailAvisoInicioMovimiento!: string | null;

  valueEmailAvisoFinMovimiento!: string | null;
  spinerEmailAvisoFinMovimiento = false;
  estadoPeticionEmailAvisoFinMovimiento = 'error al cargar';
  nuevoValueEmailAvisoFinMovimiento!: string | null;

  valueEmailAvisoEntradaGeocerca!: string | null;
  spinerEmailAvisoEntradaGeocerca = false;
  estadoPeticionEmailAvisoEntradaGeocerca = 'error al cargar';
  nuevoValueEmailAvisoEntradaGeocerca!: string | null;

  valueEmailAvisoSalidaGeocerca!: string | null;
  spinerEmailAvisoSalidaGeocerca = false;
  estadoPeticionEmailAvisoSalidaGeocerca = 'error al cargar';
  nuevoValueEmailAvisoSalidaGeocerca!: string | null;

  valueEmailAvisoCambioPais!: string | null;
  spinerEmailAvisoCambioPais = false;
  estadoPeticionEmailAvisoCambioPais = 'error al cargar';
  nuevoValueEmailAvisoCambioPais!: string | null;

  valueTelAvisoCargaBateria!: string | null;
  spinerTelAvisoCargaBateria = false;
  estadoPeticionTelAvisoCargaBateria = 'error al cargar';
  nuevoValueTelAvisoCargaBateria!: string | null;

  valueTelAvisoInicioMovimiento!: string | null;
  spinerTelAvisoInicioMovimiento = false;
  estadoPeticionTelAvisoInicioMovimiento = 'error al cargar';
  nuevoValueTelAvisoInicioMovimiento!: string | null;

  valueTelAvisoFinMovimiento!: string | null;
  spinerTelAvisoFinMovimiento = false;
  estadoPeticionTelAvisoFinMovimiento = 'error al cargar';
  nuevoValueTelAvisoFinMovimiento!: string | null;

  valueTelAvisoEntradaGeocerca!: string | null;
  spinerTelAvisoEntradaGeocerca = false;
  estadoPeticionTelAvisoEntradaGeocerca = 'error al cargar';
  nuevoValueTelAvisoEntradaGeocerca!: string | null;

  valueTelAvisoSalidaGeocerca!: string | null;
  spinerTelAvisoSalidaGeocerca = false;
  estadoPeticionTelAvisoSalidaGeocerca = 'error al cargar';
  nuevoValueTelAvisoSalidaGeocerca!: string | null;

  valueTelAvisoCambioPais!: string | null;
  spinerTelAvisoCambioPais = false;
  estadoPeticionTelAvisoCambioPais = 'error al cargar';
  nuevoValueTelAvisoCambioPais!: string | null;

  myInterval : any;
  suscriptions: Array<any> = [];

  constructor(
    private _configBalizaAPIService: ConfigBalizaAPIService,
    private configuracionBalizaService: ConfiguracionBalizaService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // this._configBalizaAPIService.selectedItem4$.subscribe((value) => {
    //   this.arrayConfigAlertasOperativas = value;
    //   if(value){
    //     this.configReadAlertasOperativas = value.filter(
    //       (config) => config.Type == 'Read'
    //     );
    //     this.configWriteAlertasOperativas = value.filter(
    //       (config) => config.Type == 'Write'
    //     );      
    //     this.cargarDatosApi();
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
    if (changes['isAlertaOperativaSelected']) {
      if (changes['isAlertaOperativaSelected'].currentValue) {
        this.myInterval = setInterval(() => {
            this.getConfigAlertasOperativa()
        }, 20000);
        this.getConfigAlertasOperativa(true);
      }
      if (!changes['isAlertaOperativaSelected'].currentValue) {
        clearInterval(this.myInterval);
      }
    }
  }

  getConfigAlertasOperativa(emitir? :boolean) {
    emitir ? this.loadingGeneral.emit(true) : null;
    this.suscriptions.push(
      this.configuracionBalizaService
      .getConfiguracionAlertasOperativa({
        idDataminer: this.balizaSelected.idDataminer,
        idElement: this.balizaSelected.idElement,
      })
      .subscribe({
        next: (result) => {
          let value = result.body.d;
          this.configReadAlertasOperativas = value.filter(
            (config: { Type: string; }) => config.Type == 'Read'
          );
          this.configWriteAlertasOperativas = value.filter(
            (config: { Type: string; }) => config.Type == 'Write'
          );      
          this.cargarDatosApi();
          emitir ? this.loadingGeneral.emit(false) : null;
        },
        error: (err) => {
          emitir ? this.loadingGeneral.emit(false) : null;
        },
      })
    )
  }

  nuevoEmailAvisoCargaBateria() {
    this.spinerEmailAvisoCargaBateria = true;
    this.estadoPeticionEmailAvisoCargaBateria = '';
    this.suscriptions.push(
    this.configuracionBalizaService
      .aplicarEmailAvisoBateria({
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
        emailCargaBateria: this.valueEmailAvisoCargaBateria,
      })
      .subscribe({
        next: (result) => {},
        error: (err) => {
          if (err.status == 202) {
            this.spinerEmailAvisoCargaBateria = false;
            this.estadoPeticionEmailAvisoCargaBateria = 'Ok';
            this.nuevoValueEmailAvisoCargaBateria =
              this.valueEmailAvisoCargaBateria;
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha aplicado la configuración.'
            );
          } else {
            this.spinerEmailAvisoCargaBateria = false;
            this.estadoPeticionEmailAvisoCargaBateria = 'Fallido';
            this._notificationService.notificationError(
              'Error',
              'Error al realizar la configuración.'
            );
          }
        },
      })
    )
  }
  nuevoEmailAvisoInicioMovimiento() {
    this.spinerEmailAvisoInicioMovimiento = true;
    this.estadoPeticionEmailAvisoInicioMovimiento = '';
    this.suscriptions.push(
    this.configuracionBalizaService
      .aplicarEmailInicioMovimiento({
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
        emailAvisoInicioMov: this.valueEmailAvisoInicioMovimiento,
      })
      .subscribe({
        next: (result) => {},
        error: (err) => {
          if (err.status == 202) {
            this.spinerEmailAvisoInicioMovimiento = false;
            this.nuevoValueEmailAvisoInicioMovimiento =
              this.valueEmailAvisoInicioMovimiento;
            this.estadoPeticionEmailAvisoInicioMovimiento = 'Ok';
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha aplicado la configuración.'
            );
          } else {
            this.spinerEmailAvisoInicioMovimiento = false;
            this.estadoPeticionEmailAvisoInicioMovimiento = 'Fallido';
            this._notificationService.notificationError(
              'Error',
              'Error al realizar la configuración.'
            );
          }
        },
      })
    )
  }
  nuevoEmailAvisoFinMovimiento() {
    this.spinerEmailAvisoFinMovimiento = true;
    this.estadoPeticionEmailAvisoFinMovimiento = '';
    this.suscriptions.push(
    this.configuracionBalizaService
      .aplicarEmailFinMovimiento({
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
        emailAvisoFinMovi: this.valueEmailAvisoFinMovimiento,
      })
      .subscribe({
        next: (result) => {},
        error: (err) => {
          if (err.status == 202) {
            this.spinerEmailAvisoFinMovimiento = false;
            this.nuevoValueEmailAvisoFinMovimiento =
              this.valueEmailAvisoFinMovimiento;
            this.estadoPeticionEmailAvisoFinMovimiento = 'Ok';
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha aplicado la configuración.'
            );
          } else {
            this.spinerEmailAvisoFinMovimiento = false;
            this.estadoPeticionEmailAvisoFinMovimiento = 'Fallido';
            this._notificationService.notificationError(
              'Error',
              'Error al realizar la configuración.'
            );
          }
        },
      })
    )
  }
  nuevoEmailAvisoEntradaGeocerca() {
    this.spinerEmailAvisoEntradaGeocerca = true;
    this.estadoPeticionEmailAvisoEntradaGeocerca = '';
    this.suscriptions.push(
    this.configuracionBalizaService
      .aplicarEmailAvisoEntradaGeocerca({
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
        emailAvisoEntraGeo: this.valueEmailAvisoEntradaGeocerca,
      })
      .subscribe({
        next: (result) => {},
        error: (err) => {
          if (err.status == 202) {
            this.spinerEmailAvisoEntradaGeocerca = false;
            this.nuevoValueEmailAvisoEntradaGeocerca =
              this.valueEmailAvisoEntradaGeocerca;
            this.estadoPeticionEmailAvisoEntradaGeocerca = 'Ok';
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha aplicado la configuración.'
            );
          } else {
            this.spinerEmailAvisoEntradaGeocerca = false;
            this.estadoPeticionEmailAvisoEntradaGeocerca = 'Fallido';
            this._notificationService.notificationError(
              'Error',
              'Error al realizar la configuración.'
            );
          }
        },
      })
    )
  }
  nuevoEmailAvisoSalidaGeocerca() {
    this.spinerEmailAvisoSalidaGeocerca = true;
    this.estadoPeticionEmailAvisoSalidaGeocerca = '';
    this.suscriptions.push(
    this.configuracionBalizaService
      .aplicarEmailAvisoSalidaGeocerca({
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
        emailAvisoSalGeo: this.valueEmailAvisoSalidaGeocerca,
      })
      .subscribe({
        next: (result) => {},
        error: (err) => {
          if (err.status == 202) {
            this.spinerEmailAvisoSalidaGeocerca = false;
            this.nuevoValueEmailAvisoSalidaGeocerca =
              this.valueEmailAvisoSalidaGeocerca;
            this.estadoPeticionEmailAvisoSalidaGeocerca = 'Ok';
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha aplicado la configuración.'
            );
          } else {
            this.spinerEmailAvisoSalidaGeocerca = false;
            this.estadoPeticionEmailAvisoSalidaGeocerca = 'Fallido';
            this._notificationService.notificationError(
              'Error',
              'Error al realizar la configuración.'
            );
          }
        },
      })
    )
  }
  nuevoEmailAvisoCambioPais() {
    this.spinerEmailAvisoCambioPais = true;
    this.estadoPeticionEmailAvisoCambioPais = '';
    this.suscriptions.push(
    this.configuracionBalizaService
      .aplicarEmailAvisoCambioPais({
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
        emailAvisoCambioPais: this.valueEmailAvisoCambioPais,
      })
      .subscribe({
        next: (result) => {},
        error: (err) => {
          if (err.status == 202) {           
            this.spinerEmailAvisoCambioPais = false;
            this.nuevoValueEmailAvisoCambioPais =
              this.valueEmailAvisoCambioPais;
            this.estadoPeticionEmailAvisoCambioPais = 'Ok';
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha aplicado la configuración.'
            );
          } else {
            this.spinerEmailAvisoCambioPais = false;
            this.estadoPeticionEmailAvisoCambioPais = 'Fallido';
            this._notificationService.notificationError(
              'Error',
              'Error al realizar la configuración.'
            );
          }
        },
      })
    )
  }
  //telefonos
  nuevoTelAvisoCargaBateria() {
    this.spinerTelAvisoCargaBateria = true;
    this.estadoPeticionTelAvisoCargaBateria = '';
    this.suscriptions.push(
    this.configuracionBalizaService
      .aplicarTelAvisoCargaBateria({
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
        telefAvisoCargaBat: this.valueTelAvisoCargaBateria,
      })
      .subscribe({
        next: (result) => {},
        error: (err) => {
          if (err.status == 202) {
            this.spinerTelAvisoCargaBateria = false;
            this.nuevoValueTelAvisoCargaBateria = `${this.valueTelAvisoCargaBateria}`;
            this.estadoPeticionTelAvisoCargaBateria = 'Ok';
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha aplicado la configuración.'
            );
          } else {
            this.spinerTelAvisoCargaBateria = false;
            this.estadoPeticionTelAvisoCargaBateria = 'Fallido';
            this._notificationService.notificationError(
              'Error',
              'Error al realizar la configuración.'
            );
          }
        },
      })
    )
  }
  nuevoTelAvisoInicioMovimiento() {
    this.spinerTelAvisoInicioMovimiento = true;
    this.estadoPeticionTelAvisoInicioMovimiento = '';
    this.suscriptions.push(
    this.configuracionBalizaService
      .aplicarTelAvisoInicioMovimiento({
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
        telefAvisoInicioMov: this.valueTelAvisoInicioMovimiento,
      })
      .subscribe({
        next: (result) => {},
        error: (err) => {
          if (err.status == 202) {
            this.spinerTelAvisoInicioMovimiento = false;
            this.nuevoValueTelAvisoInicioMovimiento = `${this.valueTelAvisoInicioMovimiento}`;
            this.estadoPeticionTelAvisoInicioMovimiento = 'Ok';
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha aplicado la configuración.'
            );
          } else {
            this.spinerTelAvisoInicioMovimiento = false;
            this.estadoPeticionTelAvisoInicioMovimiento = 'Fallido';
            this._notificationService.notificationError(
              'Error',
              'Error al realizar la configuración.'
            );
          }
        },
      })
    )
  }
  nuevoTelAvisoFinMovimiento() {
    this.spinerTelAvisoFinMovimiento = true;
    this.estadoPeticionTelAvisoFinMovimiento = '';
    this.suscriptions.push(
    this.configuracionBalizaService
      .aplicarTelAvisoFinMovimiento({
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
        telefAvisoFinMov: this.valueTelAvisoFinMovimiento,
      })
      .subscribe({
        next: (result) => {},
        error: (err) => {
          if (err.status == 202) {
            this.spinerTelAvisoFinMovimiento = false;
            this.nuevoValueTelAvisoFinMovimiento = `${this.valueTelAvisoFinMovimiento}`;
            this.estadoPeticionTelAvisoFinMovimiento = 'Ok';
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha aplicado la configuración.'
            );
          } else {
            this.spinerTelAvisoFinMovimiento = false;
            this.estadoPeticionTelAvisoFinMovimiento = 'Fallido';
            this._notificationService.notificationError(
              'Error',
              'Error al realizar la configuración.'
            );
          }
        },
      })
    )
  }
  nuevoTelAvisoEntradaGeocerca() {
    this.spinerTelAvisoEntradaGeocerca = true;
    this.estadoPeticionTelAvisoEntradaGeocerca = '';
    this.suscriptions.push(
    this.configuracionBalizaService
      .aplicarTelAvisoEntradaGeocerca({
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
        telefAvisoEntrGeoc: this.valueTelAvisoEntradaGeocerca,
      })
      .subscribe({
        next: (result) => {},
        error: (err) => {
          if (err.status == 202) {
            this.spinerTelAvisoEntradaGeocerca = false;
            this.nuevoValueTelAvisoEntradaGeocerca = `${this.valueTelAvisoEntradaGeocerca}`;
            this.estadoPeticionTelAvisoEntradaGeocerca = 'Ok';
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha aplicado la configuración.'
            );
          } else {
            this.spinerTelAvisoEntradaGeocerca = false;
            this.estadoPeticionTelAvisoEntradaGeocerca = 'Fallido';
            this._notificationService.notificationError(
              'Error',
              'Error al realizar la configuración.'
            );
          }
        },
      })
    )
  }
  nuevoTelAvisoSalidaGeocerca() {
    this.spinerTelAvisoSalidaGeocerca = true;
    this.estadoPeticionTelAvisoSalidaGeocerca = '';
    this.suscriptions.push(
    this.configuracionBalizaService
      .aplicarTelAvisoSalidaGeocerca({
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
        telefAvisoSalGeoc: this.valueTelAvisoSalidaGeocerca,
      })
      .subscribe({
        next: (result) => {},
        error: (err) => {
          if (err.status == 202) {
            this.spinerTelAvisoSalidaGeocerca = false;
            this.nuevoValueTelAvisoSalidaGeocerca = `${this.valueTelAvisoSalidaGeocerca}`;
            this.estadoPeticionTelAvisoSalidaGeocerca = 'Ok';
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha aplicado la configuración.'
            );
          } else {
            this.spinerTelAvisoSalidaGeocerca = false;
            this.estadoPeticionTelAvisoSalidaGeocerca = 'Fallido';
            this._notificationService.notificationError(
              'Error',
              'Error al realizar la configuración.'
            );
          }
        },
      })
    )
  }
  nuevoTelAvisoCambioPais() {
    this.spinerTelAvisoCambioPais = true;
    this.estadoPeticionTelAvisoCambioPais = '';
    this.suscriptions.push(
    this.configuracionBalizaService
      .aplicarTelAvisoCambioPais({
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
        telefAvisoCambPais: this.valueTelAvisoCambioPais,
      })
      .subscribe({
        next: (result) => {},
        error: (err) => {
          if (err.status == 202) {
            this.spinerTelAvisoCambioPais = false;
            this.nuevoValueTelAvisoCambioPais = `${this.valueTelAvisoCambioPais}`;
            this.estadoPeticionTelAvisoCambioPais = 'Ok';
            this._notificationService.notificationSuccess(
              'Información',
              'Se ha aplicado la configuración.'
            );
          } else {
            this.spinerTelAvisoCambioPais = false;
            this.estadoPeticionTelAvisoCambioPais = 'Fallido';
            this._notificationService.notificationError(
              'Error',
              'Error al realizar la configuración.'
            );
          }
        },
      })
    )
  }

  mensajeExito() {
    this._notificationService.notificationSuccess(
      'Información',
      'Se ha aplicado la configuración.'
    );
  }

  cargarDatosApi() {
    this.valueEmailAvisoCargaBateria = this.configWriteAlertasOperativas[0].DisplayValue == "Not initialized" ? null : this.configWriteAlertasOperativas[0].DisplayValue;
    this.nuevoValueEmailAvisoCargaBateria = this.configWriteAlertasOperativas[0].DisplayValue;

    this.valueEmailAvisoInicioMovimiento = this.configWriteAlertasOperativas[1].DisplayValue == "Not initialized" ? null : this.configWriteAlertasOperativas[1].DisplayValue;
    this.nuevoValueEmailAvisoInicioMovimiento = this.configWriteAlertasOperativas[1].DisplayValue;

    this.valueEmailAvisoFinMovimiento = this.configWriteAlertasOperativas[2].DisplayValue == "Not initialized" ? null : this.configWriteAlertasOperativas[2].DisplayValue;
    this.nuevoValueEmailAvisoFinMovimiento = this.configWriteAlertasOperativas[2].DisplayValue;

    this.valueEmailAvisoEntradaGeocerca = this.configWriteAlertasOperativas[3].DisplayValue == "Not initialized" ? null : this.configWriteAlertasOperativas[3].DisplayValue;
    this.nuevoValueEmailAvisoEntradaGeocerca = this.configWriteAlertasOperativas[3].DisplayValue;

    this.valueEmailAvisoSalidaGeocerca = this.configWriteAlertasOperativas[4].DisplayValue == "Not initialized" ? null : this.configWriteAlertasOperativas[4].DisplayValue;
    this.nuevoValueEmailAvisoSalidaGeocerca = this.configWriteAlertasOperativas[4].DisplayValue;

    this.valueEmailAvisoCambioPais = this.configWriteAlertasOperativas[5].DisplayValue == "Not initialized" ? null : this.configWriteAlertasOperativas[5].DisplayValue;
    this.nuevoValueEmailAvisoCambioPais = this.configWriteAlertasOperativas[5].DisplayValue;

    this.valueTelAvisoCargaBateria = this.configWriteAlertasOperativas[6].DisplayValue == "Not initialized" ? null : this.configWriteAlertasOperativas[6].DisplayValue;
    this.nuevoValueTelAvisoCargaBateria = this.configWriteAlertasOperativas[6].DisplayValue;

    this.valueTelAvisoInicioMovimiento = this.configWriteAlertasOperativas[7].DisplayValue == "Not initialized" ? null : this.configWriteAlertasOperativas[7].DisplayValue;
    this.nuevoValueTelAvisoInicioMovimiento = this.configWriteAlertasOperativas[7].DisplayValue;

    this.valueTelAvisoFinMovimiento = this.configWriteAlertasOperativas[8].DisplayValue == "Not initialized" ? null : this.configWriteAlertasOperativas[8].DisplayValue;
    this.nuevoValueTelAvisoFinMovimiento = this.configWriteAlertasOperativas[8].DisplayValue;

    this.valueTelAvisoEntradaGeocerca = this.configWriteAlertasOperativas[9].DisplayValue == "Not initialized" ? null : this.configWriteAlertasOperativas[9].DisplayValue;
    this.nuevoValueTelAvisoEntradaGeocerca = this.configWriteAlertasOperativas[9].DisplayValue;

    this.valueTelAvisoSalidaGeocerca = this.configWriteAlertasOperativas[10].DisplayValue == "Not initialized" ? null : this.configWriteAlertasOperativas[10].DisplayValue;
    this.nuevoValueTelAvisoSalidaGeocerca = this.configWriteAlertasOperativas[10].DisplayValue;

    this.valueTelAvisoCambioPais = this.configWriteAlertasOperativas[11].DisplayValue == "Not initialized" ? null : this.configWriteAlertasOperativas[11].DisplayValue;
    this.nuevoValueTelAvisoCambioPais = this.configWriteAlertasOperativas[11].DisplayValue;
  }
}
