import { IAppraisalCycle } from '../models/Appraisal';

export class DateHelper {
  public static isWithinCycle(cycle: IAppraisalCycle, now: Date = new Date()): boolean {
    const start = new Date(cycle.startDate);
    const end = new Date(cycle.endDate);
    end.setHours(23, 59, 59, 999);
    return cycle.status === 'Active' && now >= start && now <= end;
  }

  public static formatDate(value: string): string {
    return new Date(value).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  public static remainingDays(cycle: IAppraisalCycle, now: Date = new Date()): number {
    const end = new Date(cycle.endDate);
    end.setHours(23, 59, 59, 999);
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
}

