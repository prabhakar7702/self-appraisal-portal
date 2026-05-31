import { LISTS } from '../constants/ListNames';
import { IAppraisalCycle } from '../models/Appraisal';
import { mockCycle } from './MockData';
import { SharePointService } from './SharePointService';

export class CycleService {
  public static async getActiveCycle(): Promise<IAppraisalCycle> {
    const cycles = await SharePointService.getItems<IAppraisalCycle>(LISTS.AppraisalCycles, [mockCycle]);
    return cycles[0];
  }
}

