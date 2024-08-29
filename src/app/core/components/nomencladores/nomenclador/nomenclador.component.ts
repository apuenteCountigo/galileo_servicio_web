import { Component, Input, OnInit } from '@angular/core';
import { PagedResourceCollection, Sort } from '@lagoshny/ngx-hateoas-client';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Juzgado } from 'src/app/core/models/juzgado.model';
import { Empleo } from 'src/app/core/models/momencaldores.model';
import { ModeloBaliza } from 'src/app/core/models/momencaldores.model';
import { EmpleoService } from 'src/app/core/services/empleo.service';
import { TableBase } from 'src/app/core/utils/table.base';
import { NomencladorFormComponent } from '../nomenclador-form/nomenclador-form.component';
import { NomencladorService } from './../../../services/nomenclador.service';
import { NomencladorJuzgadosService } from './../../../services/nomencladores/nomenclador-juzgados.service';
import { NomencladorModelosBalizasService } from './../../../services/nomencladores/modelosbalizas.service';
import { NotificationService } from './../../../services/notification.service';

interface BusquedaOperacion {
  descripcion: string | null;
}

@Component({
  selector: 'app-nomenclador',
  templateUrl: './nomenclador.component.html',
  styleUrls: ['./nomenclador.component.less'],
})
export class NomencladorComponent extends TableBase implements OnInit {
  @Input() dataEntrante!: string;
  @Input() dataTitle!: string;
  @Input() dataTooltip!: string;

  //creamos los array para los distintos nomencladores
  listOfNomencladores: any[] = [];

  searchCriteria: BusquedaOperacion = {
    descripcion: '',
  };

  filter = {
    descripcion: '',
  };

  selectedNomenclador: any = null;

  constructor(
    private nomencladorService: NomencladorService,
    private modalService: NzModalService,
    private notificationService: NotificationService,
    private _nomencladorJuzgado: NomencladorJuzgadosService,
    private _nomencladorModelosBalizas: NomencladorModelosBalizasService,
    private _empleoService: EmpleoService
  ) {
    super();
  }

