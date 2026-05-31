import { LISTS } from '../constants/ListNames';
import { IAppraisalResponse } from '../models/Appraisal';
import { IGoalResponse } from '../models/Goal';
import { IQAResponse } from '../models/Question';
import { SharePointRestService } from './SharePointRestService';

export class AppraisalService {
  private restService: SharePointRestService;

  public constructor(restService: SharePointRestService) {
    this.restService = restService;
  }

  public async getResponse(employeeId: number, cycleId: number): Promise<IAppraisalResponse | undefined> {
    const items = await this.restService.getItems<any>(LISTS.AppraisalResponses, `?$filter=EmployeeId eq ${employeeId} and CycleId eq ${cycleId}&$orderby=Id desc&$top=1`);
    if (items[0]) {
      return {
        id: items[0].Id,
        employeeId: items[0].EmployeeId,
        cycleId: items[0].CycleId,
        status: items[0].Status || 'Draft',
        finalRating: Number(items[0].FinalRating || 0),
        submittedDate: items[0].SubmittedOn || items[0].SubmittedDate,
        draftSavedDate: items[0].Modified
      };
    }
    return undefined;
  }

  public async createResponse(employeeId: number, cycleId: number, status: 'Draft' | 'Submitted'): Promise<IAppraisalResponse> {
    const created = await this.restService.addItem<any>(LISTS.AppraisalResponses, {
      EmployeeId: employeeId,
      CycleId: cycleId,
      Status: status,
      FinalRating: 0
    });
    return {
      id: created.Id,
      employeeId: employeeId,
      cycleId: cycleId,
      status: status,
      finalRating: 0,
      submittedDate: status === 'Submitted' ? new Date().toISOString() : undefined,
      draftSavedDate: status === 'Draft' ? new Date().toISOString() : undefined
    };
  }

  public async getGoalResponses(appraisalResponseId: number): Promise<IGoalResponse[]> {
    const items = await this.restService.getItems<any>(LISTS.AppraisalGoalResponses, `?$filter=AppraisalResponseId eq ${appraisalResponseId}`);
    return items.map((item: any) => ({
      id: item.Id,
      appraisalResponseId: item.AppraisalResponseId,
      goalId: item.GoalId,
      selfRating: Number(item.SelfRating || 0),
      selfComments: item.SelfComments || ''
    }));
  }

  public async saveGoalResponse(response: IGoalResponse): Promise<IGoalResponse> {
    const payload = {
      AppraisalResponseId: response.appraisalResponseId,
      GoalId: response.goalId,
      SelfRating: response.selfRating,
      SelfComments: response.selfComments
    };
    if (response.id > 0) {
      await this.restService.updateItem(LISTS.AppraisalGoalResponses, response.id, payload);
      return response;
    }

    const saved = await this.restService.addItem<any>(LISTS.AppraisalGoalResponses, payload);
    return { ...response, id: saved.Id };
  }

  public async getQaResponses(appraisalResponseId: number): Promise<IQAResponse[]> {
    const items = await this.restService.getItems<any>(LISTS.AppraisalQAResponses, `?$filter=AppraisalResponseId eq ${appraisalResponseId}&$expand=Question`);
    return items.map((item: any) => ({
      id: item.Id,
      appraisalResponseId: item.AppraisalResponseId,
      questionId: item.QuestionId,
      question: item.Question && item.Question.Question ? item.Question.Question : undefined,
      answer: item.Answer || ''
    }));
  }

  public async saveQaResponse(response: IQAResponse): Promise<IQAResponse> {
    const payload = {
      AppraisalResponseId: response.appraisalResponseId,
      QuestionId: response.questionId,
      Answer: response.answer
    };
    if (response.id > 0) {
      await this.restService.updateItem(LISTS.AppraisalQAResponses, response.id, payload);
      return response;
    }

    const saved = await this.restService.addItem<any>(LISTS.AppraisalQAResponses, payload);
    return { ...response, id: saved.Id };
  }

  public async saveResponse(response: IAppraisalResponse): Promise<IAppraisalResponse> {
    await this.restService.updateItem(LISTS.AppraisalResponses, response.id, {
      Status: response.status,
      FinalRating: response.finalRating,
      SubmittedOn: response.submittedDate || null
    });
    return response;
  }
}
