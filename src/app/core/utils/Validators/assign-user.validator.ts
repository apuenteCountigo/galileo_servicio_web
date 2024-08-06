import { Injector } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UserSearchQuery } from '../../constants/user.query';
import { UserService } from '../../services/user.service';

export function ValidateTip(control: AbstractControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const query: UserSearchQuery = new UserSearchQuery();
    const options = {
      providers: [{ provide: UserService, useClass: UserService, deps: [] }],
    };
    let injector = Injector.create(options);
    // let injector = Injector.create([
    //   { provide: UserService, useClass: UserService, deps: [] },
    // ]);
    let service = injector.get(UserService);
    service.searchBy(query.BUSCAR_TIP, control.value).subscribe((result) => {
      if (result) {
        return { isInvalidTip: true };
      }
      return null;
    });
    return null;
  };
}
