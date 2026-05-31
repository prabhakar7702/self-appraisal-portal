import * as React from 'react';
import { SPHttpClient } from '@microsoft/sp-http';
import { MESSAGES } from '../constants/Messages';
import { IAppraisalCycle, IAppraisalDocument, IAppraisalResponse } from '../models/Appraisal';
import { IEmployee } from '../models/Employee';
import { IEmployeeGoal, IGoalResponse } from '../models/Goal';
import { IDesignationKRAMapping } from '../models/KRA';
import { IQAResponse, IQuestion } from '../models/Question';
import { AppraisalService } from '../services/AppraisalService';
import { CycleService } from '../services/CycleService';
import { DocumentService } from '../services/DocumentService';
import { EmployeeService } from '../services/EmployeeService';
import { GoalService } from '../services/GoalService';
import { QuestionService } from '../services/QuestionService';
import { SharePointRestService } from '../services/SharePointRestService';
import { DateHelper } from '../utils/DateHelper';
import { RatingHelper } from '../utils/RatingHelper';
import { ValidationHelper } from '../utils/ValidationHelper';
import { AppContext } from './AppContext';

export interface IAppProviderProps {
  userEmail: string;
  webAbsoluteUrl: string;
  spHttpClient: SPHttpClient;
  children: React.ReactNode;
}

