import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI, spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import { IAcknowledgement } from '../models/IAcknowledgement';
import { IUserProfile } from '../models/IUserProfile';

export interface ICreateAcknowledgementParams {
    policyId: number;
    policyTitle: string;
    policyVersion: string;
    dueDate?: Date;
    comments?: string;
}

export class AcknowledgementService {
    private _sp: SPFI;
    private _acknowledgementListName: string;

    constructor(context: WebPartContext, acknowledgementListName: string) {
        this._sp = spfi().using(SPFx(context));
        this._acknowledgementListName = acknowledgementListName;
    }

    public async getCurrentUserAcknowledgements(userEmail: string): Promise<IAcknowledgement[]> {
        const items = await this._sp.web.lists
            .getByTitle(this._acknowledgementListName)
            .items.select(
                'Id',
                'PolicyLookup/Id',
                'PolicyTitleSnapshot',
                'PolicyVersion',
                'Employee/Title',
                'Employee/EMail',
                'EmployeeEmail',
                'EmployeeDisplayName',
                'Department',
                'JobTitle',
                'AcknowledgedDate',
                'AcknowledgementStatus',
                'DueDateSnapshot',
                'Comments'
            )
            .expand('PolicyLookup', 'Employee')
            .filter(`EmployeeEmail eq '${userEmail}'`)
            .orderBy('AcknowledgedDate', false)
            .top(1000)();

        return items.map((item: Record<string, unknown>) => this._mapToAcknowledgement(item));
    }

    public async getAcknowledgementsForPolicy(policyId: number): Promise<IAcknowledgement[]> {
        const items = await this._sp.web.lists
            .getByTitle(this._acknowledgementListName)
            .items.select(
                'Id',
                'PolicyLookup/Id',
                'PolicyTitleSnapshot',
                'PolicyVersion',
                'Employee/Title',
                'Employee/EMail',
                'EmployeeEmail',
                'EmployeeDisplayName',
                'Department',
                'JobTitle',
                'AcknowledgedDate',
                'AcknowledgementStatus',
                'DueDateSnapshot',
                'Comments'
            )
            .expand('PolicyLookup', 'Employee')
            .filter(`PolicyLookupId eq ${policyId}`)
            .orderBy('AcknowledgedDate', false)
            .top(5000)();

        return items.map((item: Record<string, unknown>) => this._mapToAcknowledgement(item));
    }

    public async getAllAcknowledgements(): Promise<IAcknowledgement[]> {
        const items = await this._sp.web.lists
            .getByTitle(this._acknowledgementListName)
            .items.select(
                'Id',
                'PolicyLookup/Id',
                'PolicyTitleSnapshot',
                'PolicyVersion',
                'Employee/Title',
                'Employee/EMail',
                'EmployeeEmail',
                'EmployeeDisplayName',
                'Department',
                'JobTitle',
                'AcknowledgedDate',
                'AcknowledgementStatus',
                'DueDateSnapshot',
                'Comments'
            )
            .expand('PolicyLookup', 'Employee')
            .orderBy('AcknowledgedDate', false)
            .top(5000)();

        return items.map((item: Record<string, unknown>) => this._mapToAcknowledgement(item));
    }

    public async isAlreadyAcknowledged(
        policyId: number,
        policyVersion: string,
        userEmail: string
    ): Promise<boolean> {
        const items = await this._sp.web.lists
            .getByTitle(this._acknowledgementListName)
            .items.filter(
                `PolicyLookupId eq ${policyId} and PolicyVersion eq '${policyVersion}' and EmployeeEmail eq '${userEmail}' and AcknowledgementStatus eq 'Acknowledged'`
            )
            .top(1)();

        return items.length > 0;
    }

    public async createAcknowledgement(
        params: ICreateAcknowledgementParams,
        userProfile: IUserProfile,
        currentUserId: number
    ): Promise<void> {
        const titleValue = `${params.policyTitle} - ${userProfile.email} - v${params.policyVersion}`;

        await this._sp.web.lists
            .getByTitle(this._acknowledgementListName)
            .items.add({
                Title: titleValue,
                PolicyLookupId: params.policyId,
                PolicyTitleSnapshot: params.policyTitle,
                PolicyVersion: params.policyVersion,
                EmployeeId: currentUserId,
                EmployeeEmail: userProfile.email,
                EmployeeDisplayName: userProfile.displayName,
                Department: userProfile.department || '',
                JobTitle: userProfile.jobTitle || '',
                AcknowledgedDate: new Date().toISOString(),
                AcknowledgementStatus: 'Acknowledged',
                DueDateSnapshot: params.dueDate ? params.dueDate.toISOString() : null,
                Comments: params.comments || '',
            });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _mapToAcknowledgement(item: Record<string, any>): IAcknowledgement {
        return {
            id: item.Id,
            policyId: item.PolicyLookup ? item.PolicyLookup.Id : 0,
            policyTitleSnapshot: item.PolicyTitleSnapshot || '',
            policyVersion: item.PolicyVersion || '',
            employeeDisplayName: item.EmployeeDisplayName || (item.Employee ? item.Employee.Title : ''),
            employeeEmail: item.EmployeeEmail || (item.Employee ? item.Employee.EMail : ''),
            department: item.Department || '',
            jobTitle: item.JobTitle || '',
            acknowledgedDate: item.AcknowledgedDate ? new Date(item.AcknowledgedDate) : new Date(),
            acknowledgementStatus: item.AcknowledgementStatus || 'Acknowledged',
            dueDateSnapshot: item.DueDateSnapshot ? new Date(item.DueDateSnapshot) : undefined,
            comments: item.Comments || '',
        };
    }
}
