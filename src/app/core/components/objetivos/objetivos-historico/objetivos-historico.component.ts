import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Historico } from 'src/app/core/models/historico.model';
import { Objetivo } from 'src/app/core/models/objetivo.modal';
import { HistoricoService } from 'src/app/core/services/historico.service';

@Component({
  selector: 'app-objetivos-historico',
  templateUrl: './objetivos-historico.component.html',
  styleUrls: ['./objetivos-historico.component.less'],
})
export class ObjetivosHistoricoComponent implements OnInit, OnDestroy {
  @Input() objetivo?: Objetivo;

  historico!: Array<Historico>;

  suscriptions: Array<any> = [];

  constructor(
    private modalRef: NzModalRef,
    private _historicoService: HistoricoService
  ) {}

  ngOnInit(): void {
    this.suscriptions.push(
      this._historicoService
        .filter({ idObjetivo: this.objetivo!.id, idBaliza: 0 })
        .subscribe((result) => {
          this.historico = [...result.resources];
        })
    );
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  closeForm() {
    this.modalRef.close({ accion: 'CANCELAR' });
  }
}