export const AppProvider: React.FC<IAppProviderProps> = React.memo((props) => {
  const [employee, setEmployee] = React.useState<IEmployee | undefined>();
  const [cycle, setCycle] = React.useState<IAppraisalCycle | undefined>();
  const [appraisalResponse, setAppraisalResponse] = React.useState<IAppraisalResponse | undefined>();
  const [mappings, setMappings] = React.useState<IDesignationKRAMapping[]>([]);
  const [goals, setGoals] = React.useState<IEmployeeGoal[]>([]);
  const [responses, setResponses] = React.useState<IGoalResponse[]>([]);
  const [questions, setQuestions] = React.useState<IQuestion[]>([]);
  const [qaResponses, setQaResponses] = React.useState<IQAResponse[]>([]);
  const [documents, setDocuments] = React.useState<IAppraisalDocument[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const services = React.useMemo(() => {
    const restService = new SharePointRestService(props.spHttpClient, props.webAbsoluteUrl);
    return {
      employeeService: new EmployeeService(restService),
      cycleService: new CycleService(restService),
      goalService: new GoalService(restService),
      appraisalService: new AppraisalService(restService),
      questionService: new QuestionService(restService),
      documentService: new DocumentService(restService)
    };
  }, [props.spHttpClient, props.webAbsoluteUrl]);

  React.useEffect(() => {
    let isMounted = true;
    const load = async (): Promise<void> => {
      try {
        const loadedEmployee = await services.employeeService.getCurrentEmployee(props.userEmail);
        const loadedCycle = await services.cycleService.getActiveCycle();
        const loadedResponse = await services.appraisalService.getResponse(loadedEmployee.id, loadedCycle.id);
        const loadedMappings = await services.goalService.getDesignationKras(loadedEmployee.designation);
        const loadedGoals = loadedResponse ? await services.goalService.getGoals(loadedResponse.id) : [];
        const loadedResponses = loadedResponse ? await services.appraisalService.getGoalResponses(loadedResponse.id) : [];
        const loadedQuestions = await services.questionService.getQuestions();
        const loadedQaResponses = loadedResponse ? await services.appraisalService.getQaResponses(loadedResponse.id) : [];
        const loadedDocuments = loadedResponse ? await services.documentService.getDocuments(loadedResponse.id) : [];

        if (isMounted) {
          setEmployee(loadedEmployee);
          setCycle(loadedCycle);
          setAppraisalResponse(loadedResponse);
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
          setErrorMessage(MESSAGES.LoadFailed);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load().catch(() => setErrorMessage(MESSAGES.LoadFailed));
    return () => {
      isMounted = false;
    };
  }, [props.userEmail, services]);

  const isCycleOpen = React.useMemo(() => !!cycle && DateHelper.isWithinCycle(cycle), [cycle]);
  const isReadOnly = React.useMemo(() => !!appraisalResponse && appraisalResponse.status === 'Submitted', [appraisalResponse]);

  const updateGoal = React.useCallback((goal: IEmployeeGoal): void => {
    setGoals(previous => {
      const exists = previous.some(item => item.id === goal.id);
      return exists ? previous.map(item => item.id === goal.id ? goal : item) : previous.concat(goal);
    });
  }, []);

  const removeGoal = React.useCallback(async (goalId: number): Promise<void> => {
    await services.goalService.deleteGoal(goalId);
    setGoals(previous => previous.filter(goal => goal.id !== goalId));
  }, [services.goalService]);

  const updateResponse = React.useCallback((response: IGoalResponse): void => {
    setResponses(previous => {
      const exists = previous.some(item => item.id === response.id);
      return exists ? previous.map(item => item.id === response.id ? response : item) : previous.concat(response);
    });
  }, []);

  const updateQaResponse = React.useCallback((response: IQAResponse): void => {
    setQaResponses(previous => {
      const exists = previous.some(item => item.id === response.id);
      return exists ? previous.map(item => item.id === response.id ? response : item) : previous.concat(response);
    });
  }, []);

  const addDocument = React.useCallback(async (file: File): Promise<string> => {
    if (!employee || !appraisalResponse || !cycle) {
      return 'Unable to attach this document right now.';
    }

    const validationMessage = ValidationHelper.validatePdf(file);
    if (validationMessage) {
      return validationMessage;
    }

    const document: IAppraisalDocument = {
      id: 0,
      fileLeafRef: file.name,
      employeeId: employee.id,
      appraisalResponseId: appraisalResponse.id,
      cycleId: cycle.id,
      sizeKb: Math.round(file.size / 1024),
      created: new Date().toISOString()
    };
    const folder = `${new URL(props.webAbsoluteUrl).pathname}/AppraisalDocuments/${cycle.cycle}/${employee.empId}`;
    const saved = await services.documentService.addDocument(document, file, folder);
    setDocuments(previous => previous.concat(saved));
    return '';
  }, [appraisalResponse, cycle, employee, props.webAbsoluteUrl, services.documentService]);

  const removeDocument = React.useCallback(async (documentId: number): Promise<string> => {
    const document = documents.filter(item => item.id === documentId)[0];
    await services.documentService.deleteDocument(documentId, document && document.fileServerRelativeUrl);
    setDocuments(previous => previous.filter(item => item.id !== documentId));
    return 'Document removed successfully.';
  }, [documents, services.documentService]);

  const ensureResponse = React.useCallback(async (targetStatus: 'Draft' | 'Submitted'): Promise<IAppraisalResponse | undefined> => {
    if (appraisalResponse) {
      return appraisalResponse;
    }
    if (!employee || !cycle) {
      return undefined;
    }
    const createdResponse = await services.appraisalService.createResponse(employee.id, cycle.id, targetStatus);
    setAppraisalResponse(createdResponse);
    return createdResponse;
  }, [appraisalResponse, cycle, employee, services.appraisalService]);

  const persistChanges = React.useCallback(async (): Promise<string> => {
    const responseHeader = await ensureResponse('Draft');
    if (!responseHeader) {
      return MESSAGES.SaveFailed;
    }

    for (const goal of goals) {
      const goalWithResponse: IEmployeeGoal = {
        ...goal,
        appraisalResponseId: responseHeader.id
      };
      const savedGoal = await services.goalService.saveGoal(goalWithResponse);
      if (savedGoal.id !== goal.id) {
        setGoals(previous => previous.map(item => item.id === goal.id ? savedGoal : item));
      }
    }
    for (const response of responses) {
      await services.appraisalService.saveGoalResponse({ ...response, appraisalResponseId: responseHeader.id });
    }
    for (const response of qaResponses) {
      await services.appraisalService.saveQaResponse({ ...response, appraisalResponseId: responseHeader.id });
    }

    const updatedResponse: IAppraisalResponse = {
      ...responseHeader,
      finalRating: RatingHelper.getFinalRating(mappings, goals, responses)
    };
    await services.appraisalService.saveResponse(updatedResponse);
    setAppraisalResponse(updatedResponse);
    return 'Changes saved.';
  }, [ensureResponse, goals, mappings, qaResponses, responses, services.appraisalService, services.goalService]);

  const saveDraft = React.useCallback(async (): Promise<string> => {
    if (!isCycleOpen) {
      return MESSAGES.WindowClosedHint;
    }
    await persistChanges();
    const responseHeader = await ensureResponse('Draft');
    if (!responseHeader) {
      return MESSAGES.SaveFailed;
    }
    const updatedResponse: IAppraisalResponse = {
      ...responseHeader,
      status: 'Draft',
      finalRating: RatingHelper.getFinalRating(mappings, goals, responses),
      draftSavedDate: new Date().toISOString()
    };
    await services.appraisalService.saveResponse(updatedResponse);
    setAppraisalResponse(updatedResponse);
    return MESSAGES.DraftSaved;
  }, [ensureResponse, goals, isCycleOpen, mappings, persistChanges, responses, services.appraisalService]);

  const submit = React.useCallback(async (): Promise<string> => {
    if (!isCycleOpen) {
      return MESSAGES.WindowClosedHint;
    }
    if (!ValidationHelper.canSubmit(mappings, goals, responses, qaResponses)) {
      return MESSAGES.CompleteRequired;
    }

    await persistChanges();
    const responseHeader = await ensureResponse('Submitted');
    if (!responseHeader) {
      return MESSAGES.SaveFailed;
    }
    const updatedResponse: IAppraisalResponse = {
      ...responseHeader,
      status: 'Submitted',
      finalRating: RatingHelper.getFinalRating(mappings, goals, responses),
      submittedDate: new Date().toISOString()
    };
    await services.appraisalService.saveResponse(updatedResponse);
    setAppraisalResponse(updatedResponse);
    return MESSAGES.Submitted;
  }, [ensureResponse, goals, isCycleOpen, mappings, persistChanges, qaResponses, responses, services.appraisalService]);

  return (
    <AppContext.Provider value={{
      employee,
      cycle,
      appraisalResponse,
      mappings,
      goals,
      responses,
      questions,
      qaResponses,
      documents,
      isLoading,
      errorMessage,
      isCycleOpen,
      isReadOnly,
      updateGoal,
      removeGoal,
      updateResponse,
      updateQaResponse,
      addDocument,
      removeDocument,
      saveDraft,
      submit,
      persistChanges
    }}>
      {props.children}
    </AppContext.Provider>
  );
});
