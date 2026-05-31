import { LISTS } from '../constants/ListNames';
import { IAppraisalHeader } from '../models/Appraisal';
import { IGoalResponse } from '../models/Goal';
import { IQAResponse, IQuestion } from '../models/Question';
import { mockHeader, mockQaResponses, mockQuestions, mockResponses } from './MockData';
import { SharePointService } from './SharePointService';

export class AppraisalService {
  public static async getOrCreateHeader(employeeId: number, cycleId: number): Promise<IAppraisalHeader> {
    const headers = await SharePointService.getItems<IAppraisalHeader>(LISTS.AppraisalHeader, [mockHeader]);
    return headers.filter(header => header.employeeId === employeeId && header.cycleId === cycleId)[0] || mockHeader;
  }

  public static async getGoalResponses(appraisalHeaderId: number): Promise<IGoalResponse[]> {
    const responses = await SharePointService.getItems<IGoalResponse>(LISTS.AppraisalGoalResponses, mockResponses);
    return responses.filter(response => response.appraisalHeaderId === appraisalHeaderId);
  }

  public static async saveGoalResponse(response: IGoalResponse): Promise<IGoalResponse> {
    return SharePointService.saveItem<IGoalResponse>(LISTS.AppraisalGoalResponses, mockResponses, response);
  }

  public static async getQuestions(): Promise<IQuestion[]> {
    return SharePointService.getItems<IQuestion>('AppraisalQuestions', mockQuestions);
  }

  public static async getQaResponses(appraisalHeaderId: number): Promise<IQAResponse[]> {
    const responses = await SharePointService.getItems<IQAResponse>(LISTS.AppraisalQAResponses, mockQaResponses);
    return responses.filter(response => response.appraisalHeaderId === appraisalHeaderId);
  }

  public static async saveQaResponse(response: IQAResponse): Promise<IQAResponse> {
    return SharePointService.saveItem<IQAResponse>(LISTS.AppraisalQAResponses, mockQaResponses, response);
  }

  public static async saveHeader(header: IAppraisalHeader): Promise<IAppraisalHeader> {
    return SharePointService.saveItem<IAppraisalHeader>(LISTS.AppraisalHeader, [mockHeader], header);
  }
}

