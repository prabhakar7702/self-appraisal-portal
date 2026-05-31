export type AppraisalStatus = 'Draft' | 'Submitted';
export type CycleStatus = 'Planned' | 'Active' | 'Closed';

export interface IAppraisalCycle {
  id: number;
  cycleName: string;
  startDate: string;
  endDate: string;
  status: CycleStatus;
  isActive: boolean;
}

export interface IAppraisalHeader {
  id: number;
  employeeId: number;
  cycleId: number;
  status: AppraisalStatus;
  finalRating: number;
  draftSavedDate?: string;
  submittedDate?: string;
}

export interface IAppraisalDocument {
  id: number;
  fileLeafRef: string;
  employeeId: number;
  appraisalHeaderId: number;
  cycleId: number;
  documentType: 'Supporting Document';
  sizeKb: number;
  created: string;
}

export interface IAppraisalData {
  cycle: IAppraisalCycle;
  header: IAppraisalHeader;
}

