import { Component, OnInit } from '@angular/core';
import { BreadCrumbService } from '../../services/bread-crumb.service';

@Component({
  selector: 'app-nomencladores',
  templateUrl: './nomencladores.component.html',
  styleUrls: ['./nomencladores.component.less'],
})
export class NomencladoresComponent implements OnInit {
  gridStyle = {
    width: '50%',
    textAlign: 'center',
  };

  constructor(
    private _breadrumbService: BreadCrumbService,
    ) {
  }
  updateBreadCrumb(valor: any, seleccionado?: any) {
    this._breadrumbService.updateBreadCrumb.emit({
      valor: valor,
      seleccionado: seleccionado,
    });
  }

  ngOnInit(): void {
    this.updateBreadCrumb('nomencladores');
  }
}
