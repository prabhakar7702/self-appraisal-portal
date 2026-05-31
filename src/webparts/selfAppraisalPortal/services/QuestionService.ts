import { LISTS } from '../constants/ListNames';
import { IQuestion } from '../models/Question';
import { SharePointRestService } from './SharePointRestService';

export class QuestionService {
  private restService: SharePointRestService;

  public constructor(restService: SharePointRestService) {
    this.restService = restService;
  }

  public async getQuestions(): Promise<IQuestion[]> {
    const items = await this.restService.getItems<any>(LISTS.AppraisalQuestions, '?$orderby=Id asc');
    return items.map((item: any) => ({
      id: item.Id,
      question: item.Question || item.Title || ''
    }));
  }
}
