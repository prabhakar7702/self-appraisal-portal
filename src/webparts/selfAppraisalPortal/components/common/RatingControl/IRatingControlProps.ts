export interface IRatingControlProps {
  value: number;
  label: string;
  readOnly?: boolean;
  onChange?: (value: number) => void;
}

