export interface AdminFormFields {
  label: string;
  type: string;
  name: string;
  value: any;
  placeholder?: string;
  required: boolean;
  prefix?: string;
  options?: any[];
  baseOptions?: any[];
  filteredOptions?: any[];
  id?: number | null;
  hiddenOptions?: boolean;
  filterBy?: string;
}
