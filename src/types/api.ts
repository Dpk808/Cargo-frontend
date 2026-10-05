export interface ApiError {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

export interface TableColumn<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T, index: number) => React.ReactNode;
}
