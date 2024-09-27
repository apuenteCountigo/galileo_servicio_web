import { Component, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Baliza } from 'src/app/core/models/baliza.model';
import { EstadosBalizaDataminer } from '../../enums/estados.enum';
import { LoggedUserRole } from '../../enums/user-role.enum';
import {
  GeocercaDataminer,
  GeocercaTraccar,
} from '../../models/geocercas.model';
import { LoggedUser } from '../../models/interfaces';
import { Objetivo } from '../../models/objetivo.modal';
import { BreadCrumbService } from '../../services/bread-crumb.service';
import { ConfiguracionBalizaService } from '../../services/configuracion-baliza.service';
import { LoggedUserService } from '../../services/logged-user.service';
import { NotificationService } from '../../services/notification.service';
import { ObjetivosService } from '../../services/objetivos.service';
import { PermisosService } from '../../services/permisos.service';
import { TraccarService } from '../../services/traccar.service';
import { TableBase } from '../../utils/table.base';
import { ConfigBalizaAPIService } from './../../services/config-baliza-api.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.less'],
})
export class WelcomeComponent extends TableBase implements OnInit, OnDestroy {
  menuTopLeftPosition: any;
  dropdown: any;
  traccarUrl: any;
  urlSafe!: SafeResourceUrl;
  loggedUser!: LoggedUser;
  selectedIndex = 0;
  urlUnSanitized!: string;
  tabs = [
    'Mapa',
    'Información',
    'Configuración 1',
    'Configuración 2',
    'Configuración 3',
  ];
  disableConfigAvanzada: boolean = true;
  disableConfigInstalacion: boolean = true;
  disableConfigUltimaPosicion: boolean = true;
  disableConfigGps: boolean = true;
  disableConfigAntiBarrido: boolean = true;
  disableConfigAlertaOperativa: boolean = true;
  disableConfig: boolean = true;
  disableNuevoPlanificador: boolean = true;
  cargaCompleta: number = 0;
  cargaCompletaIncompleta: boolean = true;

  balizaSelected!: Baliza;
  dataApi!: any;

  respuestaApi: any;
  override loading: boolean = false;

  allowEdit = false;

  searchCriteria = {
    idUsuario: this._loggedUserService.getLoggedUser().id,
    clave: '',
    nombreUnidad: '',
    nombreOperacion: '',
    nombreObjetivo: '',
  };

  geocercaTraccarList: Array<GeocercaTraccar> = new Array();
  geocercaDataminerList: Array<GeocercaDataminer> = new Array();

  isGeocercaSelected = false;
  isLastPositionSelected = false;
  isAvanzadaSelected = false;
  isInstallSelected = false;
  isConfigGpsSelected = false;
  isConfigAntiBarridoSelected = false;
  isAlertaOperativaSelected = false;
  isPlanificadorSelected = false;
  isPNewlanificadorSelected = false;

  constructor(
    private traccarService: TraccarService,
    public sanitizer: DomSanitizer,
    private _loggedUser: LoggedUserService,
    private _breadrumbService: BreadCrumbService,
    private configuracionBalizaService: ConfiguracionBalizaService,
    private _notificationService: NotificationService,
    private _configBalizaAPIService: ConfigBalizaAPIService,
    private _permisoService: PermisosService,
    private _loggedUserService: LoggedUserService,
    private _objetivoService: ObjetivosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadTraccarUrl();
    this.updateBreadCrumb('mapa');
  }

  ngOnDestroy(): void {
    this._breadrumbService.setEstado(EstadosBalizaDataminer.SIN_INICIAR);
  }

  loadTraccarUrl() {
    this.traccarService
      .getMapa(localStorage.getItem('auth_token') as string)
      .subscribe((result: string) => {
        // Si el cliente accidentalmente escribió "http://https://", reemplazar por "https://"
        // result = result.replace('http://https://', 'https://');
        // Solo reemplazar ":/" después del dominio/IP, sin tocar el "http://" o "https://"
        // result = result.replace(/(https?:\/\/[^\/]+):\//, '$1/');
        // console.warn("result: "+result);
        
        result = result.slice(1, result.length - 1);
        const cad2 = `${result.split('=')[0]}=${
          this._loggedUser.getLoggedUser().traccar
        }`;
        this.urlUnSanitized = cad2;
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(cad2);
      });
  }

  updateBreadCrumb(valor: any, seleccionado?: any) {
    this.disableNuevoPlanificador = true;
    this._breadrumbService.updateBreadCrumb.emit({
      valor: valor,
      seleccionado: seleccionado,
    });
    if (valor == 'configAvanzada') {
      // // this.loading = true;
      // this.dataApi = this.getConfigBalizaAvanzada();
    }
    if (valor == 'instalacion') {
      // this.loading = true;
      // this.dataApi = this.getConfigInstalacion();
    }
    if (valor == 'ultimaPosicion') {
      // this.loading = true;
      // this.dataApi = this.getConfigBalizaUltimaPosicion();
    }
    if (valor == 'configGPS') {
      // this.loading = true;
      // this.dataApi = this.getConfigBalizaGPS();
    }
    if (valor == 'configAntiBarridoa') {
      // this.loading = true;
      // this.dataApi = this.getConfigAntiBarridos();
    }
    if (valor == 'alertasOperativo') {
      // this.loading = true;
      // this.dataApi = this.getConfigAlertasOperativa();
    }
    if (valor == 'planificador') {
      // this.loading = true;
      // this.dataApi = this.getConfigPlanificador();
    }
    if (valor == 'nuevoPlanificador') {
      // this.loading = true;
      // this.dataApi = this.getConfigNuevoPlanificador();
    }
    if (valor == 'informacion') {
      this.loading = true;
      this.dataApi = this.getDispositivos();
    }
  }

