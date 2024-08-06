import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FrmActions } from '../../enums/form-acctios';
import { ButtonInterface } from '../../models/interfaces';
import { Juzgado } from '../../models/juzgado.model';

@Component({
  selector: 'app-juzgados-form',
  templateUrl: './juzgados-form.component.html',
  styleUrls: ['./juzgados-form.component.less'],
})
export class JuzgadosFormComponent implements OnInit, AfterViewInit {
  @Input() juzgadoToEdit?: Juzgado;

  formModalJuzgado!: FormGroup;

  button: ButtonInterface = {
    label: 'AGREGAR',
    icon: 'plus',
  };

  constructor(private fb: FormBuilder, private modalRef: NzModalRef) {
    this.formModalJuzgado = fb.group({
      juzgado: ['', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    if (this.juzgadoToEdit) {
      this.button.label = 'EDITAR';
      this.button.icon = 'edit';
      Promise.resolve().then(() => {
        this.formModalJuzgado.controls['juzgado'].setValue(
          this.juzgadoToEdit!.descripcion
        );
      });
    }
  }

  checkForm() {
    return this.formModalJuzgado.invalid ? true : false;
  }

  closeForm() {
    this.modalRef.close({ accion: FrmActions.CANCELAR });
  }

  submitForm() {
    const newJuzgado = { ...this.juzgadoToEdit };
    newJuzgado.descripcion = this.formModalJuzgado.value.juzgado;

    this.modalRef.close({ newJuzgado, accion: this.button.label });
  }

  ngOnInit(): void {}
}
