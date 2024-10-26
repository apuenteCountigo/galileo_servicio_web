import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { TipoServidor } from 'src/app/core/enums/conexiones.enum';
import { FrmActions } from 'src/app/core/enums/form-acctios';
import { Server } from 'src/app/core/models/server.model';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ButtonInterface } from '../../user/user-form/user-form.component';

@Component({
  selector: 'app-data-miner-form',
  templateUrl: './data-miner-form.component.html',
  styleUrls: ['./data-miner-form.component.less'],
})
export class DataMinerFormComponent implements OnInit {
  @Input() serverToEdit?: Server;

  formModalServer: FormGroup;

  button: ButtonInterface = {
    label: 'AGREGAR',
    icon: 'plus',
  };

  tipoServidor = TipoServidor;

  tipoServicio = ['TRACCAR', 'DATAMINER', 'FTP'];

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private _notificationService: NotificationService
  ) {
    this.formModalServer = this.fb.group({
      servicio: ['', [Validators.required]],
      ipServicio: ['', [Validators.required]],
      puerto: ['', []],
      usuario: ['', [Validators.pattern, Validators.required]],
      password: ['', [Validators.required]],
      mapAddress: ['', []],
      dmaID: ['', []],
      viewIDs: ['', []],
    });
  }

  ngAfterViewInit(): void {
    if (this.serverToEdit) {
      this.button.label = 'EDITAR';
      this.button.icon = 'edit';
      Promise.resolve().then(() => {
        this.formModalServer.controls['servicio'].setValue(
          this.serverToEdit!.servicio
        );
        this.formModalServer.controls['ipServicio'].setValue(
          this.serverToEdit!.ipServicio
        );
        this.formModalServer.controls['puerto'].setValue(
          this.serverToEdit!.puerto
        );
        this.formModalServer.controls['usuario'].setValue(
          this.serverToEdit!.usuario
        );
        this.formModalServer.controls['password'].setValue(
          this.serverToEdit!.password
        );
        this.formModalServer.controls['mapAddress'].setValue(
          this.serverToEdit!.mapAddress
        );
        this.formModalServer.controls['dmaID'].setValue(
          this.serverToEdit!.dmaID
        );
        this.formModalServer.controls['viewIDs'].setValue(
          this.serverToEdit!.viewIDs
        );
        this.updateValidators();
      });
    }
  }

  ngOnInit(): void {}

  checkForm() {
    return this.formModalServer.invalid ? true : false;
  }

  checkFormEdit(){
    return this.serverToEdit ? true : false;
  }

  submitForm() {
    const newServer = { ...this.serverToEdit };
    newServer.servicio = this.formModalServer.value.servicio;
    newServer.ipServicio = this.formModalServer.value.ipServicio;
    newServer.puerto = this.formModalServer.value.puerto;
    newServer.usuario = this.formModalServer.value.usuario;
    newServer.password = this.formModalServer.value.password;
    newServer.mapAddress = this.formModalServer.value.mapAddress;
    newServer.dmaID = this.formModalServer.value.dmaID;
    newServer.viewIDs = this.formModalServer.value.viewIDs;

    const accion = this.serverToEdit ? FrmActions.EDITAR : FrmActions.AGREGAR;

    this.modalRef.close({ accion, newServer });
  }

  closeForm() {
    this.modalRef.close({ accion: FrmActions.CANCELAR });
  }

  updateValidators() {
    if (this.formModalServer.value.servicio == 'DATAMINER') {
      this.formModalServer.controls['dmaID'].setValidators([
        Validators.required,
      ]);
      this.formModalServer.controls['viewIDs'].setValidators([
        Validators.required,
      ]);
    } else {
      this.formModalServer.controls['dmaID'].clearValidators();
      this.formModalServer.controls['viewIDs'].clearValidators();
    }

    if (this.formModalServer.value.servicio == 'TRACCAR') {
      this.formModalServer.controls['mapAddress'].setValidators([
        Validators.required,
      ]);
    } else {
      this.formModalServer.controls['mapAddress'].clearValidators();
    }

    this.formModalServer.controls['dmaID'].updateValueAndValidity();
    this.formModalServer.controls['viewIDs'].updateValueAndValidity();
    this.formModalServer.controls['mapAddress'].updateValueAndValidity();
  }
}
