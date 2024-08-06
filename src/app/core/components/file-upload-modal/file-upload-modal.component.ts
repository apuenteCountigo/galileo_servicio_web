import {
  HttpClient,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { filter, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../../services/notification.service';

interface ErrorInterface {
  error: string;
  mensaje: string;
  importacionesCorrectas: number;
  importacionesIncorrectas: number;
}

@Component({
  selector: 'app-file-upload-modal',
  templateUrl: './file-upload-modal.component.html',
  styleUrls: ['./file-upload-modal.component.less'],
})
export class FileUploadModalComponent implements OnInit {
  @Input() isUnit: boolean = false;
  @Input() isUser: boolean = false;
  @Input() isBaliza: boolean = false;

  processing = false;
  fileList: NzUploadFile[] = [];
  fileUploaded!: any;
  supportedFileTypes = '.xlsx, .xls, .cvs';

  isVisible = false;

  errorList: Array<ErrorInterface> = [];
  imporacionCorrecta = 0;
  imporacionIncorrecta = 0;

  constructor(
    private modalRef: NzModalRef,
    private http: HttpClient,
    private msg: NzMessageService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileUploaded = file;
    this.fileList = this.fileList.concat(file);
    return false;
  };

  // serviceRequest(form: FormData): Observable<any> {
  //   const token = localStorage.getItem('auth_token');
  //   return this.http.post<any>(environment.API_URL_IMPORTAR, form, {
  //     headers: {
  //       Authorization: 'Bearer ' + token,
  //     },
  //   });
  // }
  serviceRequest(req: any): Observable<any> {
    return this.http
      .request(req)
      .pipe(filter((e) => e instanceof HttpResponse));
  }

  onProcessFileDirect(): void {
    const formData = new FormData();
    /** Validar para setear value de parametro destino correctamente */
    if (this.isUnit) {
      formData.append('destino', 'unidades');
      formData.append('file', this.fileUploaded);
    }
    if (this.isUser) {
      formData.append('destino', 'usuarios');
      formData.append('file', this.fileUploaded);
    }
    if (this.isBaliza) {
      formData.append('destino', 'balizas');
      formData.append('token', localStorage.getItem('auth_token') as string);
      formData.append('file', this.fileUploaded);
    }

    this.processing = true;
    const req = new HttpRequest(
      'POST',
      environment.API_URL_IMPORTAR,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        }),
      }
    );

    this.serviceRequest(req).subscribe({
      next: () => {
        this.processing = false;
        this.fileList = [];
        this.modalRef.close(true);
      },
      error: (err) => {
        this.processing = false;
        switch (err.status) {
          case 417:
            this._notificationService.notificationError(
              'Error',
              'El formato del documento no es el correcto'
            );
            break;
          case 200:
            this.fileList = [];
            this.modalRef.close(true);
            break;
          case 400:
            if (Array.isArray(err.error)) {
              this.errorList = [];
              this.errorList = [...(err.error as Array<ErrorInterface>)];
              this.isVisible = true;
              this.imporacionCorrecta =
                this.errorList[
                  this.errorList.length - 1
                ].importacionesCorrectas;
              this.imporacionIncorrecta =
                this.errorList[
                  this.errorList.length - 1
                ].importacionesIncorrectas;
              this.errorList.pop();
            } else {
              this._notificationService.notificationError(
                'Datos Erróneos',
                err.error
              );
            }
            break;
          case 500:
            this._notificationService.notificationError('Error', err.error);
            break;

          default:
            this._notificationService.notificationError(
              'Error General',
              'Ha ocurrido un problema con la conexión'
            );
            break;
        }
        this.fileList = [];
      },
    });
  }

  onCancel(): void {
    this.modalRef.close(false);
  }

  hideModal() {
    this.isVisible = false;
  }
}
