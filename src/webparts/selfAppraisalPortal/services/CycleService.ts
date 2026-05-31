import { LISTS } from '../constants/ListNames';
import { IAppraisalCycle } from '../models/Appraisal';
import { SharePointRestService } from './SharePointRestService';

export class CycleService {
  private restService: SharePointRestService;

  public constructor(restService: SharePointRestService) {
    this.restService = restService;
  }

  public async getActiveCycle(): Promise<IAppraisalCycle> {
    const items = await this.restService.getItems<any>(LISTS.AppraisalCycles, `?$filter=Status eq 'Active'&$orderby=StartDate desc&$top=1`);
    const item = items[0];
    return {
      id: item.Id,
      cycle: item.Cycle,
      startDate: item.StartDate,
      endDate: item.EndDate,
      status: item.Status,
      // isActive: !!item.IsActive
    };
  }
}