  goTraccar(): void {
    this.traccarUrl = this.sanitizer.sanitize(
      SecurityContext.RESOURCE_URL,
      this.urlSafe
    );
    window.open(this.traccarUrl, '_blank');
  }

  selectBaliza(dispositivo: any) {
    this.balizaSelected = dispositivo ? dispositivo.balizas : null;
    if (this.balizaSelected) {
      this.setPermisos(dispositivo);
      //this.peticiones();
      //this.loading = true;
      this.cargaCompletaIncompleta = true;
      this.disableConfig = false;
      this.disableNuevoPlanificador = true;
      // setTimeout(() => {
      //   if(this.loading){
      //     this.loading = false;
      //     this._notificationService.notificationError(
      //       'Error',
      //       'Error al cargar la configuración. Tiempo límite'
      //     );
      //   }
      // }, 60000);;
      this.cargaCompleta = 0;
    } else {
      this.deshabilitarConfiguracion();
      this.loading = false;
    }
  }
  nuevoPlanificador(value: any) {
    this.disableNuevoPlanificador = value;
    this.selectedIndex = 10;
    this.updateBreadCrumb('nuevoPlanificador');
  }

  loadingPlanificador(value: any) {
    this.loading = value;
  }

  loadingGeneral(value: any) {
    this.loading = value;
  }

  setPermisos(dispositivo: Objetivo) {
    const loggedUser = this._loggedUser.getLoggedUser();
    if (
      loggedUser.perfil.descripcion == LoggedUserRole.SUPER_ADMIN ||
      loggedUser.perfil.descripcion == LoggedUserRole.UNIT_ADMIN
    ) {
      this.allowEdit = false;
    } else {
      const filter = {
        idUsuario: this._loggedUser.getLoggedUser().id,
        idObjetivo: dispositivo.id,
      };
      this._permisoService
        .searchPermisosAsignadosUsuario(filter)
        .subscribe((result) => {
          if (result) {
            this.allowEdit = result.permisos == 'l' ? true : false;
          }
        });
    }

    // if (
    //   loggedUser.perfil.descripcion == LoggedUserRole.SUPER_ADMIN ||
    //   loggedUser.perfil.descripcion == LoggedUserRole.UNIT_ADMIN
    // ) {
    //   this.allowEdit = true;
    // } else {
    //   const filter = {
    //     idUsuario: 0,
    //     idObjetivo: dispositivo.id,
    //   };

    //   this._permisoService
    //     .searchPermisosAsignadosUsuario(filter)
    //     .subscribe((result) => {
    //       if (result) {
    //         const permisos = result;
    //         this.allowEdit = permisos.permisos == Permisos.ESCRITURA;
    //       }
    //     });
    // }
  }

  // peticiones() {
  //   this.getConfigBalizaAvanzada();
  //   this.getConfigInstalacion();
  //   this.getConfigBalizaUltimaPosicion();
  //   this.getConfigBalizaGPS();
  //   this.getConfigAntiBarridos();
  //   this.getConfigAlertasOperativa();
  // }

  getDispositivos() {
    this.loading = true;
    this._objetivoService
      .searchDevices(this.searchCriteria, this.params)
      .subscribe({
        next: (result: { resources: any }) => {
          this.loading = false;
          this.respuestaApi = result.resources;
          this._configBalizaAPIService.setConfigDispositivos(this.respuestaApi);
        },
        error: (error: any) => {
          this.loading = false;
        },
      });
  }

  getConfigBalizaAvanzada() {
    this.configuracionBalizaService
      .getConfiguracionBalizaConfigLed({
        idDataminer: this.balizaSelected.idDataminer,
        idElement: this.balizaSelected.idElement,
      })
      .subscribe({
        next: (result) => {
          this.respuestaApi = result.body.d;
          this._configBalizaAPIService.setConfigBalizaAvanzada(
            this.respuestaApi
          );
          this.mostrarMensajeCargaCompleta();
          // this.cargaCompleta++;
          // this.mostrarMensajeCargaCompleta();
        },
        error: (err) => {
          this.cargaCompletaIncompleta = true;
          this.mostrarMensajeCargaIncompleta();
        },
      });
  }

