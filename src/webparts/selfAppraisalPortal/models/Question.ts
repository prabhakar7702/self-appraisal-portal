export interface IQuestion {
  id: number;
  question: string;
}

export interface IQAResponse {
  id: number;
  appraisalHeaderId: number;
  questionId: number;
  answer: string;
}

