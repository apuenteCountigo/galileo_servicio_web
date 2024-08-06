import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/users.model';

@Pipe({
  name: 'userTrace'
})
export class UserTracePipe implements PipeTransform {

  transform(user: User, ...args: unknown[]): unknown {
    let tip, role, response: string | null | undefined;


    if (user) {
      user.tip ? (tip = user.tip) : null;
      user.perfil ? (role = user.perfil.descripcion) : null;
      response = tip + ' - ' + role;
    } else {
      response = 'No definido';
    }
    return response;
  }

}
