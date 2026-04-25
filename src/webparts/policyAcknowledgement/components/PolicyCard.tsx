import * as React from 'react';
import { IPolicyWithStatus } from '../../../models/IPolicyStatus';
import { formatDate } from '../../../common/PolicyUtils';
import { StatusBadge } from './StatusBadge';
import {
    DefaultButton,
    PrimaryButton,
    Icon,
} from '@fluentui/react';
import styles from './PolicyAcknowledgement.module.scss';

export interface IPolicyCardProps {
    policy: IPolicyWithStatus;
    onViewPolicy: (policy: IPolicyWithStatus) => void;
}

export const PolicyCard: React.FC<IPolicyCardProps> = ({ policy, onViewPolicy }) => {
    return (
        <div className={styles.policyCard} role="article" aria-label={policy.title}>
            <div className={styles.cardHeader}>
                <div className={styles.cardTitleRow}>
                    <h3 className={styles.cardTitle}>{policy.title}</h3>
                    <StatusBadge status={policy.status} />
                </div>
                <div className={styles.cardMeta}>
                    <span className={styles.cardCategory}>
                        <Icon iconName="Tag" className={styles.metaIcon} />
                        {policy.category}
                    </span>
                    <span className={styles.cardVersion}>
                        <Icon iconName="History" className={styles.metaIcon} />
                        v{policy.version}
                    </span>
                    {policy.isRequired && (
                        <span className={styles.cardRequired}>
                            <Icon iconName="Warning" className={styles.metaIcon} />
                            Required
                        </span>
                    )}
                </div>
            </div>
            <div className={styles.cardBody}>
                {policy.description && (
                    <p className={styles.cardDescription}>
                        {policy.description.length > 150
                            ? `${policy.description.substring(0, 150)}...`
                            : policy.description}
                    </p>
                )}
                <div className={styles.cardDetails}>
                    {policy.dueDate && (
                        <span className={styles.cardDueDate}>
                            <Icon iconName="Calendar" className={styles.metaIcon} />
                            Due: {formatDate(policy.dueDate)}
                        </span>
                    )}
                    {policy.ownerName && (
                        <span className={styles.cardOwner}>
                            <Icon iconName="Contact" className={styles.metaIcon} />
                            {policy.ownerName}
                        </span>
                    )}
                    {policy.acknowledgedDate && (
                        <span className={styles.cardAckDate}>
                            <Icon iconName="CheckMark" className={styles.metaIcon} />
                            Acknowledged: {formatDate(policy.acknowledgedDate)}
                        </span>
                    )}
                </div>
            </div>
            <div className={styles.cardActions}>
                {policy.status === 'Acknowledged' ? (
                    <DefaultButton
                        text="View Details"
                        iconProps={{ iconName: 'View' }}
                        onClick={() => onViewPolicy(policy)}
                    />
                ) : (
                    <PrimaryButton
                        text="View & Acknowledge"
                        iconProps={{ iconName: 'CompletedSolid' }}
                        onClick={() => onViewPolicy(policy)}
                    />
                )}
                {policy.documentUrl && (
                    <DefaultButton
                        text="Open Document"
                        iconProps={{ iconName: 'OpenFile' }}
                        href={policy.documentUrl}
                        target="_blank"
                    />
                )}
            </div>
        </div>
    );
};
