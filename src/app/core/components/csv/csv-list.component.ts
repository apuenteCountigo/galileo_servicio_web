import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { ListCSVFiles } from '../../services/listCSV.service';
import { PageableObjectResponse } from '../../dto/PageableObject';
import { FileNode } from '../../dto/FileNode';
import { FtpDownloadService } from '../../services/downloaCSV.service';
import { NotificationService } from '../../services/notification.service';
import { EvidenceFilter } from '../../dto/evidenceFilter';
import { Objetivo } from '../../models/objetivo.modal';
import { Operacion } from '../../models/operacion.model';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { EvidenceService } from '../../services/evidence.service';
import { GenerateEvidenceService } from '../../services/generate-evidence.service';
import { EstadosGeneracionEvidencia } from '../../enums/estados.enum';

@Component({
  selector: 'app-csv-list',
  templateUrl: './csv-list.component.html',
  styleUrls: ['./csv-list.component.css'],
})
export class CsvListComponent implements OnInit {
  @Input() filters: EvidenceFilter = new EvidenceFilter();
  @Input() objetivos: Array<Objetivo> = new Array();
  @Input() operacion: Operacion = new Operacion();
  
  nodes: FileNode[] = [];
  pageIndex = 1;
  pageSize = 2;
  totalItems = 0; // This should be set to the total number of files
  isBuildingPackage: boolean = false;

  files: PageableObjectResponse | null = null;

  constructor(
    private listCSVFiles: ListCSVFiles,
    private cdr: ChangeDetectorRef,
    private _notificationService: NotificationService,
    private modalRef: NzModalRef,
    private generateEvidenceService: GenerateEvidenceService,
    private evidenceService: EvidenceService,
    private ftpDownloadService: FtpDownloadService
  ) {}

  ngOnInit() {
    this.loadCSV(this.pageIndex);
  }

  loadCSV(pageIndex: number){
    this.listCSVFiles.getCsvFiles(
      this.operacion.unidades?.denominacion || "",
      this.operacion.descripcion,
      this.filters.fechaInicio || "",
      this.filters.fechaFin || "",
      pageIndex - 1, // El backend usa índice base 0
      this.pageSize
    ).subscribe(
      response => {
        this.files = response;
        this.nodes = this.files?.content || [];
        this.totalItems = this.files?.totalElements || 0;
        this.cdr.detectChanges(); // Forzar la detección de cambios
        // this.files?.content.children?.forEach(el => {
        //   let children: Array<FileNode> = [];
          
        //   if(el.children?.length! > 0)
        //     children= el.children!;

        //   this.nodes.push({
        //     key: el.key,
        //     title: el.title,
        //     isLeaf: true,
        //     isExpanded: false,
        //     children: children!,
        //   });
        // });
      },
      error => {
        console.error('Error fetching CSV files', error);
        this.handleErrorMessage(
          error,
          'Fallo visualizando ficheros csv.'
        );
      }
    );
  }

  downloadFile(path: string, fileName: string): void {
    this.ftpDownloadService.downloadFile(path, fileName).subscribe(
      response => {
        this.ftpDownloadService.saveFile(response);
      },
      error => {
        console.error('Error al descargar el archivo', error);
        this.handleErrorMessage(
          error,
          'Ocurrió un error al descargar el fichero.'
        );
      }
    );
  }

  cancelForm() {
    this.nodes = [];
    this.files = null;
    this.modalRef.close({ accion: 'CANCEL' });
  }

  toBuildingPackage(){
    this.isBuildingPackage = true;
    this.evidenceService.toBuildPackage().subscribe({
      next: (result: any) => {
        // this.generateEvidenceService.setGenerate(
        //   EstadosGeneracionEvidencia.FINALIZADA
        // );
        this._notificationService.notificationSuccess(
          'Confirmación',
          result.message
        );
        this.isBuildingPackage = false;
      },
      error: (e) => {
        this.handleErrorMessage(
          e,
          'Fallo generando paquete de evidencias'
        );
        // this.isGenerating = false;
        // this.generateEvidenceService.setGenerate(
        //   EstadosGeneracionEvidencia.FINALIZADA
        // );
      },
    });
  }

  loadNodesForPage(page: number) {
    // This is where you would typically load data from a service
    // For this example, we'll generate some dummy data
    this.nodes = [];
    const startIndex = (page - 1) * this.pageSize;
    for (let i = startIndex; i < startIndex + this.pageSize && i < this.totalItems; i++) {
      if (i % 5 === 0) {
        // Create a folder every 5 items
        this.nodes.push({
          key: `folder-${i}`,
          title: `Folder ${i / 5 + 1}`,
          isLeaf: false,
          isExpanded: false,
          children: [
            {
              key: `file-${i + 1}`,
              title: `data${i + 1}.csv`,
              isLeaf: true,
              isExpanded: false,
            },
            {
              key: `file-${i + 2}`,
              title: `data${i + 2}.csv`,
              isLeaf: true,
              isExpanded: false,
            }
          ]
        });
      } else if (i % 5 !== 1 && i % 5 !== 2) {
        // Add individual files for the rest
        this.nodes.push({
          key: `file-${i}`,
          title: `data${i}.csv`,
          isLeaf: true,
          isExpanded: false,
        });
      }
    }
    console.log(this.nodes);
    
  }

  openFolder(node: FileNode): void {
    if (node.children) {
      node.isExpanded = !node.isExpanded;
    }
  }

  pageIndexChange(newPageIndex: number): void {
    this.pageIndex = newPageIndex;
    this.loadCSV(newPageIndex);
  }

  handleErrorMessage(error: any, defaultMsg: string): void {
    if (error.status == 400) {
      this._notificationService.notificationError(
        'Error',
        error.error.message.toLowerCase()
      );
    } else if (error.status == 409) {
      this._notificationService.notificationError(
        'Error',
        error.error.message.toLowerCase()
      );
    } else if (error.status == 500) {
      if (
        error.error.message &&
        (error.error.message.toLowerCase().includes('fallo') || error.error.message.toLowerCase().includes('falló'))
      ) {
        this._notificationService.notificationError(
          'Error',
          error.error.message
        );
      } else {
        this._notificationService.notificationError('Error', defaultMsg);
      }
    } else {
      this._notificationService.notificationError('Error', defaultMsg);
    }
  }
}