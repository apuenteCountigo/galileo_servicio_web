import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GenerateEvidenceService } from './generate-evidence.service'; // Importa el servicio que necesitas
import { EstadosGeneracionEvidencia } from '../enums/estados.enum'; // Importa el enum si es necesario

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  private intervalProgressEvidence: any;

  constructor(
    private router: Router,
    private generateEvidenceService: GenerateEvidenceService
  ) {}

  logout() {
    // Lógica para desloguear al usuario
    localStorage.clear();
    if(this.intervalProgressEvidence != undefined)
        clearInterval(this.intervalProgressEvidence);
    this.generateEvidenceService.setGenerate(
      EstadosGeneracionEvidencia.SIN_INICIAR
    );
    this.router.navigate(['/login']); // Ruta de login
  }

  setIntervalProgress(interval: any) {
    this.intervalProgressEvidence = interval;
  }
}