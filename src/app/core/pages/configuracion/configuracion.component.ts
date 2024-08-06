import { Component, OnInit } from '@angular/core';
import { BreadCrumbService } from '../../services/bread-crumb.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.less'],
})
export class ConfiguracionComponent implements OnInit {
  selectedIndex = 0;
  constructor(
    private _breadrumbService: BreadCrumbService,
  ) {}

  ngOnInit(): void {
    this.updateBreadCrumb('configiracionSistema');
    this.updateBreadCrumb('servidores');

  }

  updateBreadCrumb(valor: any, seleccionado?: any) {
    this._breadrumbService.updateBreadCrumb.emit({
      valor: valor,
      seleccionado: seleccionado,
    });
  }
}
