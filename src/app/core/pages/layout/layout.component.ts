import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable } from 'rxjs';
import { ThemeService, ThemeType } from 'src/app/theme.service';
import { ChangePasswordComponent } from '../../components/user/change-password/change-password.component';
import { EstadosGeneracionEvidencia } from '../../enums/estados.enum';
import { ItemSelectedType } from '../../enums/item-tye.enum';
import { Routes } from '../../enums/routes.enum';
import { LoggedUserRole } from '../../enums/user-role.enum';
import { LoggedUser } from '../../models/interfaces';
import { EvidenceService } from '../../services/evidence.service';
import { GenerateEvidenceService } from '../../services/generate-evidence.service';
import { ItemSelectedService } from '../../services/item-selected.service';
import { LoggedUserService } from '../../services/logged-user.service';
import { NotificationService } from '../../services/notification.service';
import { CsvListComponent } from '../../components/csv/csv-list.component';
import { Objetivo } from '../../models/objetivo.modal';
import { EvidenceFilter } from '../../dto/evidenceFilter';
import { Operacion } from '../../models/operacion.model';
import { takeWhile } from 'rxjs/operators';
import { LogoutService } from '../../services/logout.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
})
export class LayoutComponent implements OnInit {
  switchValue = false;
  public isCollapsed = true;
  public itemType: typeof ItemSelectedType = ItemSelectedType;
  public routes: typeof Routes = Routes;

  public todayDate: Date = new Date();
  sizeSpacer = 30;

  operacion: Operacion = new Operacion();
  objetivos: Objetivo[] = [];
  filters: EvidenceFilter = new EvidenceFilter();
  isGenerating: boolean = false;
  isGenerating$: any;
  interval: any;
  percent: number = 0;
  isWaiting: boolean = false;
  isAlive: boolean = true; // Para manejar el ciclo de vida del componente

  isOpenedListCSV: boolean = false;
  modalCSV: any;

  /** User logged */
  loggedUser!: LoggedUser;
  public userRoles: typeof LoggedUserRole = LoggedUserRole;
  public fullUserName!: string | null | undefined;

  /** Help file */
  fileHelpUrlPage = 'assets/help/index.html';

  constructor(
    private themeService: ThemeService,
    private modal: NzModalService,
    private selectedItemService: ItemSelectedService,
    private generateEvidenceService: GenerateEvidenceService,
    private router: Router,
    private permissionsService: NgxPermissionsService,
    private loggedUserService: LoggedUserService,
    private evidenceService: EvidenceService,
    private notificationService: NotificationService,
    private logoutService: LogoutService
  ) {}

  ngOnInit(): void {
    this.generateEvidenceService.isGenetaring$.subscribe((result: string) => {
      this.isGenerating = result == EstadosGeneracionEvidencia.INICIADA;
      if (this.isGenerating) {
        this.percent = 0;
        this.interval = setInterval(() => {
          if (!this.isWaiting) {
            this.isWaiting = true;
            this.evidenceService.getProgreso()
              .pipe(
                takeWhile(() => this.isAlive) // Se ejecutará mientras isAlive sea true
              )
              .subscribe({
                next: (result: any) => {
                  this.percent = result.valor ? result.valor : 0;
                  if (this.percent == 95 && !this.isOpenedListCSV) {
                    this.isOpenedListCSV = true;
                    this.showModalCSV();
                  } else if (this.percent == 100) {
                    setTimeout(() => {
                      this.generateEvidenceService.setGenerate(
                        EstadosGeneracionEvidencia.FINALIZADA
                      );
                      this.isGenerating = false;
                      this.modalCSV.close();
                      this.notificationService.notificationSuccess(
                        'Confirmación',
                        'Las evidencias han sido generadas correctamente.'
                      );
                    }, 3000);
                    clearInterval(this.interval);
                  }
                  this.isWaiting = false;
                },
                error: (e) => {
                  this.handleErrorMessage(
                    e,
                    'Las evidencias no se han generado correctamente'
                  );
                  clearInterval(this.interval);
                  this.isWaiting = false;
                  this.isGenerating = false;
                  this.generateEvidenceService.setGenerate(
                    EstadosGeneracionEvidencia.FINALIZADA
                  );
                }
              });
          }
        }, 10000);

        this.logoutService.setIntervalProgress(this.interval);
      } else {
        clearInterval(this.interval);
      }
    });

    this.generateEvidenceService.objetivos$.subscribe((result: Array<Objetivo>) => {
      if (this.isGenerating){
        this.objetivos=result;
      }
    });

    this.generateEvidenceService.evidencefilter$.subscribe((result: EvidenceFilter) => {
      if (this.isGenerating){
        this.filters=result;
      }
    });

    this.generateEvidenceService.operacion$.subscribe((result: Operacion) => {
      if (this.isGenerating){
        this.operacion=result;
      }
    });

    this.isCollapsed = true;
    /** Obtain logged user role */
    this.loggedUser = this.loggedUserService.getLoggedUser();
    const perm = [this.loggedUser.role];
    this.permissionsService.loadPermissions(perm);
    let name: string | null | undefined;
    this.loggedUser.nombre ? (name = this.loggedUser.nombre) : null;
    this.loggedUser.apellidos
      ? (name = name + ' ' + this.loggedUser.apellidos)
      : null;
    this.fullUserName = name;

    const nuevo = localStorage.getItem('nuevo');

    if (nuevo == 'true') {
      const modalRef = this.modal.create({
        nzTitle: 'Cambio de Contraseña Obligatorio',
        nzClosable: false,
        nzMaskClosable: false,
        nzCloseOnNavigation: false,
        nzContent: ChangePasswordComponent,
        nzComponentParams: {
          isMandatory: true,
        },
      });
      modalRef.afterClose.subscribe((result) =>
        localStorage.setItem('nuevo', 'false')
      );
    }
  }

