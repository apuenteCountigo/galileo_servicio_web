import { Sort } from '@lagoshny/ngx-hateoas-client';
import { PageParam } from '@lagoshny/ngx-hateoas-client/lib/model/declarations';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { LoggedUserRole } from '../enums/user-role.enum';

export class TableBase {
  expandSet = new Set<number | string>();

  showSearchForm = false;

  public userRoles: typeof LoggedUserRole = LoggedUserRole;

  size: NzButtonSize = 'default';
  total = 0;
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  sort!: Sort;
  // sort: Sort = {
  //   'u.fechaCreacion': 'DESC',
  //   fechaAlta: 'DESC',
  // };
  params: PageParam = {
    page: this.pageIndex - 1,
    size: this.pageSize,
  };

  constructor() {}

  showModal() {}

  onQueryParamsChange(params: NzTableQueryParams): void {}

  onExpandChange(id: number | string, checked: boolean): void {
    if (checked) {
      this.expandSet.clear();
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  showHideSearchForm() {
    this.showSearchForm = !this.showSearchForm;
  }
}
