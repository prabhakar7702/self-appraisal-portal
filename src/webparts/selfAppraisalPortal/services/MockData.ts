import { IAppraisalCycle, IAppraisalDocument, IAppraisalHeader } from '../models/Appraisal';
import { IEmployee } from '../models/Employee';
import { IEmployeeGoal, IGoalResponse } from '../models/Goal';
import { IDesignationKRAMapping, IKRA } from '../models/KRA';
import { IQAResponse, IQuestion } from '../models/Question';

export const mockEmployee: IEmployee = {
  id: 1,
  employeeId: 'EMP12346',
  employeeName: 'Jane Smith',
  email: 'jane.smith@contoso.com',
  designationId: 101,
  designationTitle: 'Product Manager',
  department: 'Product',
  reportingManager: 'Alex Johnson',
  projectManager: 'Mira Kapoor',
  role: 'Employee',
  isActive: true
};

export const mockCycle: IAppraisalCycle = {
  id: 1,
  cycleName: 'FY26 Mid-Year Self Appraisal',
  startDate: '2026-05-01',
  endDate: '2026-06-15',
  status: 'Active',
  isActive: true
};

export const mockHeader: IAppraisalHeader = {
  id: 501,
  employeeId: 1,
  cycleId: 1,
  status: 'Draft',
  finalRating: 0
};

export const mockKras: IKRA[] = [
  { id: 1, name: 'Product Development', description: 'Focus on building innovative products that meet customer needs.', isActive: true },
  { id: 2, name: 'Customer Satisfaction', description: 'Ensure higher customer satisfaction through quality and support.', isActive: true },
  { id: 3, name: 'Process Improvement', description: 'Improve internal processes to enhance efficiency and productivity.', isActive: true }
];

export const mockMappings: IDesignationKRAMapping[] = [
  { id: 1001, designationId: 101, kraId: 1, kra: mockKras[0], weightage: 40, displayOrder: 1, isActive: true },
  { id: 1002, designationId: 101, kraId: 2, kra: mockKras[1], weightage: 30, displayOrder: 2, isActive: true },
  { id: 1003, designationId: 101, kraId: 3, kra: mockKras[2], weightage: 30, displayOrder: 3, isActive: true }
];

export const mockGoals: IEmployeeGoal[] = [
  { id: 2001, appraisalHeaderId: 501, designationKraId: 1001, goalTitle: 'Launch 2 major product features in Q2', goalDescription: 'Successfully launch 2 major product features in Q2.', priority: 'High', targetOutcome: 'Release both features with documentation and testing.', progress: 90, isDeleted: false },
  { id: 2002, appraisalHeaderId: 501, designationKraId: 1001, goalTitle: 'Improve product performance by 15%', goalDescription: 'Improve overall product performance by 15%.', priority: 'Medium', targetOutcome: 'Reduce load time and optimize key modules.', progress: 70, isDeleted: false },
  { id: 2003, appraisalHeaderId: 501, designationKraId: 1002, goalTitle: 'Achieve customer satisfaction score of 90%+', goalDescription: 'Improve customer satisfaction score.', priority: 'High', targetOutcome: 'Reach a 90%+ satisfaction score.', progress: 80, isDeleted: false },
  { id: 2004, appraisalHeaderId: 501, designationKraId: 1002, goalTitle: 'Reduce customer support tickets by 20%', goalDescription: 'Reduce recurring customer support tickets.', priority: 'Medium', targetOutcome: 'Reduce tickets by improving documentation.', progress: 60, isDeleted: false },
  { id: 2005, appraisalHeaderId: 501, designationKraId: 1003, goalTitle: 'Automate 2 key manual processes', goalDescription: 'Automate key manual workflows.', priority: 'Low', targetOutcome: 'Save significant operations time.', progress: 100, isDeleted: false }
];

export const mockResponses: IGoalResponse[] = [
  { id: 3001, appraisalHeaderId: 501, goalId: 2001, selfRating: 4, selfComments: 'Successfully launched 1 major feature.\nLearning: Improved sprint planning.\nChallenge: Dependency on external APIs.' },
  { id: 3002, appraisalHeaderId: 501, goalId: 2002, selfRating: 3, selfComments: 'Performance improved by 10%.\nLearning: Gained insights on monitoring tools.\nChallenge: Limited resources.' },
  { id: 3003, appraisalHeaderId: 501, goalId: 2003, selfRating: 4, selfComments: 'Current score is 88%.\nLearning: Better communication helps.\nChallenge: Some product UX gaps.' },
  { id: 3004, appraisalHeaderId: 501, goalId: 2004, selfRating: 3, selfComments: 'Reduced by 12%.\nLearning: Documentation updates helped.\nChallenge: More edge cases.' },
  { id: 3005, appraisalHeaderId: 501, goalId: 2005, selfRating: 5, selfComments: 'Automated 2 processes successfully.\nLearning: Saved significant time.\nChallenge: Initial script accuracy.' }
];

export const mockQuestions: IQuestion[] = [
  { id: 1, question: 'What are your key achievements during this period?' },
  { id: 2, question: 'What were the major challenges you faced?' },
  { id: 3, question: 'What are your key priorities for the next period?' },
  { id: 4, question: 'What support or resources do you need from your manager/organization?' }
];

export const mockQaResponses: IQAResponse[] = [
  { id: 4001, appraisalHeaderId: 501, questionId: 1, answer: 'Delivered key features on time, improved system performance, and enhanced customer satisfaction.' },
  { id: 4002, appraisalHeaderId: 501, questionId: 2, answer: 'Resource constraints and dependency on third-party APIs.' },
  { id: 4003, appraisalHeaderId: 501, questionId: 3, answer: 'Focus on scalability improvements, user experience enhancements, and team skill development.' },
  { id: 4004, appraisalHeaderId: 501, questionId: 4, answer: 'Additional bandwidth for testing and access to advanced monitoring tools.' }
];

export const mockDocuments: IAppraisalDocument[] = [
  { id: 5001, fileLeafRef: 'Self_Appraisal_Supporting_Document.pdf', employeeId: 1, appraisalHeaderId: 501, cycleId: 1, documentType: 'Supporting Document', sizeKb: 450, created: new Date().toISOString() }
];

