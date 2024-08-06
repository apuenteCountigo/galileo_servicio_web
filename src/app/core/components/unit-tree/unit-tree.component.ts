import { Component, OnInit } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';

@Component({
  selector: 'app-unit-tree',
  templateUrl: './unit-tree.component.html',
  styleUrls: ['./unit-tree.component.less'],
})
export class UnitTreeComponent implements OnInit {
  mode = false;
  dark = false;
  menus = [
    {
      level: 1,
      title: 'Unidad 1',
      icon: 'mail',
      open: true,
      selected: false,
      disabled: false,
      children: [
        {
          level: 2,
          title: 'Stock de balizas',
          icon: 'bars',
          open: false,
          selected: false,
          disabled: false,
          children: [
            {
              level: 3,
              title: 'Baliza 11',
              selected: false,
              disabled: false,
            },
            {
              level: 3,
              title: 'Baliza 11',
              selected: false,
              disabled: false,
            },
          ],
        },
        {
          level: 2,
          title: 'Operaciones',
          icon: 'bars',
          open: false,
          selected: false,
          disabled: false,
          children: [
            {
              level: 3,
              title: 'Operacion A',
              selected: false,
              disabled: false,
              children: [
                {
                  level: 4,
                  title: 'Objetivo 1',
                  selected: false,
                  disabled: false,
                },
                {
                  level: 4,
                  title: 'Objetivo 2',
                  selected: false,
                  disabled: false,
                },
              ],
            },
            {
              level: 3,
              title: 'Operacion B',
              selected: false,
              disabled: false,
              children: [
                {
                  level: 4,
                  title: 'Objetivo 3',
                  selected: false,
                  disabled: false,
                },
                {
                  level: 4,
                  title: 'Objetivo 4',
                  selected: false,
                  disabled: false,
                },
                {
                  level: 4,
                  title: 'Objetivo 5',
                  selected: false,
                  disabled: false,
                },
              ],
            },
          ],
        },
      ],
    },
    // {
    //   level: 1,
    //   title: 'Team Group',
    //   icon: 'team',
    //   open: false,
    //   selected: false,
    //   disabled: false,
    //   children: [
    //     {
    //       level: 2,
    //       title: 'User 1',
    //       icon: 'user',
    //       selected: false,
    //       disabled: false,
    //     },
    //     {
    //       level: 2,
    //       title: 'User 2',
    //       icon: 'user',
    //       selected: false,
    //       disabled: false,
    //     },
    //   ],
    // },
  ];

  nodes: NzTreeNodeOptions[] = [];

  constructor() {}

  ngOnInit(): void {
    const dig = (path = '0', level = 4): NzTreeNodeOptions[] => {
      const list = [];
      for (let i = 0; i < 2; i += 1) {
        const key = `${path}-${i}`;
        const treeNode: NzTreeNodeOptions = {
          title: key,
          key,
          expanded: true,
          children: [],
          isLeaf: false,
        };

        if (level > 0) {
          treeNode.children = dig(key, level - 1);
        } else {
          treeNode.isLeaf = true;
        }

        list.push(treeNode);
      }
      return list;
    };

    this.nodes = dig();
  }
}
