export interface IAcknowledgement {
    id: number;
    policyId: number;
    policyTitleSnapshot: string;
    policyVersion: string;
    employeeDisplayName: string;
    employeeEmail: string;
    department?: string;
    jobTitle?: string;
    acknowledgedDate: Date;
    acknowledgementStatus: AcknowledgementStatus;
    dueDateSnapshot?: Date;
    comments?: string;
}

export type AcknowledgementStatus = 'Acknowledged' | 'Superseded' | 'Revoked';
