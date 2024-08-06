import { Component, OnDestroy, OnInit } from '@angular/core';
import { PagedResourceCollection } from '@lagoshny/ngx-hateoas-client';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { OperacionesFormComponent } from '../../components/operaciones/operaciones-form/operaciones-form.component';
import { Estado } from '../../models/estado.model';
import { Operacion } from '../../models/operacion.model';
import { NotificationService } from '../../services/notification.service';
import { OperacionService } from '../../services/operacion.service';
import { TableBase } from '../../utils/table.base';
import * as MockComboBox from '../../utils/mockData.json';
import { Sort } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { FileUploadModalComponent } from '../../components/file-upload-modal/file-upload-modal.component';

const comboBox = MockComboBox;

interface BusquedaOperacion {
  descripcion: string | null;
  unidad: number | null;
}

@Component({
  selector: 'app-operacion',
  templateUrl: './operacion.component.html',
  styleUrls: ['./operacion.component.less'],
})
export class OperacionComponent extends TableBase implements OnInit, OnDestroy {
  operacionModalRef!: NzModalRef<OperacionComponent>;
  listOfOperaciones: Operacion[] = [];

  searchCriteria: BusquedaOperacion = {
    descripcion: '',
    unidad: 0,
  };

  suscriptions: Array<any> = [];

  constructor(
    private _operacionService: OperacionService,
    private modalService: NzModalService,
    private _notificationService: NotificationService,
    private _modalUploadService: NzModalService
  ) {
    super();
  }

  loadData() {
    this.loading = true;
    this.suscriptions.push(
      this._operacionService.getAll(this.params, this.sort).subscribe({
        next: (operaciones: PagedResourceCollection<Operacion>) => {
          this.loading = false;
          this.listOfOperaciones = [...operaciones.resources];
          this.total = operaciones.totalElements;
        },
        error: (err) => {
          this._notificationService.notificationError(
            'Error',
            'Ha ocurrido un error al cargar las operaciones'
          );
          this.loading = false;
        },
      })
    );
  }

  ngOnInit(): void {
    this.loading = false;
    this.loadData();
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  override showModal(operacionToEdit?: Operacion) {
    const modalTitle = operacionToEdit
      ? 'Editar Operación'
      : 'Agregar Operación';
    const modalRef = this.modalService.create({
      nzTitle: modalTitle,
      nzStyle: { top: '20px' },
      nzMaskClosable: false,
      nzContent: OperacionesFormComponent,
      nzComponentParams: {
        operacionToEdit,
      },
    });
    modalRef.afterClose.subscribe((result) => {
      if (!operacionToEdit) {
        this.suscriptions.push(
          this._operacionService.create(result.newOperacion).subscribe(() => {
            this.loadData();
          })
        );
      } else {
        this.suscriptions.push(
          this._operacionService.put(result.newOperacion).subscribe(() => {
            this.loadData();
          })
        );
      }
    });
  }

  deleteOperacion(operacion: Operacion) {
    this.modalService.confirm({
      nzTitle: 'Confirmación',
      nzContent: `Está seguro de eliminar la operacion ${operacion.descripcion}?`,
      nzOnOk: () => {
        this.suscriptions.push(
          this._operacionService.detele(operacion).subscribe({
            next: () => this.loadData(),
            error: (e) => {
              if (e.status == 500) {
                this._notificationService.notificationError(
                  'Error',
                  e.error.message
                );
              } else {
                this._notificationService.notificationError(
                  'Error',
                  'N se ha podido eliminar la operación.'
                );
              }
            },
          })
        );
      },
    });
  }

  changeUserStatus(operacion: Operacion) {
    operacion.estados =
      operacion.estados?.id === 2
        ? (operacion.estados = comboBox.estados[1] as unknown as Estado)
        : (operacion.estados = comboBox.estados[0] as unknown as Estado);
    this.suscriptions.push(
      this._operacionService.put(operacion).subscribe({
        next: (result) => {
          this.loadData();
        },
        error: (error) => {
          this._notificationService.notificationError(
            'Error',
            'Ha ocurrido un error al cambiar el estado'
          );
        },
      })
    );
  }

  //Search

  isNullBusqueda() {
    return Object.values(this.searchCriteria).every((value) => {
      if (value === null || value === '' || value === 0) {
        return true;
      }
      return false;
    });
  }
  resetForm(): void {
    this.searchCriteria.descripcion = '';
    this.searchCriteria.unidad = 0;
    this.loadData();
  }
  onSearch() {
    if (this.isNullBusqueda()) {
      this.loadData();
    } else {
      this.searchData();
    }
  }
  searchData() {
    this.loading = true;
    this.params.page = 0;
    this.suscriptions.push(
      this._operacionService
        .search(this.searchCriteria, this.params, this.sort)
        .subscribe({
          next: (operaciones: PagedResourceCollection<Operacion>) => {
            this.loading = false;
            this.listOfOperaciones = [];
            if (operaciones.resources.length > 0) {
              this.listOfOperaciones = [...operaciones.resources];
            }
            this.total = operaciones.totalElements;
          },
          error: (err) => {
            this._notificationService.notificationError(
              'Error',
              'Ha ocurrido un error al cargar los usuarios'
            );
            this.listOfOperaciones = [];
            this.total = 0;
            this.loading = false;
          },
        })
    );
  }
  showModalUpload() {
    const modalRef = this._modalUploadService.create({
      nzTitle: 'Importar desde un Fichero',
      nzStyle: { top: '20px' },
      nzMaskClosable: false,
      nzContent: FileUploadModalComponent,
    });
    modalRef.afterClose.subscribe((result) => {});
  }
}
