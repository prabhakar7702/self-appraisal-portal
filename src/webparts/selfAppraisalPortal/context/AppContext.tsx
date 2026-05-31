import * as React from 'react';
import { IAppraisalCycle, IAppraisalDocument, IAppraisalHeader } from '../models/Appraisal';
import { IEmployee } from '../models/Employee';
import { IEmployeeGoal, IGoalResponse } from '../models/Goal';
import { IDesignationKRAMapping } from '../models/KRA';
import { IQAResponse, IQuestion } from '../models/Question';

export interface IAppContext {
  employee: IEmployee | undefined;
  cycle: IAppraisalCycle | undefined;
  header: IAppraisalHeader | undefined;
  mappings: IDesignationKRAMapping[];
  goals: IEmployeeGoal[];
  responses: IGoalResponse[];
  questions: IQuestion[];
  qaResponses: IQAResponse[];
  documents: IAppraisalDocument[];
  isLoading: boolean;
  errorMessage: string;
  isCycleOpen: boolean;
  updateGoal: (goal: IEmployeeGoal) => void;
  updateResponse: (response: IGoalResponse) => void;
  updateQaResponse: (response: IQAResponse) => void;
  addDocument: (file: File) => Promise<string>;
  saveDraft: () => Promise<string>;
  submit: () => Promise<string>;
}

export const AppContext = React.createContext<IAppContext | undefined>(undefined);

export const useAppContext = (): IAppContext => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('AppContext is not available.');
  }

  return context;
};

