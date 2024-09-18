import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { ListCSVFiles } from '../../services/listCSV.service';
import { PageableObjectResponse } from '../../dto/PageableObject';
import { FtpDownloadService } from '../../services/downloaCSV.service';
import { NotificationService } from '../../services/notification.service';
import { EvidenceFilter } from '../../dto/evidenceFilter';
import { Objetivo } from '../../models/objetivo.modal';
import { Operacion } from '../../models/operacion.model';

interface FileNode extends NzTreeNodeOptions {
  key: string;
  title: string;
  isLeaf: boolean;
  children?: FileNode[];
  isExpanded?: boolean;
}

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
  pageSize = 20;
  totalItems = 100; // This should be set to the total number of files

  files: PageableObjectResponse | null = null;

  constructor(
    private listCSVFiles: ListCSVFiles,
    private cdr: ChangeDetectorRef,
    private _notificationService: NotificationService,
    private ftpDownloadService: FtpDownloadService
  ) {}

  ngOnInit() {
    console.log(this.filters);
    console.log(this.objetivos);
    console.log(this.operacion);
    
    this.loadCSV();
  }

  loadCSV(){
    this.listCSVFiles.getCsvFiles(0).subscribe(
      response => {
        this.files = response;
        console.log(this.files);
        this.nodes = [];
        this.files?.content.forEach(el => {
          this.nodes.push({
            key: el,
            title: el,
            isLeaf: true,
            isExpanded: false,
          });
        });
        this.cdr.detectChanges(); // Forzar la detección de cambios
      },
      error => {
        console.error('Error fetching CSV files', error);
      }
    );
  }

  downloadFile(fileName: string): void {
    this.ftpDownloadService.downloadFile(fileName).subscribe(
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
  }

  openFolder(node: FileNode): void {
    if (node.children) {
      node.isExpanded = !node.isExpanded;
    }
  }

  pageIndexChange(newPageIndex: number): void {
    this.pageIndex = newPageIndex;
    this.loadNodesForPage(newPageIndex);
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