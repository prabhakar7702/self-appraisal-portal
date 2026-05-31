import { IDesignationKRAMapping } from '../models/KRA';
import { IEmployeeGoal, IGoalResponse } from '../models/Goal';

export interface IKraRating {
  mappingId: number;
  rating: number;
  weightage: number;
}

export class RatingHelper {
  public static getKraRating(mappingId: number, goals: IEmployeeGoal[], responses: IGoalResponse[]): number {
    const kraGoals = goals.filter(goal => goal.designationKraId === mappingId && !goal.isDeleted);
    if (kraGoals.length === 0) {
      return 0;
    }

    const ratings = kraGoals
      .map(goal => responses.filter(response => response.goalId === goal.id)[0])
      .filter(Boolean)
      .map(response => response.selfRating);

    if (ratings.length === 0) {
      return 0;
    }

    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  }

  public static getKraRatings(mappings: IDesignationKRAMapping[], goals: IEmployeeGoal[], responses: IGoalResponse[]): IKraRating[] {
    return mappings.map(mapping => ({
      mappingId: mapping.id,
      weightage: mapping.weightage,
      rating: this.getKraRating(mapping.id, goals, responses)
    }));
  }

  public static getFinalRating(mappings: IDesignationKRAMapping[], goals: IEmployeeGoal[], responses: IGoalResponse[]): number {
    const ratings = this.getKraRatings(mappings, goals, responses);
    const weightedTotal = ratings.reduce((sum, rating) => sum + rating.rating * rating.weightage, 0);
    return Math.round((weightedTotal / 100) * 10) / 10;
  }
}

