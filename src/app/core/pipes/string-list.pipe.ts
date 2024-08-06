import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringList',
})
export class StringListPipe implements PipeTransform {
  transform(list: any[], ...args: unknown[]): any {
    let response: string | null | undefined;

    if (list.length > 0) {
      list.map((item) => {
        if (response === undefined) {
          response = item.descripcion;
        } else {
          response = response + ', ' + item.descripcion;
        }
      });
    } else {
      response = 'No definido';
    }
    return response;
  }
}
