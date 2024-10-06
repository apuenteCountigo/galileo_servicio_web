import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EstadosGeneracionEvidencia } from '../enums/estados.enum';
import { Objetivo } from '../models/objetivo.modal';
import { EvidenceFilter } from '../dto/evidenceFilter';
import { Operacion } from '../models/operacion.model';

@Injectable({
  providedIn: 'root',
})
export class GenerateEvidenceService {
  public generate: boolean = false;

  private isGenetaringEvidence$ = new BehaviorSubject<string>(
    EstadosGeneracionEvidencia.SIN_INICIAR
  );

  private operacionBehavior$ = new BehaviorSubject<Operacion>(new Operacion());
  private objetivosList$ = new BehaviorSubject<Array<Objetivo>>(new Array());
  private evidenceFilter$ = new BehaviorSubject<EvidenceFilter>(new EvidenceFilter());
  private IsBuildingPackaged$ = new BehaviorSubject<boolean>(false);

  isGenetaring$ = this.isGenetaringEvidence$.asObservable();
  objetivos$ = this.objetivosList$.asObservable();
  evidencefilter$ = this.evidenceFilter$.asObservable();
  operacion$ = this.operacionBehavior$.asObservable();
  isBuildingPackaged$ = this.IsBuildingPackaged$.asObservable();

  constructor() {}

  setGenerate(isGenetaring: EstadosGeneracionEvidencia) {
    this.isGenetaringEvidence$.next(isGenetaring);
  }

  setObjetivos(objetivos: Array<Objetivo>) {
    this.objetivosList$.next(objetivos);
  }

  setFilters(filters: EvidenceFilter) {
    this.evidenceFilter$.next(filters);
  }

  setOperacion(operacion: Operacion) {
    this.operacionBehavior$.next(operacion);
  }

  setIsBuildingPackaged(isBP: boolean) {
    this.IsBuildingPackaged$.next(isBP);
  }
}
