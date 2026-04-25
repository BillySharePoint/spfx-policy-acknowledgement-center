import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IPolicyAcknowledgementProps {
  context: WebPartContext;
  policiesListName: string;
  acknowledgementsListName: string;
  showHistoryTab: boolean;
  enableDepartmentTargeting: boolean;
  useGraphProfileDepartment: boolean;
  defaultView: string;
  showOptionalPolicies: boolean;
  pageSize: number;
  isDarkTheme: boolean;
  hasTeamsContext: boolean;
}
