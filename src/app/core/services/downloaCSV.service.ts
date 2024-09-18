import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class FtpDownloadService {
  private apiUrl = environment.API_URL_EVIDENCIAS; // Ajusta esta URL a tu backend
  private fileName="";
  constructor(private http: HttpClient) { }

  downloadFile(path: string, fileName: string): Observable<HttpResponse<Blob>> {
    this.fileName=fileName;
    const url = `${this.apiUrl}/downloadCSV/${fileName}`;
    const params = new HttpParams().set('path', path);

    return this.http.get(url, {
      params: params, // Enviar el parámetro en la petición
      responseType: 'blob',
      observe: 'response'
    });
  }

  saveFile(response: HttpResponse<Blob>): void {
    const blob = response.body;
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = this.fileName;
    if (contentDisposition) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }
    
    if (blob != undefined && blob != null) {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(objectUrl);
    }
  }
}