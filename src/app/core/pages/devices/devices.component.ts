import { Component, OnInit } from '@angular/core';
import { BalizaSearchQuery } from '../../constants/baliza.query';
import { Objetivo } from '../../models/objetivo.modal';
import { LoggedUserService } from '../../services/logged-user.service';
import { ObjetivosService } from '../../services/objetivos.service';
import { TableBase } from '../../utils/table.base';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.less'],
})
export class DevicesComponent extends TableBase implements OnInit {
  devicesList!: Objetivo[];
  selectedDevice?: Objetivo;
  query: BalizaSearchQuery = new BalizaSearchQuery();
  constructor(
    private _objetivoService: ObjetivosService,
    private _loggedUserService: LoggedUserService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = false;
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this._objetivoService
      .searchDevices({
        idUsuario: this._loggedUserService.getLoggedUser().id,
      })
      .subscribe({
        next: (result) => {
          this.loading = false;
          this.devicesList = [...result.resources];
        },
        error: (error) => {
          this.loading = false;
        },
      });
  }

  onExpandChangeDevice(device: Objetivo, checked: boolean): void {
    if (checked) {
      this.selectedDevice = device;
      this.expandSet.add(device.id);
    } else {
      this.selectedDevice = undefined;
      this.expandSet.delete(device.id);
    }
  }
}
