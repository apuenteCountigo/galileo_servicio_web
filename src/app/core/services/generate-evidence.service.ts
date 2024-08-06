import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EstadosGeneracionEvidencia } from '../enums/estados.enum';
import { Objetivo } from '../models/objetivo.modal';

@Injectable({
  providedIn: 'root',
})
export class GenerateEvidenceService {
  public generate: boolean = false;

  private isGenetaringEvidence$ = new BehaviorSubject<string>(
    EstadosGeneracionEvidencia.SIN_INICIAR
  );

  private objetivosList$ = new BehaviorSubject<Array<Objetivo>>(new Array());

  isGenetaring$ = this.isGenetaringEvidence$.asObservable();
  objetivos$ = this.objetivosList$.asObservable();

  constructor() {}

  setGenerate(isGenetaring: EstadosGeneracionEvidencia) {
    this.isGenetaringEvidence$.next(isGenetaring);
  }

  setObjetivos(objetivos: Array<Objetivo>) {
    this.objetivosList$.next(objetivos);
  }
}
