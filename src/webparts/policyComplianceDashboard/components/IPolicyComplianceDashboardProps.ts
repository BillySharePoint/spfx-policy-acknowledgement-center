import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IPolicyComplianceDashboardProps {
    context: WebPartContext;
    policiesListName: string;
    acknowledgementsListName: string;
    enableCsvExport: boolean;
    showDepartmentFilter: boolean;
    pageSize: number;
    isDarkTheme: boolean;
    hasTeamsContext: boolean;
}
