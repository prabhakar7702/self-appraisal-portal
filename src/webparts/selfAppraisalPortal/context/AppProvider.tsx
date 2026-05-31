import * as React from 'react';
import { MESSAGES } from '../constants/Messages';
import { IAppraisalCycle, IAppraisalDocument, IAppraisalHeader } from '../models/Appraisal';
import { IEmployee } from '../models/Employee';
import { IEmployeeGoal, IGoalResponse } from '../models/Goal';
import { IDesignationKRAMapping } from '../models/KRA';
import { IQAResponse, IQuestion } from '../models/Question';
import { AppraisalService } from '../services/AppraisalService';
import { CycleService } from '../services/CycleService';
import { DocumentService } from '../services/DocumentService';
import { EmployeeService } from '../services/EmployeeService';
import { GoalService } from '../services/GoalService';
import { DateHelper } from '../utils/DateHelper';
import { RatingHelper } from '../utils/RatingHelper';
import { ValidationHelper } from '../utils/ValidationHelper';
import { AppContext } from './AppContext';

export interface IAppProviderProps {
  userDisplayName: string;
  children: React.ReactNode;
}

export const AppProvider: React.FC<IAppProviderProps> = React.memo((props) => {
  const [employee, setEmployee] = React.useState<IEmployee | undefined>();
  const [cycle, setCycle] = React.useState<IAppraisalCycle | undefined>();
  const [header, setHeader] = React.useState<IAppraisalHeader | undefined>();
  const [mappings, setMappings] = React.useState<IDesignationKRAMapping[]>([]);
  const [goals, setGoals] = React.useState<IEmployeeGoal[]>([]);
  const [responses, setResponses] = React.useState<IGoalResponse[]>([]);
  const [questions, setQuestions] = React.useState<IQuestion[]>([]);
  const [qaResponses, setQaResponses] = React.useState<IQAResponse[]>([]);
  const [documents, setDocuments] = React.useState<IAppraisalDocument[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  React.useEffect(() => {
    let isMounted = true;

    const load = async (): Promise<void> => {
      try {
        const loadedEmployee = await EmployeeService.getCurrentEmployee(props.userDisplayName);
        const loadedCycle = await CycleService.getActiveCycle();
        const loadedHeader = await AppraisalService.getOrCreateHeader(loadedEmployee.id, loadedCycle.id);
        const loadedMappings = await GoalService.getDesignationKras(loadedEmployee.designationId);
        const loadedGoals = await GoalService.getGoals(loadedHeader.id);
        const loadedResponses = await AppraisalService.getGoalResponses(loadedHeader.id);
        const loadedQuestions = await AppraisalService.getQuestions();
        const loadedQaResponses = await AppraisalService.getQaResponses(loadedHeader.id);
        const loadedDocuments = await DocumentService.getDocuments(loadedHeader.id);

        if (isMounted) {
          setEmployee(loadedEmployee);
          setCycle(loadedCycle);
          setHeader(loadedHeader);
          setMappings(loadedMappings);
          setGoals(loadedGoals);
          setResponses(loadedResponses);
          setQuestions(loadedQuestions);
          setQaResponses(loadedQaResponses);
          setDocuments(loadedDocuments);
          setErrorMessage('');
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage('Unable to load the self appraisal workspace.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load().catch(() => setErrorMessage('Unable to load the self appraisal workspace.'));
    return () => {
      isMounted = false;
    };
  }, [props.userDisplayName]);

  const isCycleOpen = React.useMemo(() => !!cycle && DateHelper.isWithinCycle(cycle), [cycle]);

  const updateGoal = React.useCallback((goal: IEmployeeGoal): void => {
    setGoals(previous => {
      const exists = previous.some(item => item.id === goal.id);
      return exists ? previous.map(item => item.id === goal.id ? goal : item) : previous.concat(goal);
    });
  }, []);

  const updateResponse = React.useCallback((response: IGoalResponse): void => {
    setResponses(previous => {
      const exists = previous.some(item => item.id === response.id);
      return exists ? previous.map(item => item.id === response.id ? response : item) : previous.concat(response);
    });
  }, []);

  const updateQaResponse = React.useCallback((response: IQAResponse): void => {
    setQaResponses(previous => previous.map(item => item.id === response.id ? response : item));
  }, []);

  const addDocument = React.useCallback(async (file: File): Promise<string> => {
    if (!employee || !header || !cycle) {
      return 'Unable to attach this document right now.';
    }

    const validationMessage = ValidationHelper.validatePdf(file);
    if (validationMessage) {
      return validationMessage;
    }

    const document: IAppraisalDocument = {
      id: Date.now(),
      fileLeafRef: file.name,
      employeeId: employee.id,
      appraisalHeaderId: header.id,
      cycleId: cycle.id,
      documentType: 'Supporting Document',
      sizeKb: Math.round(file.size / 1024),
      created: new Date().toISOString()
    };

    const saved = await DocumentService.addDocument(document);
    setDocuments(previous => previous.concat(saved));
    return '';
  }, [cycle, employee, header]);

  const saveDraft = React.useCallback(async (): Promise<string> => {
    if (!header || !isCycleOpen) {
      return MESSAGES.WindowClosedHint;
    }

    const updatedHeader: IAppraisalHeader = {
      ...header,
      status: 'Draft',
      finalRating: RatingHelper.getFinalRating(mappings, goals, responses),
      draftSavedDate: new Date().toISOString()
    };

    await AppraisalService.saveHeader(updatedHeader);
    setHeader(updatedHeader);
    return MESSAGES.DraftSaved;
  }, [goals, header, isCycleOpen, mappings, responses]);

  const submit = React.useCallback(async (): Promise<string> => {
    if (!header || !isCycleOpen) {
      return MESSAGES.WindowClosedHint;
    }

    if (!ValidationHelper.canSubmit(mappings, goals, responses, qaResponses)) {
      return MESSAGES.CompleteRequired;
    }

    const updatedHeader: IAppraisalHeader = {
      ...header,
      status: 'Submitted',
      finalRating: RatingHelper.getFinalRating(mappings, goals, responses),
      submittedDate: new Date().toISOString()
    };

    await AppraisalService.saveHeader(updatedHeader);
    setHeader(updatedHeader);
    return MESSAGES.Submitted;
  }, [goals, header, isCycleOpen, mappings, qaResponses, responses]);

  return (
    <AppContext.Provider value={{
      employee,
      cycle,
      header,
      mappings,
      goals,
      responses,
      questions,
      qaResponses,
      documents,
      isLoading,
      errorMessage,
      isCycleOpen,
      updateGoal,
      updateResponse,
      updateQaResponse,
      addDocument,
      saveDraft,
      submit
    }}>
      {props.children}
    </AppContext.Provider>
  );
});
