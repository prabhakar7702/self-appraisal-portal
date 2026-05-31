export type GoalPriority = 'High' | 'Medium' | 'Low';

export interface IEmployeeGoal {
  id: number;
  appraisalHeaderId: number;
  designationKraId: number;
  goalTitle: string;
  goalDescription: string;
  priority: GoalPriority;
  targetOutcome: string;
  progress: number;
  isDeleted: boolean;
}

export interface IGoalResponse {
  id: number;
  appraisalHeaderId: number;
  goalId: number;
  selfRating: number;
  selfComments: string;
}

