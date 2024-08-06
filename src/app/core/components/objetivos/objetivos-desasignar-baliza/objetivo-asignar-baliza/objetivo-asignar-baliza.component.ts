import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ButtonInterface } from '../../../user/user-form/user-form.component';

@Component({
  selector: 'app-objetivo-asignar-baliza',
  templateUrl: './objetivo-asignar-baliza.component.html',
  styleUrls: ['./objetivo-asignar-baliza.component.less'],
})
export class ObjetivoAsignarBalizaComponent implements OnInit {
  @Input() listEstados!: any[];

  formModalAsignarBaiza: FormGroup;
  button: ButtonInterface = {
    label: 'Aceptar',
    icon: 'plus',
  };

  constructor(private fb: FormBuilder, private modalRef: NzModalRef) {
    this.formModalAsignarBaiza = this.fb.group({
      items: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}
  submitForm() {
    let id = this.formModalAsignarBaiza.value.items;
    this.modalRef.close({ id, accion: this.button.label });
  }

  checkForm() {
    return this.formModalAsignarBaiza.invalid ? true : false;
  }

  closeForm() {
    this.modalRef.close({ accion: 'CANCELAR' });
  }
}
