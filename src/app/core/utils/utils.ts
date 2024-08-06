import { BreadCrumbService } from './../services/bread-crumb.service';
export class Utils {

    private _breadrumbService!: BreadCrumbService;
    updateBreadCrumb(valor: string, seleccionado?: string) {
        this._breadrumbService.updateBreadCrumb.emit({
          valor: valor,
          seleccionado: seleccionado,
        });
      }
}