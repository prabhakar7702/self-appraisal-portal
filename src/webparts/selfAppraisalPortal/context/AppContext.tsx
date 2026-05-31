import * as React from 'react';
import { IAppraisalCycle, IAppraisalDocument, IAppraisalResponse } from '../models/Appraisal';
import { IEmployee } from '../models/Employee';
import { IEmployeeGoal, IGoalResponse } from '../models/Goal';
import { IDesignationKRAMapping } from '../models/KRA';
import { IQAResponse, IQuestion } from '../models/Question';

export interface IAppContext {
  employee: IEmployee | undefined;
  cycle: IAppraisalCycle | undefined;
  appraisalResponse: IAppraisalResponse | undefined;
  mappings: IDesignationKRAMapping[];
  goals: IEmployeeGoal[];
  responses: IGoalResponse[];
  questions: IQuestion[];
  qaResponses: IQAResponse[];
  documents: IAppraisalDocument[];
  isLoading: boolean;
  errorMessage: string;
  isCycleOpen: boolean;
  isReadOnly: boolean;
  updateGoal: (goal: IEmployeeGoal) => void;
  removeGoal: (goalId: number) => Promise<void>;
  updateResponse: (response: IGoalResponse) => void;
  updateQaResponse: (response: IQAResponse) => void;
  addDocument: (file: File) => Promise<string>;
  removeDocument: (documentId: number) => Promise<string>;
  saveDraft: () => Promise<string>;
  submit: () => Promise<string>;
  persistChanges: () => Promise<string>;
}

export const AppContext = React.createContext<IAppContext | undefined>(undefined);

export const useAppContext = (): IAppContext => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('AppContext is not available.');
  }

  return context;
};
