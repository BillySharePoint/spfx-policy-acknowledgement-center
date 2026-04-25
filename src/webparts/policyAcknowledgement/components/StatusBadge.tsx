import * as React from 'react';
import { PolicyStatus } from '../../../models/IPolicyStatus';
import styles from './PolicyAcknowledgement.module.scss';

export interface IStatusBadgeProps {
    status: PolicyStatus;
}

const statusConfig: Record<PolicyStatus, { label: string; className: string }> = {
    Acknowledged: { label: 'Acknowledged', className: 'badgeAcknowledged' },
    NotStarted: { label: 'Not Started', className: 'badgeNotStarted' },
    Overdue: { label: 'Overdue', className: 'badgeOverdue' },
    Optional: { label: 'Optional', className: 'badgeOptional' },
    Expired: { label: 'Expired', className: 'badgeExpired' },
};

export const StatusBadge: React.FC<IStatusBadgeProps> = ({ status }) => {
    const config = statusConfig[status];
    const badgeClassName = (styles as unknown as Record<string, string>)[config.className] || '';
    return (
        <span
            className={`${styles.badge} ${badgeClassName}`}
            role="status"
            aria-label={`Status: ${config.label}`}
        >
            {config.label}
        </span>
    );
};
