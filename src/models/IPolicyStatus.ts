import { IPolicy } from './IPolicy';

export type PolicyStatus =
    | 'NotStarted'
    | 'Acknowledged'
    | 'Overdue'
    | 'Optional'
    | 'Expired';

export interface IPolicyWithStatus extends IPolicy {
    status: PolicyStatus;
    acknowledgedDate?: Date;
    acknowledgedVersion?: string;
}
