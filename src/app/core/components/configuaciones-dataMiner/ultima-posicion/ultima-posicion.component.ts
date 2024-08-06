import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Baliza } from 'src/app/core/models/baliza.model';
import { configDataMimerInterfece } from 'src/app/core/models/interfaces';
import { ConfigBalizaAPIService } from 'src/app/core/services/config-baliza-api.service';
import { ConfiguracionBalizaService } from 'src/app/core/services/configuracion-baliza.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-ultima-posicion',
  templateUrl: './ultima-posicion.component.html',
  styleUrls: ['./ultima-posicion.component.less'],
})
export class UltimaPosicionComponent implements OnInit, OnChanges, OnDestroy {
  @Input() balizaSelected!: Baliza;
  @Input() allowEdit: boolean = false;
  @Input() dataApi!: any;
  @Input() isLastPositionSelected!: boolean;
  @Output() loadingGeneral = new EventEmitter<any>();


  arrayConfig1!: configDataMimerInterfece[];
  arrayConfig2!: configDataMimerInterfece[];

  myInterval : any;
  suscriptions: Array<any> = [];

  constructor(private _configBalizaAPIService: ConfigBalizaAPIService,
    private configuracionBalizaService: ConfiguracionBalizaService,
    private _notificationService: NotificationService,
    ) {}

  ngOnDestroy(): void {
    if (this.myInterval) {
      clearInterval(this.myInterval);
    }
    this.suscriptions.forEach((s) => s.unsubscribe());
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['isLastPositionSelected']) {
      if (changes['isLastPositionSelected'].currentValue) {
        this.myInterval = setInterval(() => {
            this.getConfigBalizaUltimaPosicion()
        }, 20000);
        this.getConfigBalizaUltimaPosicion(true);
      }
      if (!changes['isLastPositionSelected'].currentValue) {
        clearInterval(this.myInterval);
      }
    }
  }

  ngOnInit(): void {
    // this._configBalizaAPIService.selectedItem2$.subscribe((value) => {
    //   if(value){
    //     this.arrayConfig1 = value.slice(0, 16);
    //     this.arrayConfig1 = this.arrayConfig1.filter( element => element.ParameterName != 'pagebutton')
    //     this.arrayConfig2 = value.slice(16, 33);
    //   }
    // });
  }

  getConfigBalizaUltimaPosicion(emitir? :boolean) {
    emitir ? this.loadingGeneral.emit(true) : null;
    this.suscriptions.push(
      this.configuracionBalizaService
      .getConfiguracionBalizaUtimaPosicion({
        idDataminer: this.balizaSelected.idDataminer,
        idElement: this.balizaSelected.idElement,
      })
      .subscribe({
        next: (result) => {
          let value = result.body.d;
          this.arrayConfig1 = value.slice(0, 15);
          this.arrayConfig1 = this.arrayConfig1.filter( element => element.ParameterName != 'pagebutton')
          this.arrayConfig2 = value.slice(15, 33);
          emitir ? this.loadingGeneral.emit(false) : null;
        },
        error: (err) => {
          emitir ? this.loadingGeneral.emit(false) : null;
          this._notificationService.notificationError(
            'Información',
            'No se ha cargado la configuración.'
          );        
        },
      })
    )
  }
}
