export interface TableConfiguration {
  name: string;
  required: boolean;
  label: string;
  align: 'left' | 'right' | 'center';
  field: 'string' | Function;
}
