export interface IQuestion {
  id: number;
  question: string;
}

export interface IQAResponse {
  id: number;
  appraisalResponseId: number;
  questionId: number;
  question?: string;
  answer: string;
}
