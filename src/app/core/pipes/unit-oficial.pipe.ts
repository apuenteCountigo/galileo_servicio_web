import { User } from './../models/users.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unitOficial',
})
export class UnitOficialPipe implements PipeTransform {
  // transform(value: User, ...args: unknown[]): string {
  //   let job, name, response: string | null | undefined;

  //   value.empleos ? (job = value.empleos.descripcion) : null;
  //   value.nombre ? (name = value.nombre) : null;
  //   value.apellidos ? (name = name + ' ' + value.apellidos) : null;

  //   response = job + ' - ' + name;
  //   return response;
  // }
  transform(value: User[], ...args: unknown[]): string {
    let job, name, response: string | null | undefined;

    const userResp = value.find(
      (u) => u.perfil.descripcion === 'Administrador de unidad'
    );
    if (userResp) {
      userResp.empleos ? (job = userResp.empleos.descripcion) : null;
      userResp.nombre ? (name = userResp.nombre) : null;
      userResp.apellidos ? (name = name + ' ' + userResp.apellidos) : null;

      response = job + ' - ' + name;
    } else {
      response = 'No definido';
    }
    return response;
  }
}
