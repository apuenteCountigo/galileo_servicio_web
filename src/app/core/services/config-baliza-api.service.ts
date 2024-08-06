import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { configDataMimerInterfece } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ConfigBalizaAPIService {
  // @Output() senConfigAPI: EventEmitter<any> = new EventEmitter();

  // constructor() { }
  arrayConfig!: configDataMimerInterfece[];

  private item1$ = new BehaviorSubject<configDataMimerInterfece[]>(
    this.arrayConfig
  );
  selectedItem1$ = this.item1$.asObservable();

  private item2$ = new BehaviorSubject<configDataMimerInterfece[]>(
    this.arrayConfig
  );
  selectedItem2$ = this.item2$.asObservable();

  private item3$ = new BehaviorSubject<configDataMimerInterfece[]>(
    this.arrayConfig
  );
  selectedItem3$ = this.item3$.asObservable();

  private item4$ = new BehaviorSubject<configDataMimerInterfece[]>(
    this.arrayConfig
  );
  selectedItem4$ = this.item4$.asObservable();

  private item5$ = new BehaviorSubject<configDataMimerInterfece[]>(
    this.arrayConfig
  );
  selectedItem5$ = this.item5$.asObservable();

  private item6$ = new BehaviorSubject<configDataMimerInterfece[]>(
    this.arrayConfig
  );
  selectedItem6$ = this.item6$.asObservable();

  private item7$ = new BehaviorSubject<any[]>(
    this.arrayConfig
  );
  selectedItem7$ = this.item7$.asObservable();

  private item8$ = new BehaviorSubject<any[]>(
    this.arrayConfig
  );
  selectedItem8$ = this.item8$.asObservable();

  private item9$ = new BehaviorSubject<any[]>(
    this.arrayConfig
  );
  selectedItem9$ = this.item9$.asObservable();

  constructor() {}

  setConfigBalizaAvanzada(configDataMimer: any) {
    this.item1$.next(configDataMimer);
  }
  setConfigBalizaUltimaPosicion(configDataMimer: any) {
    this.item2$.next(configDataMimer);
  }
  setConfigBalizaGPS(configDataMimer: any) {
    this.item3$.next(configDataMimer);
  }
  setConfigAlertaOperativa(configDataMimer: any) {
    this.item4$.next(configDataMimer);
  }
  setConfigAntiBarrido(configDataMimer: any) {
    this.item5$.next(configDataMimer);
  }
  setConfigInstalcion(configDataMimer: any) {
    this.item6$.next(configDataMimer);
  }
  setConfigDispositivos(configDataMimer: any) {
    this.item7$.next(configDataMimer);
  }
  setConfigPlanificador(configDataMimer: any) {
    this.item8$.next(configDataMimer);
  }
  setConfigPNuevolanificador(configDataMimer: any) {
    this.item9$.next(configDataMimer);
  }
}
