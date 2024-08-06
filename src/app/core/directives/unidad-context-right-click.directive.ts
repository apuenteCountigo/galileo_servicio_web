import { Directive, HostListener, Input } from '@angular/core';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';

@Directive({
  selector: '[appUnidadContextRightClick]',
})
export class UnidadContextRightClickDirective {
  @Input() menu!: NzDropdownMenuComponent;

  constructor(private _nzContextMenuService: NzContextMenuService) {}

  @HostListener('contextmenu', ['$event'])
  onRightClick($event: MouseEvent) {
    $event.preventDefault();
    $event.stopImmediatePropagation();
    this._nzContextMenuService.create($event, this.menu);
  }
}
