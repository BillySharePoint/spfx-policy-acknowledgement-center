import { IPolicy } from '../models/IPolicy';
import { IAcknowledgement } from '../models/IAcknowledgement';
import { PolicyStatus, IPolicyWithStatus } from '../models/IPolicyStatus';

/**
 * Determines the acknowledgement status for a policy given the current user's acknowledgements.
 */
export function determinePolicyStatus(
    policy: IPolicy,
    userAcknowledgements: IAcknowledgement[]
): PolicyStatus {
    const now = new Date();

    // Check if expired
    if (policy.expiryDate && policy.expiryDate < now) {
        return 'Expired';
    }

    // Check if user has acknowledged this version
    const ack = userAcknowledgements.find(
        (a) =>
            a.policyId === policy.id &&
            a.policyVersion === policy.version &&
            a.acknowledgementStatus === 'Acknowledged'
    );

    if (ack) {
        return 'Acknowledged';
    }

    // Not yet acknowledged
    if (!policy.isRequired) {
        return 'Optional';
    }

    // Required but not acknowledged - check due date
    if (policy.dueDate && policy.dueDate < now) {
        return 'Overdue';
    }

    return 'NotStarted';
}

/**
 * Enriches an array of policies with status info for the current user.
 */
export function enrichPoliciesWithStatus(
    policies: IPolicy[],
    userAcknowledgements: IAcknowledgement[]
): IPolicyWithStatus[] {
    return policies.map((policy) => {
        const status = determinePolicyStatus(policy, userAcknowledgements);

        const latestAck = userAcknowledgements.find(
            (a) =>
                a.policyId === policy.id &&
                a.policyVersion === policy.version &&
                a.acknowledgementStatus === 'Acknowledged'
        );

        return {
            ...policy,
            status,
            acknowledgedDate: latestAck?.acknowledgedDate,
            acknowledgedVersion: latestAck?.policyVersion,
        };
    });
}

/**
 * Formats a date for display.
 */
export function formatDate(date?: Date): string {
    if (!date) return '—';
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Calculates days overdue for a policy.
 */
export function daysOverdue(dueDate?: Date): number {
    if (!dueDate) return 0;
    const now = new Date();
    const diff = now.getTime() - dueDate.getTime();
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
}
