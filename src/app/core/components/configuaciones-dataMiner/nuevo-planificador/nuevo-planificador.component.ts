import { NzMessageModule } from 'ng-zorro-antd/message';
import { forkJoin } from 'rxjs';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Baliza } from 'src/app/core/models/baliza.model';
import { configDataMimerPanificador } from 'src/app/core/models/interfaces';
import { ConfigBalizaAPIService } from 'src/app/core/services/config-baliza-api.service';
import { ConfiguracionBalizaService } from 'src/app/core/services/configuracion-baliza.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-nuevo-planificador',
  templateUrl: './nuevo-planificador.component.html',
  styleUrls: ['./nuevo-planificador.component.less']
})
export class NuevoPlanificadorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() balizaSelected!: Baliza;
  @Output() loadingPlanificador = new EventEmitter<any>();
  @Input() isPNewlanificadorSelected!: boolean;
  @Output() loadingGeneral = new EventEmitter<any>();

  myInterval : any;
  suscriptions: Array<any> = [];

  estadoEnviarNuevoPlanificador: boolean = true;

  color!: string;
  textoConfig!: string;
  selectConfig: boolean = false;
  configSelecionada: any = null;
  enableSendConfig: boolean = true;
  celdaMarcadaInicial: any = null;
  celdaMarcadaFinal: any = null;
  numeroConfiguracionSeleccionada: any;
  estadoPeticionNuevoPlanificador = 'error al cargar';
  spinerAplicarNuevoPlanificador: boolean = false;
  configSelecionadaId: any = null;

  configReadInstalacion: Array<any> = [];
  configWriteInstalacion: Array<any> = [];
  arrayConfig!: configDataMimerPanificador[];

  identificador: any [] = [
    ['E-10102-00-01', 'E-10103-00-01', 'E-10104-00-01', 'E-10105-00-01', 'E-10106-00-01', 'E-10107-00-01', 'E-10108-00-01', 'E-10109-00-01'],
    ['E-10102-01-02', 'E-10103-01-02', 'E-10104-01-02', 'E-10105-01-02', 'E-10106-01-02', 'E-10107-01-02', 'E-10108-01-02', 'E-10109-01-02'],
    ['E-10102-02-03', 'E-10103-02-03', 'E-10104-02-03', 'E-10105-02-03', 'E-10106-02-03', 'E-10107-02-03', 'E-10108-02-03', 'E-10109-02-03'],
    ['E-10102-03-04', 'E-10103-03-04', 'E-10104-03-04', 'E-10105-03-04', 'E-10106-03-04', 'E-10107-03-04', 'E-10108-03-04', 'E-10109-03-04'],
    ['E-10102-04-05', 'E-10103-04-05', 'E-10104-04-05', 'E-10105-04-05', 'E-10106-04-05', 'E-10107-04-05', 'E-10108-04-05', 'E-10109-04-05'],
    ['E-10102-05-06', 'E-10103-05-06', 'E-10104-05-06', 'E-10105-05-06', 'E-10106-05-06', 'E-10107-05-06', 'E-10108-05-06', 'E-10109-05-06'],
    ['E-10102-06-07', 'E-10103-06-07', 'E-10104-06-07', 'E-10105-06-07', 'E-10106-06-07', 'E-10107-06-07', 'E-10108-06-07', 'E-10109-06-07'],
    ['E-10102-07-08', 'E-10103-07-08', 'E-10104-07-08', 'E-10105-07-08', 'E-10106-07-08', 'E-10107-07-08', 'E-10108-07-08', 'E-10109-07-08'],
    ['E-10102-08-09', 'E-10103-08-09', 'E-10104-08-09', 'E-10105-08-09', 'E-10106-08-09', 'E-10107-08-09', 'E-10108-08-09', 'E-10109-08-09'],
    ['E-10102-09-10', 'E-10103-09-10', 'E-10104-09-10', 'E-10105-09-10', 'E-10106-09-10', 'E-10107-09-10', 'E-10108-09-10', 'E-10109-09-10'],
    ['E-10102-10-11', 'E-10103-10-11', 'E-10104-10-11', 'E-10105-10-11', 'E-10106-10-11', 'E-10107-10-11', 'E-10108-10-11', 'E-10109-10-11'],
    ['E-10102-11-12', 'E-10103-11-12', 'E-10104-11-12', 'E-10105-11-12', 'E-10106-11-12', 'E-10107-11-12', 'E-10108-11-12', 'E-10109-11-12'],
    ['E-10102-12-13', 'E-10103-12-13', 'E-10104-12-13', 'E-10105-12-13', 'E-10106-12-13', 'E-10107-12-13', 'E-10108-12-13', 'E-10109-12-13'],
    ['E-10102-13-14', 'E-10103-13-14', 'E-10104-13-14', 'E-10105-13-14', 'E-10106-13-14', 'E-10107-13-14', 'E-10108-13-14', 'E-10109-13-14'],
    ['E-10102-14-15', 'E-10103-14-15', 'E-10104-14-15', 'E-10105-14-15', 'E-10106-14-15', 'E-10107-14-15', 'E-10108-14-15', 'E-10109-14-15'],
    ['E-10102-15-16', 'E-10103-15-16', 'E-10104-15-16', 'E-10105-15-16', 'E-10106-15-16', 'E-10107-15-16', 'E-10108-15-16', 'E-10109-15-16'],
    ['E-10102-16-17', 'E-10103-16-17', 'E-10104-16-17', 'E-10105-16-17', 'E-10106-16-17', 'E-10107-16-17', 'E-10108-16-17', 'E-10109-16-17'],
    ['E-10102-17-18', 'E-10103-17-18', 'E-10104-17-18', 'E-10105-17-18', 'E-10106-17-18', 'E-10107-17-18', 'E-10108-17-18', 'E-10109-17-18'],
    ['E-10102-18-19', 'E-10103-18-19', 'E-10104-18-19', 'E-10105-18-19', 'E-10106-18-19', 'E-10107-18-19', 'E-10108-18-19', 'E-10109-18-19'],
    ['E-10102-19-20', 'E-10103-19-20', 'E-10104-19-20', 'E-10105-19-20', 'E-10106-19-20', 'E-10107-19-20', 'E-10108-19-20', 'E-10109-19-20'],
    ['E-10102-20-21', 'E-10103-20-21', 'E-10104-20-21', 'E-10105-20-21', 'E-10106-20-21', 'E-10107-20-21', 'E-10108-20-21', 'E-10109-20-21'],
    ['E-10102-21-22', 'E-10103-21-22', 'E-10104-21-22', 'E-10105-21-22', 'E-10106-21-22', 'E-10107-21-22', 'E-10108-21-22', 'E-10109-21-22'],
    ['E-10102-22-23', 'E-10103-22-23', 'E-10104-22-23', 'E-10105-22-23', 'E-10106-22-23', 'E-10107-22-23', 'E-10108-22-23', 'E-10109-22-23'],
    ['E-10102-23-24', 'E-10103-23-24', 'E-10104-23-24', 'E-10105-23-24', 'E-10106-23-24', 'E-10107-23-24', 'E-10108-23-24', 'E-10109-23-24'],
  ];
  dias: any []= [ '10103', '10104', '10105', '10106', '10107', '10108', '10109' ];
  horas: any []= [ '00-01', '01-02', '02-03', '03-04', '04-05', '05-06', '06-07', '07-08', 
                  '08-09', '09-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16',
                  '16-17', '17-18', '18-19', '19-20', '20-21', '21-22', '22-23', '23-24' ];
  celdasConfig: any [] = [];
  
  constructor(
    private _notificationService: NotificationService,
    private _configBalizaAPIService: ConfigBalizaAPIService,
    private configuracionBalizaService: ConfiguracionBalizaService,

  ) { }

  ngOnDestroy(): void {
    if (this.myInterval) {
      clearInterval(this.myInterval);
    } 
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnInit(): void {
    // this._configBalizaAPIService.selectedItem9$.subscribe((value) => {
    //   this.arrayConfig = value;
    //   if(value){
    //     this.obtenerEstadoPeticionAplicarPlanificacion()
    //   }
    // });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isPNewlanificadorSelected']) {
      if (changes['isPNewlanificadorSelected'].currentValue) {
        this.myInterval = setInterval(() => {
            this.getConfigBalizaAvanzada()
        }, 20000);
        this.obtenerEstadoPeticionAplicarPlanificacion();
        this.getConfigBalizaAvanzada(true);
      }
      if (!changes['isPNewlanificadorSelected'].currentValue) {
        clearInterval(this.myInterval);
        this.configSelecionadaId ? this.configSelecionadaId.style.border = '1px solid black' : null;
        this.selectConfig = false;
        this.suscriptions.forEach((s) => s.unsubscribe());
      }
    }
  }

  clear(){
    
  }

  marcar(id: string): void{   
    const celdaSeleccionada: any = document.querySelector(`#${id}`);
    celdaSeleccionada.style.background = this.color;
    celdaSeleccionada.innerHTML = this.textoConfig;
    this.enableSendConfig = false;
  }

  seleccionarConfiguracion(event: any, valor: string){  
    this.selectConfig = true;
    this.configSelecionada ? this.desmarcarConfiguracionSeleccionada(this.configSelecionada) : null;   
    let id = event.srcElement.attributes.id.nodeValue;
    this.configSelecionada = id;    

    this.textoConfig = id;
    //el datamainer trabaja con valores Hexadecimales 
    this.numeroConfiguracionSeleccionada = valor;
    // this.numeroConfiguracionSeleccionada = parseInt(valor).toString(16); 

    switch (id) {
      //verde1
      case "OnG" :
      case "OnU" :
      case "OnA" :
        this.color = 'greenyellow';
        break;
 
      //verde2
      case "VoxOffG" :
      case "VoxOffU" :
      case "VoxOffA" :
        this.color = 'limegreen';
        break;

      //azul
      case "DataOnG" :
      case "DataOnU" :
      case "DataOnA" :
        this.color = 'mediumblue';
        break;

      //morado1
      case "NoConG" :
      case "NoConU" :
      case "NoConA" :
        this.color = 'violet';
        break;

      //morado2
      case "DataConG" :
      case "DataConU" :
      case "DataConA" :
        this.color = 'darkviolet';
        break;

      //anaranjado
      case "ModemOff" :
        this.color = 'darkorange';
        break;

      //rojo
      case "DispositivoOff" :
        this.color = 'red';
        break;

      default:
        break;
    }
    this.marcarConfiguracionSeleccionada(id);

  }

  marcarConfiguracionSeleccionada(id: string): void{
    const celdaSeleccionada: any = document.querySelector(`#${id}`);
    this.configSelecionadaId = document.querySelector(`#${id}`)
    celdaSeleccionada.style.border = '5px solid yellow';    
  }

  desmarcarConfiguracionSeleccionada(id: string): void{
    const celdaSeleccionada: any = document.querySelector(`#${id}`);    
    celdaSeleccionada.style.border = '1px solid black';
  }

  aplicarConfiguracionPlanificador(){
    this.loadingPlanificador.emit(true);
    this.suscriptions.push(
    this.configuracionBalizaService
    .aplicarConfiguracionPlanificador({
      idDataminer: this.balizaSelected?.idDataminer,
      idElement: this.balizaSelected?.idElement,
    })
    .subscribe({
      next: (result) => {     
      },
      error: (error) => {
        if(error.status == 202){
          this.loadingPlanificador.emit(false);
            this._notificationService.notificationSuccess(
              'Confirmación',
              'Se ha aplicado la configuración.'
            );
            this.enableSendConfig = true;
          setTimeout(() => {          
            this.obtenerEstadoPeticionAplicarPlanificacion(true);
          }, 2000);
        }else{
          this.loadingPlanificador.emit(false);
          this._notificationService.notificationError(
            'Error',
            error.error.text
          );
        }
      },
    })
    )
  }

  colorCelda(value: string) {
    let color: string;
    
    switch (value) {
      case '00':
      case '01':
      case '02':
        color = 'greenyellow';
        break;

      case '06':
      case '07':
      case '08':
        color = 'limegreen';
        break;

      // case '11':
      case '15':
      // case '21':
      case '0B':
      case '0F':
        color = 'mediumblue';
        break;

      case '13':
      case '18':
      // case '23':
      case '0E':
        color = 'darkviolet';
        break;

      case '17':
      case '12':
      case '0D':
        color = 'violet';
        break;

      case '09':
        color = 'darkorange';
        break;

      case '0A':
        color = 'red';
        break;

      default:
        color = 'gris';
        break;
    }
    return color;
  }

  mauseDownCelda(event : any){
    this.celdaMarcadaInicial = event.srcElement.attributes.id.nodeValue;
  }
  
  mouseUpCelda(event : any){
    if(this.selectConfig){
      this.celdaMarcadaFinal = event.srcElement.attributes.id.nodeValue;
      let celdaInicial = this.celdaMarcadaFinal.split('-')[1];
      let celdaFinal = this.celdaMarcadaInicial.split('-')[1]; 
      
       if (celdaInicial == '10102' && celdaFinal == '10102') {
         this.selectMultiFila();
       }else if((this.dias.indexOf(this.celdaMarcadaInicial) + 1) && (this.dias.indexOf(this.celdaMarcadaFinal) + 1)){
        this.selectMultiCol();
       }else if(celdaInicial != '10102' && celdaFinal != '10102'){
         this.selectMultiCelda();
       }
       else{
         this._notificationService.notificationWarning('Advertencia', 'Selección incorrecta');
       }
      }else{
        this._notificationService.notificationInfo(
          'Información',
          'Seleccione una configuración.'
        );
      }
  }

  selectMultiCelda(){            
      this.loadingPlanificador.emit(true);

      let xCeldaInicial = this.celdaMarcadaInicial.split('-')[1];
      let yCeldaInicial = (this.celdaMarcadaInicial.split('-')[2]);
      let xCeldaFinal = this.celdaMarcadaFinal.split('-')[1];
      let yCeldaFinal = (this.celdaMarcadaFinal.split('-')[2]);

      let xCordenadaInicialNumber = this.dias.indexOf(xCeldaInicial) + 1;
      let xCordenadaFinalNumber = this.dias.indexOf(xCeldaFinal) + 1;
      let yCordenadaInicialNumber = Number(yCeldaInicial.split('-')[0]);
      let yCordenadaFinalNumber = Number(yCeldaFinal.split('-')[0]);
      
      let xCordenaInicial = xCordenadaInicialNumber < xCordenadaFinalNumber ? xCordenadaInicialNumber : xCordenadaFinalNumber;
      let xCordenadaFinal = xCordenadaInicialNumber > xCordenadaFinalNumber ? xCordenadaInicialNumber : xCordenadaFinalNumber;
      let yCordenadaInicial = yCordenadaInicialNumber < yCordenadaFinalNumber ? yCordenadaInicialNumber : yCordenadaFinalNumber;
      let yCordenadaFinal = yCordenadaInicialNumber > yCordenadaFinalNumber ? yCordenadaInicialNumber : yCordenadaFinalNumber;

      for (let indexY = yCordenadaInicial; indexY <= yCordenadaFinal; indexY++) {
        for (let indexX = xCordenaInicial; indexX <= xCordenadaFinal; indexX++) {
          // this.marcar(this.identificador[indexY][indexX]);
          this.llenarArrayNuevasConfig(this.dias[indexX - 1], this.horas[indexY])
        }        
      }

      this.aplicarConfiguracionPlanificadorCelda(this.celdasConfig);
      this.celdaMarcadaInicial = null;
      this.celdaMarcadaFinal = null;
  }

  selectMultiFila(){
    this.loadingPlanificador.emit(true);

    let filaInicial = Number(this.celdaMarcadaInicial.split('-')[2]);
    let filaFinal = Number(this.celdaMarcadaFinal.split('-')[2]);

    let inicio = filaInicial < filaFinal ? filaInicial : filaFinal;
    let fin = filaInicial > filaFinal ? filaInicial : filaFinal;

    for (let index = inicio; index <= fin; index++) {
      this.identificador[index].forEach((celda: string, aux: number) => {
        if(aux){
          this.llenarArrayNuevasConfig(Number(this.dias[aux - 1]), this.horas[index]);
        }
      });      
    }
    
    this.celdaMarcadaInicial = null;
    this.celdaMarcadaFinal = null;
    this.aplicarConfiguracionPlanificadorCelda(this.celdasConfig);
  }

  selectMultiCol(){
    this.loadingPlanificador.emit(true);

    let colInicial = this.dias.indexOf(this.celdaMarcadaInicial);
    let colFinal = this.dias.indexOf(this.celdaMarcadaFinal);

    let inicio = colInicial < colFinal ? colInicial : colFinal;
    let fin = colInicial > colFinal ? colInicial : colFinal;

    for (let indexY = 0; indexY <= 23; indexY++) {
      for (let indexX = inicio; indexX <= fin; indexX++) {
        this.llenarArrayNuevasConfig(Number(this.dias[indexX]), this.horas[indexY]);
      }   
    }

    this.celdaMarcadaInicial = null;
    this.celdaMarcadaFinal = null;
    this.aplicarConfiguracionPlanificadorCelda(this.celdasConfig);
  }

  marcarTodo(){
    if(this.selectConfig){
      this.celdaMarcadaInicial = "E-10103-00-01";
      this.celdaMarcadaFinal = "E-10109-23-24";
      this.selectMultiCelda();
    }else{
      this._notificationService.notificationInfo(
        'Información',
        'Seleccione una configuración.'
      );
    }
  }

  aplicarConfiguracionPlanificadorCelda(celdaCOnfig: any){       
    this.suscriptions.push( 
    this.configuracionBalizaService
      .nuevaConfiguracionPlanificadorCelda(
        celdaCOnfig
      )
      .subscribe({
        next: (result) => {        
        },
        error: (error) => {
          if(error.status == 202){
            this.loadingPlanificador.emit(false);
            //si no da error marca las filas
            celdaCOnfig.forEach((element: { parameterID: number; tableIndex: string; }) => {
              let x = this.dias.indexOf(String(element.parameterID)) + 1;
              let y = this.horas.indexOf(element.tableIndex);
              this.marcar(this.identificador[y][x]);
            });
            this.celdasConfig = [];
            //mensaje confimacion
            // this._notificationService.notificationSuccess(
            //   'Confirmación',
            //   'Se ha enviado la configuración.'
            // );
          }else{
            this.celdasConfig = [];
            this.loadingPlanificador.emit(false);
            this._notificationService.notificationError(
              'Error',
              error.error.text
            );
          }
        },
      })
    )
  }

  llenarArrayNuevasConfig(parameterID: number, tableIndex: string){
    this.celdasConfig.push(
      {
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
        parameterID: parameterID,
        tableIndex: tableIndex,
        parameterValue: this.numeroConfiguracionSeleccionada,
      }
    );
  }
  
  obtenerEstadoPeticionAplicarPlanificacion(msg?: boolean) {
    this.suscriptions.push(
    this.configuracionBalizaService
      .obtenerEstadoEnvioNuevoPlanificador({
        idDataminer: this.balizaSelected?.idDataminer,
        idElement: this.balizaSelected?.idElement,
      })
      .subscribe({
        next: (result) => {          
          if(result.d.Value == "1"){
            this.enableSendConfig = true;
          }else{
            this.enableSendConfig = false;
          };
          this.estadoPeticionNuevoPlanificador = result.d.DisplayValue;          
          this.spinerAplicarNuevoPlanificador = false;
          // msg ? this.mostrarMensaje(result.d) : null;
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

  mostrarMensaje(data: any) {
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

  getConfigBalizaAvanzada(emitir? : boolean) {
    emitir ? this.loadingGeneral.emit(true) : null;
    this.suscriptions.push(
      this.configuracionBalizaService
      .getConfiguracionNuevoPlaniicador({
        idDataminer: this.balizaSelected.idDataminer,
        idElement: this.balizaSelected.idElement,
      })
      .subscribe({
        next: (result) => {
          this.arrayConfig = result.d;     
          emitir ? this.loadingGeneral.emit(false) : null;     
        },
        error: (err) => {
          emitir ? this.loadingGeneral.emit(false) : null;     
        },
      })
    )
  }
  
  titulo(id: number){
    return (id == 10102) ? "Seleccionar fila" : "Seleccionar celda"
  }
}
