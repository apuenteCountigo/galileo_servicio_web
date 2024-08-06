import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EstadosBalizaDataminer } from '../enums/estados.enum';

@Injectable({
  providedIn: 'root',
})
export class BreadCrumbService {
  @Output() updateBreadCrumb: EventEmitter<any> = new EventEmitter();

  private estadoBalizaDataminer$ = new BehaviorSubject<string>(
    EstadosBalizaDataminer.SIN_INICIAR
  );

  estado$ = this.estadoBalizaDataminer$.asObservable();

  constructor() {}

  setEstado(estadoBalizaDataminer: EstadosBalizaDataminer) {
    this.estadoBalizaDataminer$.next(estadoBalizaDataminer);
  }
}
