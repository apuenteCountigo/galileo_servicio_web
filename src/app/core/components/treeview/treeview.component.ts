import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.less'],
})
export class TreeviewComponent implements OnInit {
  nodes = [
    {
      title: 'parent 1',
      key: '100',
      children: [
        {
          title: 'parent 1-0',
          key: '1001',
          children: [
            {
              title: 'leaf 1-0-0',
              key: '10010',
              isLeaf: true,
              value: { id: 3 },
            },
            {
              title: 'leaf 1-0-1',
              key: '10011',
              isLeaf: true,
              value: { id: 4 },
            },
          ],
        },
        {
          title: 'parent 1-1',
          key: '1002',
          children: [{ title: 'leaf 1-1-0', key: '10020', isLeaf: true }],
        },
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  onExpandChange(event: any) {}
  onClick(event: any) {}
}
