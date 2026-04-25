import * as React from 'react';
import {
    Panel,
    PanelType,
    PrimaryButton,
    DefaultButton,
    Checkbox,
    TextField,
    MessageBar,
    MessageBarType,
    Separator,
    Icon,
    Link,
} from '@fluentui/react';
import { IPolicyWithStatus } from '../../../models/IPolicyStatus';
import { formatDate } from '../../../common/PolicyUtils';
import { StatusBadge } from './StatusBadge';
import styles from './PolicyAcknowledgement.module.scss';

export interface IPolicyDetailPanelProps {
    policy: IPolicyWithStatus;
    isOpen: boolean;
    onDismiss: () => void;
    onAcknowledge: (policy: IPolicyWithStatus, comments: string) => Promise<void>;
}

export interface IPolicyDetailPanelState {
    isChecked: boolean;
    comments: string;
    isSubmitting: boolean;
    error: string | undefined;
}

export class PolicyDetailPanel extends React.Component<
    IPolicyDetailPanelProps,
    IPolicyDetailPanelState
> {
    constructor(props: IPolicyDetailPanelProps) {
        super(props);
        this.state = {
            isChecked: false,
            comments: '',
            isSubmitting: false,
            error: undefined,
        };
    }

    private _onSubmit = async (): Promise<void> => {
        const { policy, onAcknowledge } = this.props;
        const { comments } = this.state;

        this.setState({ isSubmitting: true, error: undefined });

        try {
            await onAcknowledge(policy, comments);
        } catch {
            this.setState({
                error: 'Unable to save acknowledgement. Please try again.',
            });
        } finally {
            this.setState({ isSubmitting: false });
        }
    };

    public render(): React.ReactElement {
        const { policy, isOpen, onDismiss } = this.props;
        const { isChecked, comments, isSubmitting, error } = this.state;
        const isAlreadyAcknowledged = policy.status === 'Acknowledged';

        return (
            <Panel
                isOpen={isOpen}
                onDismiss={onDismiss}
                type={PanelType.medium}
                headerText={policy.title}
                closeButtonAriaLabel="Close"
                isFooterAtBottom={true}
                onRenderFooterContent={() =>
                    !isAlreadyAcknowledged ? (
                        <div className={styles.panelFooter}>
                            <PrimaryButton
                                text={isSubmitting ? 'Submitting...' : 'Submit Acknowledgement'}
                                onClick={this._onSubmit}
                                disabled={!isChecked || isSubmitting}
                                iconProps={{ iconName: 'CheckMark' }}
                            />
                            <DefaultButton
                                text="Cancel"
                                onClick={onDismiss}
                                disabled={isSubmitting}
                            />
                        </div>
                    ) : (
                        <div className={styles.panelFooter}>
                            <DefaultButton text="Close" onClick={onDismiss} />
                        </div>
                    )
                }
            >
                <div className={styles.panelContent}>
                    {error && (
                        <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>
                    )}

                    {isAlreadyAcknowledged && (
                        <MessageBar messageBarType={MessageBarType.success}>
                            You have already acknowledged this version of the policy
                            {policy.acknowledgedDate && ` on ${formatDate(policy.acknowledgedDate)}`}.
                        </MessageBar>
                    )}

                    <div className={styles.panelMeta}>
                        <div className={styles.panelMetaItem}>
                            <Icon iconName="Tag" className={styles.metaIcon} />
                            <span className={styles.metaLabel}>Category:</span>
                            <span>{policy.category}</span>
                        </div>
                        <div className={styles.panelMetaItem}>
                            <Icon iconName="History" className={styles.metaIcon} />
                            <span className={styles.metaLabel}>Version:</span>
                            <span>{policy.version}</span>
                        </div>
                        <div className={styles.panelMetaItem}>
                            <StatusBadge status={policy.status} />
                        </div>
                        {policy.dueDate && (
                            <div className={styles.panelMetaItem}>
                                <Icon iconName="Calendar" className={styles.metaIcon} />
                                <span className={styles.metaLabel}>Due Date:</span>
                                <span>{formatDate(policy.dueDate)}</span>
                            </div>
                        )}
                        {policy.ownerName && (
                            <div className={styles.panelMetaItem}>
                                <Icon iconName="Contact" className={styles.metaIcon} />
                                <span className={styles.metaLabel}>Policy Owner:</span>
                                <span>{policy.ownerName}</span>
                            </div>
                        )}
                        <div className={styles.panelMetaItem}>
                            <Icon iconName="Info" className={styles.metaIcon} />
                            <span className={styles.metaLabel}>Required:</span>
                            <span>{policy.isRequired ? 'Yes' : 'No'}</span>
                        </div>
                    </div>

                    <Separator />

                    {policy.description && (
                        <>
                            <h3 className={styles.sectionTitle}>Description</h3>
                            <p className={styles.policyDescription}>{policy.description}</p>
                            <Separator />
                        </>
                    )}

                    {policy.documentUrl && (
                        <>
                            <h3 className={styles.sectionTitle}>Policy Document</h3>
                            <Link href={policy.documentUrl} target="_blank">
                                <Icon iconName="OpenFile" /> Open Policy Document
                            </Link>
                            <Separator />
                        </>
                    )}

                    {!isAlreadyAcknowledged && (
                        <>
                            <h3 className={styles.sectionTitle}>Acknowledgement</h3>
                            <div className={styles.acknowledgementSection}>
                                <Checkbox
                                    label={
                                        policy.acknowledgementText ||
                                        'I confirm that I have read and understood this policy.'
                                    }
                                    checked={isChecked}
                                    onChange={(_, checked) =>
                                        this.setState({ isChecked: !!checked })
                                    }
                                    className={styles.ackCheckbox}
                                />
                                <TextField
                                    label="Comments (optional)"
                                    multiline
                                    rows={3}
                                    value={comments}
                                    onChange={(_, val) => this.setState({ comments: val || '' })}
                                    placeholder="Add any comments or notes..."
                                />
                            </div>
                        </>
                    )}
                </div>
            </Panel>
        );
    }
}
