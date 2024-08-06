import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'passwordMask',
})
export class PasswordMaskPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return '*'.repeat(value.length);
  }
}
