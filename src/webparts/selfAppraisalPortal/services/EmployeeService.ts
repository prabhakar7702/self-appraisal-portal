import { LISTS } from '../constants/ListNames';
import { IEmployee } from '../models/Employee';
import { SharePointRestService } from './SharePointRestService';

export class EmployeeService {
  private restService: SharePointRestService;

  public constructor(restService: SharePointRestService) {
    this.restService = restService;
  }

  public async getCurrentEmployee(userEmail: string): Promise<IEmployee> {
    const safeEmail = userEmail.replace(/'/g, "''");
    const items = await this.restService.getItems<any>(LISTS.EmployeeData, `?$filter=Email eq '${safeEmail}'&$top=1`);
    const item = items[0];
    const firstName = item.FirstName || '';
    const lastName = item.LastName || '';
    const employeeName = `${firstName} ${lastName}`.trim();
    return {
      id: item.Id,
      empId: item.EmpID || '',
      firstName: firstName,
      lastName: lastName,
      email: item.Email || userEmail,
      designation: item.Designation || '',
      department: item.Department || '',
      businessUnit: item.BusinessUnit || '',
      reportingManager: item.ReportingManager || '',
      dateOfJoining: item.DateOfJoining || '',
      role: (item.Role || 'Employee') as 'Employee' | 'Manager' | 'HRAdmin',
      employeeName: employeeName || item.Title || '',
      designationTitle: item.Designation || '',
      employeeId: item.EmpID || '',
      designationId: item.DesignationId || 0
    };
  }
}
