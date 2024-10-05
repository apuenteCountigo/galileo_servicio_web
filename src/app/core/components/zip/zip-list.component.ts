import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
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
import { ListZIPFiles } from '../../services/listZIP.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-zip-list',
  templateUrl: './zip-list.component.html',
  styleUrls: ['./zip-list.component.css'],
})
export class ZipListComponent implements OnInit {
  @Input() operacion: Operacion = new Operacion();
  
  nodes: FileNode[] = [];
  selectedFiles: any[] = [];
  filterName = "";
  pageIndex = 1;
  pageSize = 2;
  totalItems = 0; // This should be set to the total number of files
  isBuildingPackage: boolean = false;

  files: PageableObjectResponse | null = null;

  searchZIPForm: FormGroup;

  constructor(
    private listZIPFiles: ListZIPFiles,
    private cdr: ChangeDetectorRef,
    private _notificationService: NotificationService,
    private modalZIP: NzModalRef,
    private generateEvidenceService: GenerateEvidenceService,
    private evidenceService: EvidenceService,
    private ftpDownloadService: FtpDownloadService,
    private fb: FormBuilder
  ) {
    this.searchZIPForm = this.fb.group({
      descripcion: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.pageIndex=1;
    this.loadZIP(this.pageIndex);
  }

  checkForm() {
    return this.searchZIPForm.invalid ? true : false;
  }

  setStyleClassBusqueda() {
    return !this.checkForm() ? 'icon-class' : 'icon-disabled';
  }

  resetForm(): void {
    this.searchZIPForm.reset();
    this.pageIndex=1;
    this.cdr.detectChanges();
    this.loadZIP(this.pageIndex);
  }

  onSearch(): void{
    this.pageIndex=1;
    this.cdr.detectChanges();
    this.loadZIP(this.pageIndex);
  }

  loadZIP(pageIndex: number){
    this.listZIPFiles.getFiles(
      this.operacion.unidades?.denominacion || "",
      this.operacion.descripcion,
      pageIndex - 1, // El backend usa índice base 0
      this.pageSize,
      this.searchZIPForm.value.descripcion
    ).subscribe(
      response => {
        this.files = response;
        this.nodes = this.files?.content || [];
        this.totalItems = this.files?.totalElements || 0;
        this.cdr.detectChanges(); // Forzar la detección de cambios
      },
      error => {
        console.error('Error fetching ZIP files', error);
        this.handleErrorMessage(
          error,
          'Fallo visualizando ficheros zip.'
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
    this.modalZIP.close({ accion: 'CANCEL' });
  }

  openFolder(node: FileNode): void {
    if (node.children) {
      node.isExpanded = !node.isExpanded;
    }
  }

  pageIndexChange(newPageIndex: number): void {
    this.pageIndex = newPageIndex;
    this.loadZIP(newPageIndex);
  }

  // Función para gestionar la selección de un archivo
  onFileSelect(node: any) {
    if (node.checked) {
      this.selectedFiles.push(node);
      console.log(this.selectedFiles);
    } else {
      console.log(this.selectedFiles);
      this.selectedFiles = this.selectedFiles.filter(file => file.key !== node.key);
    }
  }

  // Verificar si hay archivos seleccionados
  hasSelectedFiles(): boolean {
    return this.selectedFiles.length > 0;
  }

  // Descargar los archivos seleccionados
  downloadSelectedFiles() {
    this.selectedFiles.forEach(file => {
      this.downloadFile(file.key, file.title);
    });
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