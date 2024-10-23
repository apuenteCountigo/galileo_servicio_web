import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';
import { User } from 'src/app/core/models/users.model';
import { FileUploadModalComponent } from '../../components/file-upload-modal/file-upload-modal.component';
import { UserMainTableComponent } from '../../components/user/user-main-table/user-main-table.component';
import { LoggedUserRole } from '../../enums/user-role.enum';
import { LoggedUser } from '../../models/interfaces';
import { BreadCrumbService } from '../../services/bread-crumb.service';
import { LoggedUserService } from '../../services/logged-user.service';
import * as MockComboBox from '../../utils/mockData.json';
import { TableBase } from '../../utils/table.base';

interface BusquedaUsuario {
  nombre: string | null;
  apellidos: string | null;
  perfil?: number;
}

export const listOfPerfiles = [
  {
    id: 1,
    descripcion: 'Super administrador',
  },
  {
    id: 2,
    descripcion: 'Administrador de unidad',
  },
  {
    id: 3,
    descripcion: 'Usuario final',
  },
  {
    id: 4,
    descripcion: 'Usuario invitado externo',
  },
];

const comboBox = MockComboBox;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less'],
})
export class UsersComponent extends TableBase implements OnInit {
  userEstado!: number;
  asignar = true;
  unitLoading!: boolean;
  unidades = true;
  selectedIndex = 0;
  userModalRef!: NzModalRef<UsersComponent>;
  listOfUser: User[] = [];
  listOfUserUnidades: any = [];
  selectedUser!: User;
  listOfAllUnidades: any;

  listOfPerfiles = [...listOfPerfiles];

  unitSearchByDenominacion = '';

  searchCriteria: BusquedaUsuario = {
    nombre: '',
    apellidos: '',
    perfil: 0,
  };
  loggedUser!: LoggedUser;

  // @ViewChild('userTable') userTableCmp!: UserMainTableComponent;
  @ViewChild('userTable', { static: false }) userTableCmp!: UserMainTableComponent;

  constructor(
    private modalUploadService: NzModalService,
    private _breadrumbService: BreadCrumbService,
    private loggedUserService: LoggedUserService
  ) {
    super();
  }

  ngOnInit(): void {
    this.updateBreadCrumb('usurioUsuario');
    this.loggedUser = this.loggedUserService.getLoggedUser();
    this.loggedUser.perfil.descripcion == LoggedUserRole.SUPER_ADMIN;
  }

  showModalUpload() {
    const modalRef = this.modalUploadService.create({
      nzTitle: 'Importar desde un Fichero',
      nzStyle: { top: '20px' },
      nzMaskClosable: false,
      nzContent: FileUploadModalComponent,
    });
    modalRef.afterClose.subscribe((result) => { });
  }

  updateBreadCrumb(valor: any, seleccionado?: any) {
    this._breadrumbService.updateBreadCrumb.emit({
      valor: valor,
      seleccionado: this.selectedIndex
        ? this.selectedUser?.nombre
        : seleccionado,
    });

    // Verifica si userTableCmp ya está inicializado antes de llamar a loadData
    // if (this.userTableCmp) {
    //   this.userTableCmp.loadData();
    // }
  }

  onSelectUser(user: User) {
    this.selectedUser = user;
  }

  isSuperAdmin() {
    if (this.selectedUser) {
      return this.selectedUser.perfil.descripcion == LoggedUserRole.SUPER_ADMIN;
    }
    return false;
  }

  onTabChange(event: NzTabChangeEvent): void {
    if (event.index === 0 && this.userTableCmp) {
      // Refresca el componente app-user-main-table
      this.userTableCmp.refreshUsers();
    }
  }
}
