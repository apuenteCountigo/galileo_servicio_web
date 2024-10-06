import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';

export interface FileNode extends NzTreeNodeOptions {
    checked: boolean;
    key: string;
    title: string;
    isLeaf: boolean;
    children?: FileNode[];
    isExpanded?: boolean;
  }