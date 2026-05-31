import { APP_CONSTANTS } from '../constants/AppConstants';
import { MESSAGES } from '../constants/Messages';
import { IEmployeeGoal, IGoalResponse } from '../models/Goal';
import { IDesignationKRAMapping } from '../models/KRA';
import { IQAResponse } from '../models/Question';

export class ValidationHelper {
  public static hasGoalForEveryKra(mappings: IDesignationKRAMapping[], goals: IEmployeeGoal[]): boolean {
    return mappings.every(mapping => goals.some(goal => (goal.designationKraId || goal.kraId) === mapping.id && !goal.isDeleted));
  }

  public static canSubmit(mappings: IDesignationKRAMapping[], goals: IEmployeeGoal[], responses: IGoalResponse[], qaResponses: IQAResponse[]): boolean {
    const allKrasHaveGoals = this.hasGoalForEveryKra(mappings, goals);
    const activeGoals = goals.filter(goal => !goal.isDeleted);
    const goalsComplete = activeGoals.every(goal => {
      const response = responses.filter(item => item.goalId === goal.id)[0];
      return !!response &&
        goal.progress >= 0 &&
        response.selfRating >= APP_CONSTANTS.MinRating &&
        response.selfRating <= APP_CONSTANTS.MaxRating &&
        response.selfComments.trim().length > 0;
    });
    const questionsComplete = qaResponses.every(response => response.answer.trim().length > 0);

    return allKrasHaveGoals && activeGoals.length > 0 && goalsComplete && questionsComplete;
  }

  public static validatePdf(file: File): string {
    const lowerName = file.name.toLowerCase();
    if (file.type !== 'application/pdf' && lowerName.substr(lowerName.length - 4) !== '.pdf') {
      return MESSAGES.PdfOnly;
    }

    if (file.size > APP_CONSTANTS.MaxPdfSizeMb * 1024 * 1024) {
      return MESSAGES.FileTooLarge;
    }

    return '';
  }
}
