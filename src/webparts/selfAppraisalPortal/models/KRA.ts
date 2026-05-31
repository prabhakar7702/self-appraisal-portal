export interface IKRA {
  id: number;
  title: string;
  designationId: number;
  weightage: number;
}

export interface IDesignationKRAMapping {
  id: number;
  designationId: number;
  kraId: number;
  kra: IKRA;
  weightage: number;
  displayOrder: number;
}
