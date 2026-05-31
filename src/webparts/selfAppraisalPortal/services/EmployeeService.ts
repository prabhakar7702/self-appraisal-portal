import { LISTS } from '../constants/ListNames';
import { IEmployee } from '../models/Employee';
import { mockEmployee } from './MockData';
import { SharePointService } from './SharePointService';

export class EmployeeService {
  public static async getCurrentEmployee(displayName: string): Promise<IEmployee> {
    const employees = await SharePointService.getItems<IEmployee>(LISTS.EmployeeData, [{
      ...mockEmployee,
      employeeName: displayName || mockEmployee.employeeName
    }]);
    return employees[0];
  }
}

