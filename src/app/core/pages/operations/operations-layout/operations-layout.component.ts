import { Component, OnInit } from '@angular/core';
import { ItemSelectedType } from 'src/app/core/enums/item-tye.enum';
import { ItemSelectedService } from 'src/app/core/services/item-selected.service';

@Component({
  selector: 'app-operations-layout',
  templateUrl: './operations-layout.component.html',
  styleUrls: ['./operations-layout.component.less'],
})
export class OperationsLayoutComponent implements OnInit {
  itemSelected: any;
  public itemType: typeof ItemSelectedType = ItemSelectedType;

  /** vars para mostrar/ocultar tabs */
  showEvidence: boolean = false;
  showConfigurations: boolean = false;

  constructor(private selectedItemService: ItemSelectedService) {}

  ngOnInit(): void {
    this.selectedItemService.selectedItem$.subscribe((value) => {
      this.itemSelected = value;
      this.initTabs();
    });
  }

  initTabs(): void {
    switch (this.itemSelected.type) {
      case this.itemType.UNIT:
        this.showEvidence = false;
        this.showConfigurations = false;
        break;
      case this.itemType.OPERATION:
        this.showEvidence = true;
        this.showConfigurations = false;
        break;
      case this.itemType.OBJETIVE:
        this.showEvidence = false;
        this.showConfigurations = true;
        break;
      case this.itemType.BALIZA:
        this.showEvidence = false;
        this.showConfigurations = false;
        break;
      default:
        this.showEvidence = false;
        this.showConfigurations = false;
        break;
    }
  }
}
