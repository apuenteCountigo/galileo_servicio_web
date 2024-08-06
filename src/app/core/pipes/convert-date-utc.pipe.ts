import { format } from 'date-fns';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertDateUTC'
})
export class ConvertDateUTCPipe implements PipeTransform {

  transform(value: any): any {    
    let fecha = new Date(value);
    return fecha.toLocaleString() ;
  }

}