  getConfigBalizaUltimaPosicion() {
    this.configuracionBalizaService
      .getConfiguracionBalizaUtimaPosicion({
        idDataminer: this.balizaSelected.idDataminer,
        idElement: this.balizaSelected.idElement,
      })
      .subscribe({
        next: (result) => {
          this.respuestaApi = result.body.d;
          this._configBalizaAPIService.setConfigBalizaUltimaPosicion(
            this.respuestaApi
          );
          this.mostrarMensajeCargaCompleta();
          // this.cargaCompleta++;
          // this.mostrarMensajeCargaCompleta();
        },
        error: (err) => {
          this.cargaCompletaIncompleta = true;
          this.mostrarMensajeCargaIncompleta();
        },
      });
  }

  getConfigBalizaGPS() {
    this.configuracionBalizaService
      .getConfiguracionBalizaGPS({
        idDataminer: this.balizaSelected.idDataminer,
        idElement: this.balizaSelected.idElement,
      })
      .subscribe({
        next: (result) => {
          this.respuestaApi = result.body.d;
          this._configBalizaAPIService.setConfigBalizaGPS(this.respuestaApi);
          this.loading = false;
          // this.cargaCompleta++;
          // this.mostrarMensajeCargaCompleta();
        },
        error: (err) => {
          this.mostrarMensajeCargaIncompleta();
        },
      });
  }

  getConfigAlertasOperativa() {
    this.configuracionBalizaService
      .getConfiguracionAlertasOperativa({
        idDataminer: this.balizaSelected.idDataminer,
        idElement: this.balizaSelected.idElement,
      })
      .subscribe({
        next: (result) => {
          this.respuestaApi = result.body.d;
          this._configBalizaAPIService.setConfigAlertaOperativa(
            this.respuestaApi
          );
          this.mostrarMensajeCargaCompleta();
          // this.cargaCompleta++;
          // this.mostrarMensajeCargaCompleta();
        },
        error: (err) => {
          this.cargaCompletaIncompleta = true;
          this.mostrarMensajeCargaIncompleta();
        },
      });
  }

  getConfigAntiBarridos() {
    this.configuracionBalizaService
      .getConfiguracionAntiBarridos({
        idDataminer: this.balizaSelected.idDataminer,
        idElement: this.balizaSelected.idElement,
      })
      .subscribe({
        next: (result) => {
          this.respuestaApi = result.body.d;
          this._configBalizaAPIService.setConfigAntiBarrido(this.respuestaApi);
          this.mostrarMensajeCargaCompleta();
          // this.cargaCompleta++;
          // this.mostrarMensajeCargaCompleta();
        },
        error: (err) => {
          this.cargaCompletaIncompleta = true;
          this.mostrarMensajeCargaIncompleta();
        },
      });
  }

  getConfigInstalacion() {
    this.configuracionBalizaService
      .getConfiguracionInstalacionBaliza({
        idDataminer: this.balizaSelected.idDataminer,
        idElement: this.balizaSelected.idElement,
      })
      .subscribe({
        next: (result) => {
          this.respuestaApi = result.body.d;
          this._configBalizaAPIService.setConfigInstalcion(this.respuestaApi);
          this.mostrarMensajeCargaCompleta();
          // this.cargaCompleta++;
          // this.mostrarMensajeCargaCompleta();
        },
        error: (err) => {
          this.cargaCompletaIncompleta = true;
          this.mostrarMensajeCargaIncompleta();
        },
      });
  }

  getConfigPlanificador() {
    this.configuracionBalizaService
      .getConfiguracionPlaniicador({
        idDataminer: this.balizaSelected.idDataminer,
        idElement: this.balizaSelected.idElement,
      })
      .subscribe({
        next: (result) => {
          this.respuestaApi = result.d;
          this._configBalizaAPIService.setConfigPlanificador(this.respuestaApi);
          this.mostrarMensajeCargaCompleta();
          // this.cargaCompleta++;
          // this.mostrarMensajeCargaCompleta();
        },
        error: (err) => {
          this.cargaCompletaIncompleta = true;
          this.mostrarMensajeCargaIncompleta();
        },
      });
  }

  getConfigNuevoPlanificador() {
    this.configuracionBalizaService
      .getConfiguracionNuevoPlaniicador({
        idDataminer: this.balizaSelected.idDataminer,
        idElement: this.balizaSelected.idElement,
      })
      .subscribe({
        next: (result) => {
          this.respuestaApi = result.d;
          this._configBalizaAPIService.setConfigPNuevolanificador(
            this.respuestaApi
          );
          this.mostrarMensajeCargaCompleta();
          // this.cargaCompleta++;
          // this.mostrarMensajeCargaCompleta();
        },
        error: (err) => {
          this.cargaCompletaIncompleta = true;
          this.mostrarMensajeCargaIncompleta();
        },
      });
  }

  deshabilitarConfiguracion() {
    this.disableConfig = true;
  }

  mostrarMensajeCargaCompleta() {
    this._notificationService.notificationSuccess(
      'Información',
      'Se ha cargado la configuración.'
    );
    this.loading = false;
  }

  mostrarMensajeCargaIncompleta() {
    if (this.cargaCompletaIncompleta) {
      this._notificationService.notificationError(
        'Información',
        'No se ha cargado la configuración.'
      );
      //this.disableConfig = true;
      this.loading = false;
      this.cargaCompletaIncompleta = false;
    }
  }
}
