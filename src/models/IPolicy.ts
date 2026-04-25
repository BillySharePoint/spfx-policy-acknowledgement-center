export interface IPolicy {
    id: number;
    title: string;
    policyId?: string;
    description?: string;
    category: string;
    version: string;
    documentUrl: string;
    documentDescription?: string;
    ownerName?: string;
    ownerEmail?: string;
    isRequired: boolean;
    isActive: boolean;
    dueDate?: Date;
    effectiveDate?: Date;
    expiryDate?: Date;
    targetDepartments: string[];
    acknowledgementText?: string;
    sortOrder?: number;
}