  ngOnInit(): void {}
  override onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    this.sort = {};
    sort.forEach((s) => {
      if (s.value) {
        this.sort[s.key] = s.value == 'ascend' ? 'ASC' : 'DESC';
      }
    });
    this.sort['fechaCreacion'] = 'DESC';
    this.params.page = pageIndex - 1;
    this.params.size = pageSize;
    this.loadDataFromLocal();
  }
  loadDataFromLocal() {
    switch (this.dataEntrante) {
      case 'Juzgado':
        this.loading = true;
        this._nomencladorJuzgado
          .getAll(this.params, this.sort)
          .subscribe((juzgados: PagedResourceCollection<Juzgado>) => {
            this.loading = false;
            this.listOfNomencladores = [...juzgados.resources];
            this.total = juzgados.totalElements;
          });
        break;

        case 'ModelosBalizas':
          this.loading = true;
          this._nomencladorModelosBalizas
            .getAll(this.params, this.sort)
            .subscribe((modeloBaliza: PagedResourceCollection<ModeloBaliza>) => {
              this.loading = false;
              this.listOfNomencladores = [...modeloBaliza.resources];
              this.total = modeloBaliza.totalElements;
            });
          break;
  
        case 'Empleo':
        this.loading = true;
        this._empleoService
          .getAll(this.params, this.sort)
          .subscribe((empleos: PagedResourceCollection<Empleo>) => {
            this.loading = false;
            this.listOfNomencladores = [...empleos.resources];
            this.total = empleos.totalElements;
          });
        break;
      default:
        break;
    }
  }
  override showModal(isEdit?: boolean) {
    const nombreNomenclador = this.dataEntrante;
    const modalTitle = isEdit ? 'Editar nomenclador' : 'Agregar nomenclador';
    const modalRef = this.modalService.create({
      nzTitle: modalTitle,
      nzStyle: { top: '20px' },
      nzMaskClosable: false,
      nzContent: NomencladorFormComponent,
      nzComponentParams: {
        nomencladdor: isEdit ? this.selectedNomenclador : null,
        nombreNomenclador: nombreNomenclador,
      },
    });
    modalRef.afterClose.subscribe((result) => {
      if (!isEdit) {
        switch (this.dataEntrante) {
          case 'Juzgado':
            this._nomencladorJuzgado
              .create(result.nomemcladorAux)
              .subscribe(() => {
                next: (response) => {
                  console.log('Éxito:', response);
                  let msg = isEdit ? 'modificado' : 'agregado';
                  this.notificationService.notificationSuccess(
                    'Información',
                    `El registro ha sido ${msg} satisfactoriamente.`
                  );
                  this.loadDataFromLocal();
                },
                error: (err) => {
                  console.error('Error:', err);
                }
              });
            break;
            case 'ModelosBalizas':
              this._nomencladorModelosBalizas
                .create(result.nomemcladorAux)
                .subscribe(() => {
                  this.loadDataFromLocal();
                });
              break;
            case 'Empleo':
            this._empleoService.create(result.nomemcladorAux).subscribe(() => {
              this.loadDataFromLocal();
            });
            break;
          default:
            break;
        }
      } else {
        switch (this.dataEntrante) {
          case 'Juzgado':
            this._nomencladorJuzgado
              .put(result.nomemcladorAux)
              .subscribe(() => {
                this.loadDataFromLocal();
              });
            break;
          case 'ModelosBalizas':
            this._nomencladorModelosBalizas
              .put(result.nomemcladorAux)
              .subscribe(() => {
                this.loadDataFromLocal();
              });
            break;
          case 'Empleo':
            this._empleoService.put(result.nomemcladorAux).subscribe(() => {
              this.loadDataFromLocal();
            });
            break;
          default:
            break;
        }
      }
    });
  }
  deleteNomenclador() {    
    this.modalService.confirm({
      nzTitle: 'Confirmación',
      nzContent: `¿Está seguro que desea eliminar el elemento, "${this.selectedNomenclador.descripcion}"?`,
      nzOnOk: () => {
        switch (this.dataEntrante) {
          case 'Juzgado':
            this._nomencladorJuzgado
              .detele(this.selectedNomenclador)
              .subscribe({
                next: () => {
                  this.notificationService.notificationSuccess(
                    'Información',
                    'El registro ha sido eliminado satisfactoriamente.'
                  );
                  this.loadDataFromLocal();
                },
                error: (err) => {
                  if (err.status == 409) {
                    this.notificationService.notificationError(
                      'Error',
                      'El registro no puede ser eliminado, por estar en uso.'
                    );
                  } else {
                    this.notificationService.notificationError(
                      'Error',
                      'Ha ocurrido un error al eliminar el registro.'
                    );
                  }
                },
              });
            break;
            case 'ModelosBalizas':
              this._nomencladorModelosBalizas
                .detele(this.selectedNomenclador)
                .subscribe({
                  next: () => {
                    this.notificationService.notificationSuccess(
                      'Información',
                      'El registro ha sido eliminado satisfactoriamente.'
                    );
                    this.loadDataFromLocal();
                  },
                  error: (err) => {
                    if (err.status == 409) {
                      this.notificationService.notificationError(
                        'Error',
                        'El registro no puede ser eliminado, por estar en uso.'
                      );
                    } else {
                      this.notificationService.notificationError(
                        'Error',
                        'Ha ocurrido un error al eliminar el registro.'
                      );
                    }
                  },
                });
              break;
            case 'Empleo':
            // this._empleoService.detele(this.selectedNomenclador).subscribe(() => {
            //   this.loadDataFromLocal();
            // });
            this._empleoService.detele(this.selectedNomenclador).subscribe({
              next: () => {
                this.notificationService.notificationSuccess(
                  'Información',
                  'El registro ha sido eliminado satisfactoriamente.'
                );
                this.loadDataFromLocal();
              },
              error: (err) => {
                if (err.status == 409) {
                  this.notificationService.notificationError(
                    'Error',
                    'El registro no puede ser eliminado, por estar en uso.'
                  );
                } else {
                  this.notificationService.notificationError(
                    'Error',
                    'Ha ocurrido un error al eliminar el registro.'
                  );
                }
              },
            });

            break;
          default:
            break;
        }
        this.expandSet.delete(this.selectedNomenclador.id);
      },
    });
    this.loadDataFromLocal();
  }
  onSearchUnitOfOperaciones(): void {
    // this.loading = true;
    // this._empleoService.filterByType(this.searchCriteria).subscribe({
    //   next: (result) => {
    //     this.listOfNomencladores = [...result.resources];
    //   },
    // });
  }
  resetForm(): void {
    this.searchCriteria.descripcion = '';
    this.loadDataFromLocal();
  }
  onExpandChangeNomenclador(nomenclador: any, checked: boolean): void {
    this.expandSet.clear();
    if (checked) {
      this.expandSet.add(nomenclador.id);
      this.selectedNomenclador = nomenclador;
    } else {
      this.selectedNomenclador = null;
      this.expandSet.delete(nomenclador.id);
    }
  }
}
