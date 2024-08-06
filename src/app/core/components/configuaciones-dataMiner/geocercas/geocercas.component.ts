import { isNull } from '@angular/compiler/src/output/output_ast';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Baliza } from 'src/app/core/models/baliza.model';
import {
  Asignadas,
  EstadoPeticionRequestDto,
  Geocerca,
  NoAsignadas,
} from 'src/app/core/models/geocerca.model';
import { GeocercaService } from 'src/app/core/services/geocerca.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-geocercas',
  templateUrl: './geocercas.component.html',
  styleUrls: ['./geocercas.component.less'],
})
export class GeocercasComponent implements OnInit, OnChanges, OnDestroy {
  @Input() balizaSelected!: Baliza;
  @Input() isGeocercaSelected!: boolean;
  @Input() allowEdit!: boolean;

  geocerca!: Geocerca;
  asignadas!: Array<Asignadas>;
  noAsignadas!: Array<NoAsignadas>;

  loading = false;

  asignadasSize = 0;

  urlToReplace = '';

  isActiveInterval = false;

  estadoEnvio!: EstadoPeticionRequestDto;

  myInterval: any;

  suscriptions: Array<any> = [];

  constructor(
    private _geocercaService: GeocercaService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.myInterval) {
      clearInterval(this.myInterval);
    }
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  loadEstadoConfig(notify: boolean = false) {
    if (this.geocerca) {
      const url = `${environment.API_URL_GEOCERCA}/${this.geocerca.idElement}/${this.geocerca.idDataminer}/estado`;
      this.suscriptions.push(
        this._geocercaService.getEstadoEnvio(url).subscribe({
          next: (result) => {
            this.estadoEnvio = { ...result };
            if (this.estadoEnvio.displayValue == 'Envio Pendiente') {
              if (!this.myInterval) {
                this.setEstadoInterval();
              }
              this._notificationService.notificationInfo(
                'Información',
                'La Configuración de las Geocercas está pendiente en Dataminer.'
              );
            }
          },
          error: (e) => {
            this._notificationService.notificationInfo(
              'Información',
              'No se pudo obtener el estado del envío de las configuraciones.'
            );
          },
        })
      );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isGeocercaSelected']) {
      if (changes['isGeocercaSelected'].currentValue) {
        this.loadGeocerca();
        
      }
      if (!changes['isGeocercaSelected'].currentValue) {
        clearInterval(this.myInterval);
      }
    }
  }

  loadGeocerca() {
    this.loading = true;
    this.suscriptions.push(
      this._geocercaService.getGeocercasList(this.balizaSelected).subscribe({
        next: (result) => {
          this.loading = false;
          this.geocerca = result;
          this.urlToReplace = this.geocerca.getSelfLinkHref();
          this.asignadas = [...this.geocerca.asignadas];
          this.noAsignadas = [...this.geocerca.noAsignadas];
          this.asignadasSize = 0;
          this.geocerca.asignadas.forEach((asignada) => {
            if (asignada.name != 'NA') {
              this.asignadasSize++;
            }
          });
          if (!this.estadoEnvio) {
            this.loadEstadoConfig();
          }
        },
        error: (e) => {
          this.loading = false;
          this._notificationService.notificationError(
            'Error',
            'No se ha podido obtener la información de las Geocercas.'
          );
        },
      })
    );
  }

  setEstadoInterval() {
    const url = `${environment.API_URL_GEOCERCA}/${this.geocerca.idElement}/${this.geocerca.idDataminer}/estado`;
    this.myInterval = setInterval(() => {
      this.suscriptions.push(
        this._geocercaService.getEstadoEnvio(url).subscribe((result) => {
          this.estadoEnvio = { ...result };
          if (result.displayValue == 'OK') {
            clearInterval(this.myInterval);
            this.myInterval = null;
            this.loadGeocerca();
          }
        })
      );
    }, 10000);
  }

  onChange(event: boolean) {
    if (
      this.estadoEnvio &&
      this.estadoEnvio.displayValue == 'Envio Pendiente' &&
      !this.myInterval
    ) {
      this.setEstadoInterval();
    }
    if (!this.myInterval) {
      this.loadEstadoConfig();
      this.loadGeocerca();
    }
  }
}
