import { Pageable } from "./Pageable";
import { Sort } from "./sort";

export interface PageableObjectResponse {
    content: string[];
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
  }