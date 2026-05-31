import { SPHttpClient } from '@microsoft/sp-http';

export interface ISelfAppraisalPortalProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  userEmail: string;
  webAbsoluteUrl: string;
  spHttpClient: SPHttpClient;
}
