export type AppraisalStatus = 'Draft' | 'Submitted';
export type CycleStatus = 'Active' | 'Closed';

export interface IAppraisalCycle {
  id: number;
  cycle: string;
  startDate: string;
  endDate: string;
  status: CycleStatus;
}

export interface IAppraisalResponse {
  id: number;
  employeeId: number;
  cycleId: number;
  status: AppraisalStatus;
  finalRating: number;
  submittedDate?: string;
  draftSavedDate?: string;
}

export interface IAppraisalDocument {
  id: number;
  fileLeafRef: string;
  employeeId: number;
  appraisalResponseId: number;
  cycleId: number;
  fileServerRelativeUrl?: string;
  sizeKb: number;
  created: string;
}

export interface IAppraisalData {
  cycle: IAppraisalCycle;
  appraisalResponse: IAppraisalResponse;
}
