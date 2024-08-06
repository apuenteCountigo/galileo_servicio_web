import { ConfigBalizaAPIService } from 'src/app/core/services/config-baliza-api.service';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { NotificationService } from 'src/app/core/services/notification.service';
import {
  configDataMimerInterfece,
  configDataMimerPanificador,
} from 'src/app/core/models/interfaces';
import { ConfiguracionBalizaService } from 'src/app/core/services/configuracion-baliza.service';
import { Baliza } from 'src/app/core/models/baliza.model';

@Component({
  selector: 'app-planificador',
  templateUrl: './planificador.component.html',
  styleUrls: ['./planificador.component.less'],
})
export class PlanificadorComponent implements OnInit,  OnChanges, OnDestroy {
  @Output() nuevoPlanificador = new EventEmitter<any>();
  @Input() dataApi!: any;
  @Input() allowEdit: boolean = false;
  @Input() balizaSelected!: Baliza;
  @Input() isPlanificadorSelected!: boolean;
  @Output() loadingGeneral = new EventEmitter<any>();

  color!: string;
  textoConfig!: string;
  selectConfig: boolean = false;
  configSelecionada: any = null;
  enableSendConfig: boolean = true;
  tablaConDatos: boolean = false;
  estadoPeticionPlanificador = 'error al cargar';

  myInterval : any;
  suscriptions: Array<any> = [];

  configReadInstalacion: Array<any> = [];
  configWriteInstalacion: Array<any> = [];
  arrayConfig!: configDataMimerPanificador[];
  //celda sin configuracion
  celda = {Value: 9, DisplayValue: ' '};

  identificador: any[] = [
    [{DisplayValue: '00-01'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '01-02'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '02-03'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '03-04'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '04-05'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '05-06'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '06-07'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '07-08'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '08-09'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '09-10'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '10-11'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '11-12'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '12-13'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '13-14'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '14-15'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '15-16'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '16-17'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '17-18'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '18-19'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '19-20'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '20-21'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '21-22'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '22-23'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
    [{DisplayValue: '23-24'}, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, this.celda, ],
  ];

  constructor(
    private _notificationService: NotificationService,
    private _configBalizaAPIService: ConfigBalizaAPIService,
    private configuracionBalizaService: ConfiguracionBalizaService,
  ) {}

  ngOnInit(): void {
    // this._configBalizaAPIService.selectedItem8$.subscribe((value) => {           
    //   if(value){
    //     this.obtenerEstadoPeticionAplicarPlanificacion();
    //     if(value.length){
    //       this.arrayConfig = value;
    //       this.tablaConDatos = true;
    //     }else{
    //       this.arrayConfig = this.identificador;
    //       this.tablaConDatos = false;
    //     }
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
    if (changes['isPlanificadorSelected']) {
      if (changes['isPlanificadorSelected'].currentValue) {
        this.myInterval = setInterval(() => {
            this.getConfigPlanificador()
        }, 20000);
        this.obtenerEstadoPeticionAplicarPlanificacion();
        this.getConfigPlanificador(true);
      }
      if (!changes['isPlanificadorSelected'].currentValue) {
        clearInterval(this.myInterval);
      }
    }
  }

  getConfigPlanificador(emitir? : boolean) {
    emitir ? this.loadingGeneral.emit(true) : null;
    this.suscriptions.push(
      this.configuracionBalizaService
      .getConfiguracionPlaniicador({
        idDataminer: this.balizaSelected.idDataminer,
        idElement: this.balizaSelected.idElement,
      })
      .subscribe({
        next: (result) => {
          let value = result.d;
          this.arrayConfig = value;
          this.tablaConDatos = value.length ? true : false;                    
          emitir ? this.loadingGeneral.emit(false) : null;
        },
        error: (err) => {
          emitir ? this.loadingGeneral.emit(false) : null;
        },
      })
    )
  }

  enableTabNewPlan(): void {
    this.nuevoPlanificador.emit(false);
  }

  colorCelda(value: string) {
    let color: string;
    let valueNumber = Number(value);
    
    switch (valueNumber) {
      
      case 0:
      case 1:
      case 2:
        color = 'greenyellow';
        break;

      case 6:
      case 7:
      case 8:
        color = 'limegreen';
        break;

      case 11:
      case 15:
      case 21:
        color = 'mediumblue';
        break;

      case 13:
      case 18:
      case 23:
        color = 'violet';
        break;

      case 14:
      case 19:
      case 24:
        color = 'darkviolet';
        break;

      case 9:
        color = 'darkorange';
        break;

      case 10:
        color = 'red';
        break;

      default:
        color = 'gris';
        break;
    }
    return color;
  }

  obtenerEstadoPeticionAplicarPlanificacion() {
    this.suscriptions.push(
    this.configuracionBalizaService
      .obtenerEstadoEnvioNuevoPlanificador({
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
      })
      .subscribe({
        next: (result) => {
          this.estadoPeticionPlanificador = result.d.DisplayValue;          
        },
        error: (err) => {
          // this._notificationService.notificationError(
          //   'Error',
          //   err.error.message
          // );
        },
      })
    )
  }

}
