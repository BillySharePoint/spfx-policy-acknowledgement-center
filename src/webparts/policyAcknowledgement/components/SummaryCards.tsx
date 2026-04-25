import * as React from 'react';
import styles from './PolicyAcknowledgement.module.scss';

export interface ISummaryCardsProps {
    required: number;
    acknowledged: number;
    overdue: number;
    optional: number;
}

export const SummaryCards: React.FC<ISummaryCardsProps> = ({
    required,
    acknowledged,
    overdue,
    optional,
}) => {
    return (
        <div className={styles.summaryCards}>
            <div className={`${styles.summaryCard} ${styles.summaryRequired}`}>
                <div className={styles.summaryNumber}>{required}</div>
                <div className={styles.summaryLabel}>Required</div>
            </div>
            <div className={`${styles.summaryCard} ${styles.summaryAcknowledged}`}>
                <div className={styles.summaryNumber}>{acknowledged}</div>
                <div className={styles.summaryLabel}>Acknowledged</div>
            </div>
            <div className={`${styles.summaryCard} ${styles.summaryOverdue}`}>
                <div className={styles.summaryNumber}>{overdue}</div>
                <div className={styles.summaryLabel}>Overdue</div>
            </div>
            <div className={`${styles.summaryCard} ${styles.summaryOptionalCard}`}>
                <div className={styles.summaryNumber}>{optional}</div>
                <div className={styles.summaryLabel}>Optional</div>
            </div>
        </div>
    );
};