  showModalCSV(){
    const modalTitle = 'Descargar CSV';
    this.modalCSV = this.modal.create({
      nzTitle: modalTitle,
      nzStyle: { top: '200px', width: '600px' },
      nzMaskClosable: false,
      nzClosable: true,
      nzContent: CsvListComponent,
      nzFooter: null,
      nzWrapClassName: 'custom-modal-wrapper',//Estilo para que se muestre más abajo del Topbar
      nzComponentParams: {
        filters: this.filters,
        objetivos: this.objetivos,
        operacion: this.operacion,
      },
    });

    this.modalCSV.afterClose.subscribe((result: any) => {
      this.evidenceService.stopProgress().subscribe({
        next: (result: any) => {
          this.generateEvidenceService.setGenerate(
            EstadosGeneracionEvidencia.FINALIZADA
          );
          this.isGenerating = false;
          this.notificationService.notificationSuccess(
            'Confirmación',
            'Las evidencias han sido detenidas correctamente.'
          );
          this.isOpenedListCSV=false;
        },
        error: (e) => {
          this.handleErrorMessage(
            e,
            'Las evidencias no se han detenido correctamente'
          );
          this.isGenerating = false;
          this.generateEvidenceService.setGenerate(
            EstadosGeneracionEvidencia.FINALIZADA
          );
          this.isOpenedListCSV=false;
        },
      });
    });
  }

  changePassword() {
    this.modal.create({
      nzTitle: 'Cambio de Contraseña',
      nzClosable: true,
      nzMaskClosable: false,
      nzCloseOnNavigation: true,
      nzContent: ChangePasswordComponent,
      nzComponentParams: {
        isMandatory: false,
      },
    });
  }

  toggleTheme() {
    if (!this.switchValue) {
      this.switchValue = !this.switchValue;
      this.themeService.toggleThemeDirect(ThemeType.dark);
      return;
    }
    this.switchValue = !this.switchValue;
    this.themeService.toggleThemeDirect(ThemeType.default);
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  showTabs(itemType: ItemSelectedType): void {
    const itemSelected = {
      type: itemType,
    };
    this.selectedItemService.setItem(itemSelected);
  }

  logout() {
    // localStorage.clear();
    // clearInterval(this.interval);
    // this.generateEvidenceService.setGenerate(
    //   EstadosGeneracionEvidencia.SIN_INICIAR
    // );
    this.isGenerating = false;
    // this.router.navigate([this.routes.LOGIN]);
    this.logoutService.logout();
  }

  showChangePassword(): void {
    this.modal.create({
      nzTitle: 'Cambio de Contraseña',
      nzClosable: true,
      nzMaskClosable: false,
      nzCloseOnNavigation: false,
      nzContent: ChangePasswordComponent,
      nzComponentParams: {
        isMandatory: false,
      },
    });
  }

  showHelp(): void {
    window.open(this.fileHelpUrlPage, '_blank');
  }

  handleErrorMessage(error: any, defaultMsg: string): void {
    if (error.error && error.error.message && error.error.message.toLowerCase().includes('jwt expired')) {
      // Desloguea al usuario
      this.logoutService.logout(); // Asegúrate de que `logout()` limpie los datos del usuario
      return;
    }else if (error.status == 400) {
      this.notificationService.notificationError(
        'Error',
        error.error.message.toLowerCase()
      );
    } else if (error.status == 409) {
      this.notificationService.notificationError(
        'Error',
        error.error.message.toLowerCase()
      );
    } else if (error.status == 500) {
      if (
        error.error.message &&
        error.error.message.toLowerCase().includes('fallo')
      ) {
        this.notificationService.notificationError(
          'Error',
          error.error.message
        );
      } else {
        this.notificationService.notificationError('Error', defaultMsg);
      }
    } else {
      this.notificationService.notificationError('Error', defaultMsg);
    }
  }

  getStatusBar() {
    return this.percent < 100 ? 'active' : 'success';
  }
}
