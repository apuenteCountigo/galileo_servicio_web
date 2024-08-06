import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.less'],
})
export class TestComponent implements OnInit {
  @Input() data?: string;

  constructor(private modal: NzModalRef) {}

  ngOnInit(): void {}
}
