import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Sort } from '@lagoshny/ngx-hateoas-client';
import { PageParam } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import jsPDF from 'jspdf';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { LoggedUserRole } from 'src/app/core/enums/user-role.enum';
import { Objetivo } from 'src/app/core/models/objetivo.modal';
import { Unit } from 'src/app/core/models/unit.model';
import { EvidenceService } from 'src/app/core/services/evidence.service';
import { ExporterService } from 'src/app/core/services/exporter.service';
import { LoggedUserService } from 'src/app/core/services/logged-user.service';
import { NotificationService } from 'src/app/core/services/notification.service';

import { formatISO } from 'date-fns';

@Component({
  selector: 'app-informe-tabla',
  templateUrl: './informe-tabla.component.html',
  styleUrls: ['./informe-tabla.component.scss'],
})
export class InformeTablaComponent implements OnInit {
  @Input() filterData!: any;

  objetivosList!: Array<Objetivo>;
  selectedObjetivo!: Objetivo;
  isVisible: boolean = false;
  filterdList: any;

  startDate!: Date;
  endDate!: Date;

  showSearchFormPos: boolean = false;
  searchInformeForm!: FormGroup;
  listPositions: Array<any> = [];

  public userRoles: typeof LoggedUserRole = LoggedUserRole;

  showSearchForm: boolean = false;
  total = 0;
  loading: boolean = false;
  pageSize = 10;
  pageIndex = 1;
  sort!: Sort;
  params: PageParam = {
    page: this.pageIndex - 1,
    size: this.pageSize,
  };

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private evidenceService: EvidenceService,
    private exporterService: ExporterService,
    private _loggedUserService: LoggedUserService
  ) {}

  ngOnInit(): void {
    this.objetivosList = this.filterData.objetivos;
    this.startDate = new Date(this.filterData.startDate);
    this.endDate = new Date(this.filterData.endDate);
    this.searchInformeForm = this.fb.group({
      objetive: ['', null],
      device: ['', null],
    });
    this.onSearchPositions();
  }

  isNullSearchForm() {
    return Object.values(this.searchInformeForm.value).every((value) => {
      if (value === null || value === '' || value === 0) {
        return true;
      }
      return false;
    });
  }

  onSearch(): void {
    this.listPositions = [];
    this.onSearchPositions();
  }

  resetForm(): void {
    this.searchInformeForm.reset();
    this.listPositions = [];
    this.onSearchPositions();
  }

  closeSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.resetForm();
    this.onSearchPositions();
  }

  showHideSearchForm() {
    this.showSearchForm = !this.showSearchForm;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const rr = sort.map((item) => {
      if (item.value === 'ascend') {
        item.value = 'ASC';
        return item;
      }
      if (item.value === 'descend') {
        item.value = 'DESC';
        return item;
      }
      return;
    });
    this.sort = rr.find((item) => item?.value) as Sort;
    this.params.page = pageIndex - 1;
    this.params.size = pageSize;
    this.onSearchPositions();
  }

  handleErrorMessage(error: any, defaultMsg: string): void {
    if (error.status == 400) {
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
      this.notificationService.notificationError(
        'Error',
        error.error.message.toLowerCase()
      );
    } else {
      this.notificationService.notificationError('Error', defaultMsg);
    }
  }

  generateKML() {}

  onSearchPositions(): void {
    this.loading = true;
    this.evidenceService
      .searchCriterio(
        {
          idUnidad: this.filterData.idUnidad,
          posType: this.filterData.posType,
          fechaInicio: this.filterData.startDate,
          fechaFin: this.filterData.endDate,
          idBalizas: this.filterData.idBalizas,
        },
        this.params,
        this.sort
      )
      .subscribe({
        next: (pos) => {
          this.listPositions = [...pos.resources];
          this.filterdList = [...this.listPositions];
          // this.total = pos.totalElements;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.listPositions = [];
          this.handleErrorMessage(
            err,
            'Ha ocurrido un error al cargar las posiciones.'
          );
        },
      });
  }

  onSearchLocal() {
    const filter = {
      objetive: this.searchInformeForm.value.objetive.toLowerCase(),
      device: this.searchInformeForm.value.device.toLowerCase(),
    };
    this.filterdList = this.listPositions.filter((p) => {
      return (
        (filter.objetive.length > 0 &&
          p.alias.toLowerCase().includes(filter.objetive)) ||
        (filter.device.length > 0 &&
          p.baliza.clave.toLowerCase().includes(filter.device))
      );
    });
  }

  showModal() {
    this.isVisible = true;
  }

  handleOk() {
    //   var doc = new jsPDF();
    //   const img1Src = 'assets/images/acta1.png';
    //   const img2Src = 'assets/images/acta2.png';
    //   doc.addImage(img1Src, 'PNG', 10, 10, 20, 20);
    //   doc.addImage(img2Src, 'PNG', 10, 250, 20, 40);
    //   doc.setFont('arial');
    //   doc.text('ACTA DE APORTACIÓN DE GEOLOCALIZACIONES', 40, 20);
    //   doc.setFont('calibri');
    //   doc.setFontSize(12);
    //   doc.text(
    //     `En ${this.selectedObjetivo.operaciones.unidades?.localidad}, ${this.selectedObjetivo.operaciones.unidades.descripcion
    //     }, siendo las ${new Date().toLocaleTimeString()} del día ${new Date().toLocaleDateString()}, el agente`,
    //     35,
    //     35
    //   );
    //   doc.text(
    //     `con TIP ${this._loggedUserService.getLoggedUser().tip
    //     }, por medio de la presente ACTA, hace constar:`,
    //     35,
    //     40
    //   );
    //   doc.text(
    //     `Que se aportan a las diligencias ${this.filterData.diligencias}, instruidas por el ${this.selectedObjetivo?.juzgados.descripcion}, el presente`,
    //     35,
    //     50
    //   );
    //   doc.text(
    //     ' acta donde se relacionan los puntos capturados por el dispositivo del sistema de seguimiento',
    //     35,
    //     55
    //   );
    //   doc.text(
    //     ` global por satélite SSGS, número ${this.selectedObjetivo?.balizas.clave
    //     }, comprediendo desde las ${this.startDate.toLocaleTimeString()}, del día ${this.startDate.toLocaleDateString()}`,
    //     35,
    //     60
    //   );
    //   doc.text(
    //     ` hasta las ${this.endDate.toLocaleTimeString()} del día ${this.endDate.toLocaleDateString()}`,
    //     35,
    //     65
    //   );
    //   doc.text('El agente interviniente,', 150, 260);
    //   doc.text(`${this._loggedUserService.getLoggedUser().tip}`, 170, 280);
    //   doc.save('Acta de posiciones.pdf');
    //   this.isVisible = false;
    // }
    // generateEvidence(): void { }
    // generateKML(): void {
    //   const filtro = {
    //     tipoPrecision: this.filterData.posType,
    //     fechaInicio: this.filterData.startDate,
    //     fechaFin: this.filterData.endDate,
    //   };
    //   this.evidenceService.generarKMLS(filtro, this.objetivosList).subscribe({
    //     next: (result) => {
    //       this.notificationService.notificationSuccess(
    //         'Información',
    //         'Se ha generado el paquete de evidencias correctamente.'
    //       );
    //     },
    //     error: (er) => {
    //       this.notificationService.notificationError('Error', er.error.message);
    //     },
    //   });
  }

  exportData(): void {
    // const doc = new jsPDF();

    // doc.text('Hello world!', 10, 10);
    // doc.save('a4.pdf');

    // var doc = new jsPDF('landscape', 'pt', 'a4');
    // doc.setFontSize(2);

    // const table = document.getElementById('dataPosTable') as HTMLElement;

    // doc.html(table, {
    //   callback: function (doc) {
    //     doc.save('Listado de posiciones.pdf');
    //   },
    //   margin: [10, 10, 10, 10],
    //   x: 10,
    //   y: 10,
    // });

    const positionsToDownload = this.listPositions.map((p) => {
      return {
        Id: p.id,
        Clave: p.clave,
        Alias: p.alias,
        'Id Posicion': p.idPosicion,
        'Fecha de Captación': formatISO(p.fechaCaptacion),
        'Fel del Servidor': p.timestampServidor,
        Latitud: p.latitud,
        Longitud: p.longitud,
        Rumbo: p.rumbo,
        Velocidad: p.velocidad,
        'Estado de la Bateria': p.estadoBateria,
        Evento: p.evento,
        Satélites: p.satelites,
        Precisión: p.precision,
        'Señal GPS': p.senalGps,
        'señal GSM': p.senalGsm,
        MmcBts: p.mmcBts,
        MncBts: p.mncBts,
        LacBts: p.lacBts,
        Toponimía: p.toponimia,
        Notas: p.notas,
        Baliza: p.balizas.clave,
      };
    });

    const headersDoc = Object.keys(positionsToDownload[0]);
    this.exporterService.downloadFile(
      positionsToDownload,
      'Listado de posiciones',
      headersDoc
    );
  }

  handleCancel() {
    this.isVisible = false;
  }
}
