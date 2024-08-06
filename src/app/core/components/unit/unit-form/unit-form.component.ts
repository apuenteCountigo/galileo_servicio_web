import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FrmActions } from 'src/app/core/enums/form-acctios';
import { ButtonInterface } from 'src/app/core/models/interfaces';
import { UnitProvince } from 'src/app/core/models/province.model';
import { Unit } from 'src/app/core/models/unit.model';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UnitService } from 'src/app/core/services/unit.service';

@Component({
  selector: 'app-unit-form',
  templateUrl: './unit-form.component.html',
  styleUrls: ['./unit-form.component.less'],
})
export class UnitFormComponent implements OnInit, OnDestroy {
  @Input() unitToEdit?: Unit | null;
  @Input() provList?: any[] = [];

  formModalUnit: FormGroup;

  buttonSending = false;

  button: ButtonInterface = {
    label: 'AGREGAR',
    icon: 'plus',
  };

  suscriptions: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private _unitService: UnitService,
    private notificationService: NotificationService
  ) {
    this.formModalUnit = this.fb.group({
      denominacion: ['', [Validators.required, Validators.maxLength(50)]],
      responsable: ['', [Validators.required, Validators.maxLength(50)]],
      groupWise: ['', [Validators.maxLength(25)]],
      email: ['', [Validators.pattern]], //Validators.email,
      direccion: ['', [Validators.maxLength(50)]],
      codigoPostal: ['', [Validators.minLength(5), Validators.pattern]],
      notas: ['', null],
      localidad: ['', [Validators.maxLength(45)]],
      provincia: ['', null],
      telefono: ['', [Validators.required, Validators.pattern]],
      tmpUsuario: ['', null],
    });
  }

  ngOnInit(): void {
    if (this.unitToEdit) {
      this.button.label = 'EDITAR';
      this.button.icon = 'edit';
      Promise.resolve().then(() => {
        this.formModalUnit.controls['denominacion'].setValue(
          this.unitToEdit!.denominacion
        );
        this.formModalUnit.controls['groupWise'].setValue(
          this.unitToEdit!.groupWise
        );
        this.formModalUnit.controls['email'].setValue(this.unitToEdit!.email);
        this.formModalUnit.controls['direccion'].setValue(
          this.unitToEdit!.direccion
        );
        this.formModalUnit.controls['codigoPostal'].setValue(
          this.unitToEdit!.codigoPostal
        );
        this.formModalUnit.controls['notas'].setValue(this.unitToEdit!.notas);
        this.formModalUnit.controls['responsable'].setValue(
          this.unitToEdit!.responsable
        );
        this.formModalUnit.controls['localidad'].setValue(
          this.unitToEdit?.localidad
        );
        this.formModalUnit.controls['telefono'].setValue(
          this.unitToEdit?.telefono
        );
        this.formModalUnit.controls['provincia'].setValue(
          this.provList?.find(
            (prov) => prov.descripcion == this.unitToEdit!.provincia.descripcion
          )
        );
        // this.formModalUnit.controls['tmpUsuario'].setValue(
        //   this.unitToEdit!.tmpUsuario
        // );
      });
    }
    // Promise.resolve().then(() => {
    //   this.formModalUnit.controls['estado'].setValue(this.unitState[0]);
    // });
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }

  checkForm() {
    return this.formModalUnit.invalid ? true : false;
  }

  submitForm(): void {
    this.buttonSending = true;
    const newUnit = { ...this.unitToEdit };
    (newUnit.denominacion = this.formModalUnit.value.denominacion),
      (newUnit.groupWise = this.formModalUnit.value.groupWise),
      (newUnit.email = this.formModalUnit.value.email),
      (newUnit.direccion = this.formModalUnit.value.direccion),
      (newUnit.codigoPostal = this.formModalUnit.value.codigoPostal),
      (newUnit.notas = this.formModalUnit.value.notas),
      (newUnit.responsable = this.formModalUnit.value.responsable),
      (newUnit.localidad = this.formModalUnit.value.localidad),
      (newUnit.telefono = this.formModalUnit.value.telefono),
      (newUnit.provincia = this.formModalUnit.value.provincia
        ? ({
            id: this.formModalUnit.value.provincia.id,
          } as UnitProvince)
        : undefined);
    // newUnit.tmpUsuario = this.formModalUnit.value.tmpUsuario;

    if (!this.unitToEdit) {
      this.suscriptions.push(
        this._unitService.create(newUnit as Unit).subscribe({
          next: () => {
            this.buttonSending = false;
            this.notificationService.notificationSuccess(
              'Información',
              'Se ha creado la unidad correctamente.'
            );
            this.modalRef.close({ accion: FrmActions.AGREGAR });
          },
          error: (err) => {
            this.buttonSending = false;
            this.handleErrorMessage(
              err,
              'Ha ocurrido un error al crear la unidad.'
            );
          },
        })
      );
    } else {
      this.suscriptions.push(
        this._unitService.put(newUnit as Unit).subscribe({
          next: () => {
            this.buttonSending = false;
            this.notificationService.notificationSuccess(
              'Información',
              'Se ha actualizado la unidad correctamente.'
            );
            this.modalRef.close({ accion: FrmActions.EDITAR });
          },
          error: (err) => {
            this.buttonSending = false;
            this.handleErrorMessage(
              err,
              'Ha ocurrido un error al actualizar la unidad.'
            );
          },
        })
      );
    }
  }

  cancelForm(): void {
    this.modalRef.close({ accion: FrmActions.CANCELAR });
  }

  getOficialFullName(oficial: any): string {
    let result = '';
    oficial.nombre ? (result = oficial.nombre) : null;
    oficial.apellidos ? (result = result + ' ' + oficial.apellidos) : null;
    return result;
  }

  handleErrorMessage(error: any, defaultMsg: string): void {
    if (error.status == 400) {
      this.notificationService.notificationError(
        'Error',
        error.error.message.toLowerCase()
      );
    } else if (error.status == 409) {
      if (error.error.message.toLowerCase().includes('could not execute')) {
        this.notificationService.notificationError(
          'Error',
          // error.error.message.toLowerCase()
          'La Denominación ya exite en el sistema.'
        );
      } else {
        this.notificationService.notificationError(
          'Error',
          // error.error.message.toLowerCase()
          'No se puede eliminar la unidad ya que tiene operaciones y objetivos activos.'
        );
      }
    } else if (error.status == 500) {
      this.notificationService.notificationError(
        'Error',
        error.error.message.toLowerCase()
      );
    } else {
      this.notificationService.notificationError('Error', defaultMsg);
    }
  }
}
