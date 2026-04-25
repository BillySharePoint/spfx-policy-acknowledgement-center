export interface IComplianceSummary {
    policyId: number;
    policyTitle: string;
    policyVersion: string;
    category: string;
    dueDate?: Date;
    ownerName?: string;
    isRequired: boolean;
    assignedCount?: number;
    acknowledgedCount: number;
    pendingCount?: number;
    overdueCount?: number;
    completionPercentage?: number;
}
