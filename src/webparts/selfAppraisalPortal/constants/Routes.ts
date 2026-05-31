export const ROUTES = {
  Home: 'home',
  CreateGoals: 'createGoals',
  AppraisalForm: 'appraisalForm'
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];
