export interface Sort {
  by: string;
  desc: boolean;
}
export type SortType = Sort | null;

export type TableVariant = 'compact' | 'normal';

export type OptionListItem = {
  value: string;
  label: string;
  color?: string;
};

export type ColumnMetaType = {
  label: string;
  width: string;
  sortable: boolean;
  data_type: DataType;
  ressource_collection?: string;
  table_variant?: TableVariant;
  options_list?: OptionListItem[];
};

export type DataType =
  | 'string'
  | 'date'
  | 'ressource_id'
  | 'date_time'
  | 'list';

export interface SQLPanelFields {
  sql: string;
  default_column_width: string;
  columns_meta: ColumnMetaType[];
  is_using_entity_id: boolean;
  table_variant: TableVariant;
}
