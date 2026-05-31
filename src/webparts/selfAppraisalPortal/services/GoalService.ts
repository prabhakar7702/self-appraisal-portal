import { LISTS } from '../constants/ListNames';
import { IEmployeeGoal } from '../models/Goal';
import { IDesignationKRAMapping } from '../models/KRA';
import { mockGoals, mockMappings } from './MockData';
import { SharePointService } from './SharePointService';

export class GoalService {
  public static async getDesignationKras(designationId: number): Promise<IDesignationKRAMapping[]> {
    const mappings = await SharePointService.getItems<IDesignationKRAMapping>(LISTS.DesignationKRAMapping, mockMappings);
    return mappings
      .filter(mapping => mapping.designationId === designationId && mapping.isActive)
      .sort((first, second) => first.displayOrder - second.displayOrder);
  }

  public static async getGoals(appraisalHeaderId: number): Promise<IEmployeeGoal[]> {
    const goals = await SharePointService.getItems<IEmployeeGoal>(LISTS.EmployeeGoals, mockGoals);
    return goals.filter(goal => goal.appraisalHeaderId === appraisalHeaderId && !goal.isDeleted);
  }

  public static async saveGoal(goal: IEmployeeGoal): Promise<IEmployeeGoal> {
    return SharePointService.saveItem<IEmployeeGoal>(LISTS.EmployeeGoals, mockGoals, goal);
  }
}

