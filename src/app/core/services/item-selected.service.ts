import { ItemSelectedInterface } from './../models/interfaces';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemSelectedType } from '../enums/item-tye.enum';

@Injectable({
  providedIn: 'root'
})
export class ItemSelectedService {

  public itemType: typeof ItemSelectedType = ItemSelectedType;

  private item$ = new BehaviorSubject<ItemSelectedInterface>({type: this.itemType.NONE});
  selectedItem$ = this.item$.asObservable();

  constructor() {}

  setItem(itemSelected: any) {
    this.item$.next(itemSelected);
  }
}
