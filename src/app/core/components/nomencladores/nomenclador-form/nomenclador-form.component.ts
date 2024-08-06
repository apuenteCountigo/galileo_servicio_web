import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Empleo } from 'src/app/core/models/momencaldores.model';
import { ButtonInterface } from '../../user/user-form/user-form.component';
import { Juzgado } from './../../../models/juzgado.model';

@Component({
  selector: 'app-nomenclador-form',
  templateUrl: './nomenclador-form.component.html',
  styleUrls: ['./nomenclador-form.component.less'],
})
export class NomencladorFormComponent implements OnInit {
  @Input() nomencladdor?: any; //para saber si el formulario es llamado para editar o para insertar
  @Input() nombreNomenclador?: any;

  button: ButtonInterface = {
    label: 'AGREGAR',
    icon: 'plus',
  };

  formModalNomenclador: FormGroup;

  constructor(
    private formNomenclador: FormBuilder, //injectamos FormBuilder para crear el formulario
    private modalRef: NzModalRef
  ) {
    this.formModalNomenclador = this.formNomenclador.group({
      descripcion: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.nomencladdor) {
      this.button.label = 'EDITAR';
      this.button.icon = 'edit';
      Promise.resolve().then(() => {
        this.formModalNomenclador.controls['descripcion'].setValue(
          this.nomencladdor!.descripcion
        );
      });
    }
  }

  checkForm() {
    return this.formModalNomenclador.invalid ? true : false;
  }

  submitForm() {
    let nomemcladorAux;
    if (this.nomencladdor) {
      nomemcladorAux = { ...this.nomencladdor };
    } else {
      switch (this.nombreNomenclador) {
        case 'Juzgado':
          nomemcladorAux = new Juzgado();
          break;
        case 'Empleo':
          nomemcladorAux = new Empleo();
          break;
        default:
          break;
      }
    }
    nomemcladorAux.descripcion = this.formModalNomenclador.value.descripcion;
    this.modalRef.close({ nomemcladorAux, accion: this.button.label });
  }

  closeForm() {
    this.modalRef.close({ accion: 'CANCELAR' });
  }
}
