export type UserRole = 'Employee' | 'Manager' | 'HRAdmin';

export interface IEmployee {
  id: number;
  employeeId: string;
  employeeName: string;
  email: string;
  designationId: number;
  designationTitle: string;
  department: string;
  reportingManager: string;
  projectManager: string;
  role: UserRole;
  isActive: boolean;
}

