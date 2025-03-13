export interface AnalysisLine {
  id: string;
  name: string;
  pathData: string;
  color: string;
  strokeWidth: number;
  strokeDasharray: string | null;
  transform: string;
}

export interface AnalysisLinesResponse {
  status: string;
  message: string;
  data: AnalysisLine[];
} 