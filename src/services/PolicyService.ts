import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI, spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/fields';
import { IPolicy } from '../models/IPolicy';

export class PolicyService {
    private _sp: SPFI;
    private _policiesListName: string;

    constructor(context: WebPartContext, policiesListName: string) {
        this._sp = spfi().using(SPFx(context));
        this._policiesListName = policiesListName;
    }

    public async getActivePolicies(): Promise<IPolicy[]> {
        const items = await this._sp.web.lists
            .getByTitle(this._policiesListName)
            .items.select(
                'Id',
                'Title',
                'PolicyId',
                'PolicyDescription',
                'PolicyCategory',
                'PolicyVersion',
                'PolicyDocumentUrl',
                'PolicyOwner/Title',
                'PolicyOwner/EMail',
                'IsRequired',
                'IsActive',
                'DueDate',
                'EffectiveDate',
                'ExpiryDate',
                'TargetDepartments',
                'AcknowledgementText',
                'SortOrder'
            )
            .expand('PolicyOwner')
            .filter('IsActive eq 1')
            .orderBy('SortOrder', true)
            .top(500)();

        return items.map((item: Record<string, unknown>) => this._mapToPolicy(item));
    }

    public async getPolicyById(id: number): Promise<IPolicy | undefined> {
        try {
            const item = await this._sp.web.lists
                .getByTitle(this._policiesListName)
                .items.getById(id)
                .select(
                    'Id',
                    'Title',
                    'PolicyId',
                    'PolicyDescription',
                    'PolicyCategory',
                    'PolicyVersion',
                    'PolicyDocumentUrl',
                    'PolicyOwner/Title',
                    'PolicyOwner/EMail',
                    'IsRequired',
                    'IsActive',
                    'DueDate',
                    'EffectiveDate',
                    'ExpiryDate',
                    'TargetDepartments',
                    'AcknowledgementText',
                    'SortOrder'
                )
                .expand('PolicyOwner')();

            return this._mapToPolicy(item as Record<string, unknown>);
        } catch {
            return undefined;
        }
    }

    public async getPoliciesByCategory(category: string): Promise<IPolicy[]> {
        const items = await this._sp.web.lists
            .getByTitle(this._policiesListName)
            .items.select(
                'Id',
                'Title',
                'PolicyId',
                'PolicyDescription',
                'PolicyCategory',
                'PolicyVersion',
                'PolicyDocumentUrl',
                'PolicyOwner/Title',
                'PolicyOwner/EMail',
                'IsRequired',
                'IsActive',
                'DueDate',
                'EffectiveDate',
                'ExpiryDate',
                'TargetDepartments',
                'AcknowledgementText',
                'SortOrder'
            )
            .expand('PolicyOwner')
            .filter(`IsActive eq 1 and PolicyCategory eq '${category}'`)
            .orderBy('SortOrder', true)
            .top(500)();

        return items.map((item: Record<string, unknown>) => this._mapToPolicy(item));
    }

    public filterPoliciesForUser(policies: IPolicy[], userDepartment?: string): IPolicy[] {
        const now = new Date();

        return policies.filter((policy) => {
            // Check effective date
            if (policy.effectiveDate && policy.effectiveDate > now) {
                return false;
            }

            // Check expiry date
            if (policy.expiryDate && policy.expiryDate < now) {
                return false;
            }

            // Check department targeting
            if (
                policy.targetDepartments &&
                policy.targetDepartments.length > 0 &&
                userDepartment
            ) {
                const deptLower = userDepartment.toLowerCase();
                const matches = policy.targetDepartments.some(
                    (d) => d.toLowerCase() === deptLower || d.toLowerCase() === 'all'
                );
                if (!matches) {
                    return false;
                }
            }

            return true;
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _mapToPolicy(item: Record<string, any>): IPolicy {
        const docUrl = item.PolicyDocumentUrl;
        return {
            id: item.Id,
            title: item.Title,
            policyId: item.PolicyId || '',
            description: item.PolicyDescription || '',
            category: item.PolicyCategory || '',
            version: item.PolicyVersion || '1.0',
            documentUrl: docUrl ? (docUrl.Url || docUrl) : '',
            documentDescription: docUrl ? (docUrl.Description || '') : '',
            ownerName: item.PolicyOwner ? item.PolicyOwner.Title : '',
            ownerEmail: item.PolicyOwner ? item.PolicyOwner.EMail : '',
            isRequired: item.IsRequired !== false,
            isActive: item.IsActive !== false,
            dueDate: item.DueDate ? new Date(item.DueDate) : undefined,
            effectiveDate: item.EffectiveDate ? new Date(item.EffectiveDate) : undefined,
            expiryDate: item.ExpiryDate ? new Date(item.ExpiryDate) : undefined,
            targetDepartments: item.TargetDepartments
                ? (Array.isArray(item.TargetDepartments)
                    ? item.TargetDepartments
                    : (item.TargetDepartments.results || []))
                : [],
            acknowledgementText: item.AcknowledgementText || 'I confirm that I have read and understood this policy.',
            sortOrder: item.SortOrder || 0,
        };
    }
}
