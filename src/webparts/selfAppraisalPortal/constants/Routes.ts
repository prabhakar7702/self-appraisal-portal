export const ROUTES = {
  Home: 'home',
  Overview: 'overview',
  CreateGoals: 'createGoals',
  AppraisalForm: 'appraisalForm',
  AdditionalQuestions: 'additionalQuestions',
  UploadDocuments: 'uploadDocuments',
  Drafts: 'drafts'
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];

