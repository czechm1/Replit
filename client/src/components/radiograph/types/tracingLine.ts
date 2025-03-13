export interface TracingLine {
  id: string;
  name: string;
  pathData: string;
  color: string;
  strokeWidth: number;
  strokeDasharray: string | null;
  transform: string;
}

export interface TracingLinesResponse {
  status: string;
  message: string;
  data: TracingLine[];
} 