import { Component, OnDestroy, OnInit } from '@angular/core';
import { PagedResourceCollection, Sort } from '@lagoshny/ngx-hateoas-client';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { FrmActions } from 'src/app/core/enums/form-acctios';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Server } from '../../../models/server.model';
import { UsersComponent } from '../../../pages/users/users.component';
import { ServerService } from '../../../services/server.service';
import { TableBase } from '../../../utils/table.base';
import { DataMinerFormComponent } from '../data-miner-form/data-miner-form.component';

@Component({
  selector: 'app-servidores-data-miner',
  templateUrl: './servidores-data-miner.component.html',
  styleUrls: ['./servidores-data-miner.component.less'],
})
export class ServidoresDataMinerComponent
  extends TableBase
  implements OnInit, OnDestroy
{
  disableServerActions = true;
  searchCriteria = {
    ipServicio: '',
    servicio: '',
  };
  userModalRef!: NzModalRef<UsersComponent>;
  listOfServer: Server[] = [];
  selectedServer: any = null;

  suscriptions: Array<any> = [];

  constructor(
    private modalService: NzModalService,
    private _notificationService: NotificationService,
    private _serverServices: ServerService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  loadData() {
    this.loading = true;
    this.suscriptions.push(
      this._serverServices.getAll(this.params, this.sort).subscribe({
        next: (servers: PagedResourceCollection<Server>) => {
          this.loading = false;
          this.listOfServer = [...servers.resources];
          this.total = servers.totalElements;
        },
        error: (err) => {
          this._notificationService.notificationError(
            'Error',
            'Ha ocurrido un error al cargar los servidores'
          );
          this.loading = false;
        },
      })
    );
  }

  searchData() {
    this.loading = true;
    this.params.page = 0;
    this.suscriptions.push(
      this._serverServices
        .search(this.searchCriteria, this.params, this.sort)
        .subscribe({
          next: (servers: PagedResourceCollection<Server>) => {
            this.loading = false;
            this.listOfServer = [];
            if (servers.resources.length > 0) {
              this.listOfServer = [...servers.resources];
            }
            this.total = servers.totalElements;
          },
          error: (err) => {
            this._notificationService.notificationError(
              'Error',
              'Ha ocurrido un error al cargar los usuarios'
            );
            this.listOfServer = [];
            this.total = 0;
            this.loading = false;
          },
        })
    );
  }

  override onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    this.sort = {};
    sort.forEach((s) => {
      if (s.value) {
        this.sort[s.key] = s.value == 'ascend' ? 'ASC' : 'DESC';
      }
    });
    this.sort['fechaCreacion'] = 'DESC';
    this.params.page = pageIndex - 1;
    this.params.size = pageSize;

    this.onSearch();
  }

  override showModal(isEdit?: boolean) {
    const modalTitle = isEdit ? 'Editar Servidor' : 'Agregar Servidor';
    const modalRef = this.modalService.create({
      nzTitle: modalTitle,
      nzStyle: { top: '20px' },
      nzMaskClosable: false,
      nzContent: DataMinerFormComponent,
      nzComponentParams: {
        serverToEdit: this.selectedServer,
        listOfServer: this.listOfServer,
      },
    });

    modalRef.afterClose.subscribe((result) => {
      if (result.accion == FrmActions.AGREGAR) {
        this._serverServices.create(result.newServer).subscribe(() => {
          this._notificationService.notificationSuccess(
            'Información',
            'Se ha creado el servidor con Información'
          );
          this.loadData();
        });
      }
      if (result.accion == FrmActions.EDITAR) {
        this._serverServices.update(result.newServer).subscribe(() => {
          this.uncheckAction();
          this._notificationService.notificationSuccess(
            'Información',
            'Se ha actualizado el servidor con Información'
          );
          this.loadData();
        });
      }
    });
  }

  deleteServer() {
    this.modalService.confirm({
      nzTitle: 'Confirmación',
      nzContent: `Está seguro de eliminar el servidor?`,
      nzOnOk: () => {
        this.suscriptions.push(
          this._serverServices.detele(this.selectedServer).subscribe(() => {
            this.uncheckAction();
            this.loadData();
          })
        );
      },
    });
  }

  uncheckAction() {
    this.selectedServer = null;
    this.disableServerActions = true;
    this.expandSet.clear();
  }

  resetForm(): void {
    this.searchCriteria.ipServicio = '';
    this.searchCriteria.servicio = '';
    this.loadData();
  }

  onExpandChangeServer(server: Server, checked: boolean): void {
    this.expandSet.clear();
    if (checked) {
      this.selectedServer = server;
      this.expandSet.add(server.id);
      this.disableServerActions = false;
    } else {
      this.selectedServer = null;
      this.expandSet.delete(server.id);
      this.disableServerActions = true;
    }
  }

  isNullBusqueda() {
    return Object.values(this.searchCriteria).every((value) => {
      if (value === null || value === '') {
        return true;
      }
      return false;
    });
  }

  onSearch() {
    if (this.isNullBusqueda()) {
      this.loadData();
    } else {
      this.searchData();
    }
  }

  closeSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.searchCriteria.ipServicio = '';
    this.searchCriteria.servicio = '';
    this.loadData();
  }

  handleErrorMessage(error: any, defaultMsg: string): void {
    if (error.status == 400) {
      this._notificationService.notificationError(
        'Error',
        error.error.message.toLowerCase()
      );
    } else if (error.status == 409) {
      this._notificationService.notificationError(
        'Error',
        'El registro está relacionado, elimine primero sus dependencias.'
      );
    } else if (error.status == 500) {
      if (
        error.error.message &&
        error.error.message.toLowerCase().includes('fallo')
      ) {
        this._notificationService.notificationError(
          'Error',
          error.error.message
        );
      } else {
        this._notificationService.notificationError('Error', defaultMsg);
      }
    } else {
      this._notificationService.notificationError('Error', defaultMsg);
    }
  }
}
