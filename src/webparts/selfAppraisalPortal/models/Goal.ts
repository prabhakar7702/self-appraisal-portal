export type GoalPriority = 'High' | 'Medium' | 'Low';

export interface IEmployeeGoal {
  id: number;
  goal: string;
  description: string;
  priority: GoalPriority;
  startDate?: string;
  dueDate?: string;
  kraId: number;
  progress: number;
  appraisalResponseId?: number;
  designationKraId?: number;
  goalTitle: string;
  goalDescription: string;
  targetOutcome?: string;
  isDeleted?: boolean;
  isMandatory?: boolean;
}

export interface IGoalResponse {
  id: number;
  appraisalResponseId: number;
  goalId: number;
  selfRating: number;
  selfComments: string;
}
