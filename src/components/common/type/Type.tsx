export interface TableData {
  id: number;
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}
export interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}
