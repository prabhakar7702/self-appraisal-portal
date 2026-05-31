export type UserRole = 'Employee' | 'Manager' | 'HRAdmin';

export interface IEmployee {
  id: number;
  empId: string;
  firstName: string;
  lastName: string;
  email: string;
  designation: string;
  department: string;
  businessUnit: string;
  reportingManager: string;
  dateOfJoining: string;
  role: UserRole;
  employeeName: string;
  designationTitle: string;
  employeeId: string;
  designationId: number;
}
