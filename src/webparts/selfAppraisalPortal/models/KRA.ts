export interface IKRA {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface IDesignationKRAMapping {
  id: number;
  designationId: number;
  kraId: number;
  kra: IKRA;
  weightage: number;
  displayOrder: number;
  isActive: boolean;
}

