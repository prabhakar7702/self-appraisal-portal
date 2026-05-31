import { LISTS } from '../constants/ListNames';
import { IEmployeeGoal } from '../models/Goal';
import { IDesignationKRAMapping } from '../models/KRA';
import { SharePointRestService } from './SharePointRestService';

export class GoalService {
  private restService: SharePointRestService;

  public constructor(restService: SharePointRestService) {
    this.restService = restService;
  }

  public async getDesignationKras(designationTitle: string): Promise<IDesignationKRAMapping[]> {
    const designations = await this.restService.getItems<any>(LISTS.Designations, '?$select=Id,Title');
    const designationId = this.resolveDesignationId(designationTitle, designations);
    if (!designationId) {
      return [];
    }

    const items = await this.restService.getItems<any>(LISTS.KRAs, `?$filter=DesignationId eq ${designationId}&$select=Id,Title,Designation/Id,Designation/Title,Weightage&$expand=Designation&$orderby=Id asc`);
    return items.map((item: any) => ({
      id: item.Id,
      designationId: item.DesignationId,
      kraId: item.Id,
      kra: {
        id: item.Id,
        title: item.Title || '',
        designationId: item.DesignationId,
        weightage: Number(item.Weightage || 0)
      },
      weightage: Number(item.Weightage || 0),
      displayOrder: Number(item.Id || 0)
    }));
  }

  public async getGoals(appraisalResponseId: number): Promise<IEmployeeGoal[]> {
    const items = await this.restService.getItems<any>(LISTS.EmployeeGoals, `?$filter=AppraisalResponseId eq ${appraisalResponseId}`);
    return items.map((item: any) => ({
      id: item.Id,
      appraisalResponseId: item.AppraisalResponseId,
      goal: item.Goal || '',
      description: item.Description || '',
      priority: item.Priority || 'Medium',
      startDate: item.StartDate,
      dueDate: item.DueDate,
      kraId: item.KRAId || 0,
      progress: Number(item.Progress || 0),
      goalTitle: item.Goal || '',
      goalDescription: item.Description || '',
      designationKraId: item.KRAId || 0,
      targetOutcome: '',
      isDeleted: false
    }));
  }

  public async saveGoal(goal: IEmployeeGoal): Promise<IEmployeeGoal> {
    const payload = {
      AppraisalResponseId: goal.appraisalResponseId,
      Goal: goal.goalTitle || goal.goal,
      Description: goal.goalDescription || goal.description,
      Priority: goal.priority,
      StartDate: goal.startDate || null,
      DueDate: goal.dueDate || null,
      KRAId: goal.designationKraId || goal.kraId,
      Progress: goal.progress
    };
    if (goal.id > 0) {
      await this.restService.updateItem(LISTS.EmployeeGoals, goal.id, payload);
      return goal;
    }

    const saved = await this.restService.addItem<any>(LISTS.EmployeeGoals, payload);
    return { ...goal, id: saved.Id };
  }

  public async deleteGoal(goalId: number): Promise<void> {
    await this.restService.deleteItem(LISTS.EmployeeGoals, goalId);
  }

  private resolveDesignationId(employeeDesignation: string, masterDesignations: Array<{ Id: number; Title: string }>): number | undefined {
    const normalizedEmployeeDesignation = this.normalizeText(employeeDesignation);
    if (!normalizedEmployeeDesignation) {
      return undefined;
    }

    const exact = masterDesignations.filter(item => this.normalizeText(item.Title) === normalizedEmployeeDesignation)[0];
    if (exact) {
      return Number(exact.Id);
    }

    const hasAny = (value: string, keywords: string[]): boolean => keywords.some(keyword => value.indexOf(keyword) >= 0);

    const canonical = (() => {
      if (hasAny(normalizedEmployeeDesignation, ['associate software engineer'])) {
        return 'associate software engineer';
      }
      if (hasAny(normalizedEmployeeDesignation, ['senior software engineer'])) {
        return 'senior software engineer';
      }
      if (hasAny(normalizedEmployeeDesignation, ['lead software engineer'])) {
        return 'lead software engineer';
      }
      if (hasAny(normalizedEmployeeDesignation, ['software engineer'])) {
        return 'software engineer';
      }
      if (hasAny(normalizedEmployeeDesignation, ['manager', 'project manager', 'associate project manager', 'tpm'])) {
        return 'manager project manager associate tpm';
      }
      if (hasAny(normalizedEmployeeDesignation, ['architect', 'technical manager', 'associate technical manager', 'technical project manager'])) {
        return 'architect technical managers and above';
      }
      return normalizedEmployeeDesignation;
    })();

    const candidate = masterDesignations.filter(item => this.normalizeText(item.Title).indexOf(canonical) >= 0 || canonical.indexOf(this.normalizeText(item.Title)) >= 0)[0];
    return candidate ? Number(candidate.Id) : undefined;
  }

  private normalizeText(value: string): string {
    return (value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
