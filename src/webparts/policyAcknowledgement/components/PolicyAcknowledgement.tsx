import * as React from 'react';
import styles from './PolicyAcknowledgement.module.scss';
import type { IPolicyAcknowledgementProps } from './IPolicyAcknowledgementProps';
import {
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
  Pivot,
  PivotItem,
  SearchBox,
  Dropdown,
  IDropdownOption,
} from '@fluentui/react';
import { PolicyService } from '../../../services/PolicyService';
import { AcknowledgementService } from '../../../services/AcknowledgementService';
import { UserProfileService } from '../../../services/UserProfileService';
import { IAcknowledgement } from '../../../models/IAcknowledgement';
import { IPolicyWithStatus } from '../../../models/IPolicyStatus';
import { IUserProfile } from '../../../models/IUserProfile';
import { enrichPoliciesWithStatus } from '../../../common/PolicyUtils';
import { PolicyCard } from './PolicyCard';
import { PolicyDetailPanel } from './PolicyDetailPanel';
import { SummaryCards } from './SummaryCards';

export interface IPolicyAcknowledgementState {
  policies: IPolicyWithStatus[];
  acknowledgements: IAcknowledgement[];
  userProfile: IUserProfile | undefined;
  userId: number;
  isLoading: boolean;
  error: string | undefined;
  selectedPolicy: IPolicyWithStatus | undefined;
  isPanelOpen: boolean;
  searchText: string;
  categoryFilter: string;
  statusFilter: string;
  activeTab: string;
  successMessage: string | undefined;
}

export default class PolicyAcknowledgement extends React.Component<
  IPolicyAcknowledgementProps,
  IPolicyAcknowledgementState
> {
  private _policyService: PolicyService;
  private _ackService: AcknowledgementService;
  private _userService: UserProfileService;

  constructor(props: IPolicyAcknowledgementProps) {
    super(props);

    this._policyService = new PolicyService(props.context, props.policiesListName);
    this._ackService = new AcknowledgementService(props.context, props.acknowledgementsListName);
    this._userService = new UserProfileService(props.context);

    this.state = {
      policies: [],
      acknowledgements: [],
      userProfile: undefined,
      userId: 0,
      isLoading: true,
      error: undefined,
      selectedPolicy: undefined,
      isPanelOpen: false,
      searchText: '',
      categoryFilter: 'All',
      statusFilter: 'All',
      activeTab: props.defaultView || 'Required',
      successMessage: undefined,
    };
  }

  public async componentDidMount(): Promise<void> {
    await this._loadData();
  }

  private async _loadData(): Promise<void> {
    this.setState({ isLoading: true, error: undefined });
    try {
      const userProfile = this.props.useGraphProfileDepartment
        ? await this._userService.getEnrichedProfile()
        : this._userService.getBasicProfile();

      const userId = await this._userService.getCurrentUserId();

      let allPolicies = await this._policyService.getActivePolicies();

      if (this.props.enableDepartmentTargeting) {
        allPolicies = this._policyService.filterPoliciesForUser(
          allPolicies,
          userProfile.department
        );
      }

      if (!this.props.showOptionalPolicies) {
        allPolicies = allPolicies.filter((p) => p.isRequired);
      }

      const acknowledgements = await this._ackService.getCurrentUserAcknowledgements(userProfile.email);
      const enriched = enrichPoliciesWithStatus(allPolicies, acknowledgements);

      this.setState({
        policies: enriched,
        acknowledgements,
        userProfile,
        userId,
        isLoading: false,
      });
    } catch (err) {
      this.setState({
        isLoading: false,
        error: 'Unable to load policies. Please check that the configured SharePoint lists exist and that you have permission to view them.',
      });
      console.error('PolicyCenter: Error loading data', err);
    }
  }

  private _onPolicyClick = (policy: IPolicyWithStatus): void => {
    this.setState({ selectedPolicy: policy, isPanelOpen: true, successMessage: undefined });
  };

  private _onPanelDismiss = (): void => {
    this.setState({ isPanelOpen: false, selectedPolicy: undefined });
  };

  private _onAcknowledge = async (policy: IPolicyWithStatus, comments: string): Promise<void> => {
    const { userProfile, userId } = this.state;
    if (!userProfile) return;

    try {
      const alreadyAcked = await this._ackService.isAlreadyAcknowledged(
        policy.id,
        policy.version,
        userProfile.email
      );

      if (alreadyAcked) {
        this.setState({
          successMessage: 'You have already acknowledged this version of the policy.',
        });
        return;
      }

      await this._ackService.createAcknowledgement(
        {
          policyId: policy.id,
          policyTitle: policy.title,
          policyVersion: policy.version,
          dueDate: policy.dueDate,
          comments,
        },
        userProfile,
        userId
      );

      this.setState({
        isPanelOpen: false,
        selectedPolicy: undefined,
        successMessage: `Successfully acknowledged "${policy.title}" (v${policy.version}).`,
      });

      await this._loadData();
    } catch (err) {
      this.setState({
        error: 'Unable to save acknowledgement. Please try again or contact your SharePoint administrator.',
      });
      console.error('PolicyCenter: Error acknowledging policy', err);
    }
  };

  private _getFilteredPolicies(): IPolicyWithStatus[] {
    const { policies, searchText, categoryFilter, statusFilter, activeTab } = this.state;

    let filtered = [...policies];

    // Tab-based filtering
    if (activeTab === 'Required') {
      filtered = filtered.filter(
        (p) => p.status !== 'Acknowledged' && p.isRequired
      );
    } else if (activeTab === 'Acknowledged') {
      filtered = filtered.filter((p) => p.status === 'Acknowledged');
    }
    // 'History' tab shows all

    // Search filter
    if (searchText) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower)
      );
    }

    // Category filter
    if (categoryFilter && categoryFilter !== 'All') {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    // Status filter
    if (statusFilter && statusFilter !== 'All') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    return filtered;
  }

  private _getCategories(): IDropdownOption[] {
    const cats = new Set(this.state.policies.map((p) => p.category));
    const options: IDropdownOption[] = [{ key: 'All', text: 'All Categories' }];
    cats.forEach((c) => options.push({ key: c, text: c }));
    return options;
  }

  private _getStatusOptions(): IDropdownOption[] {
    return [
      { key: 'All', text: 'All Statuses' },
      { key: 'NotStarted', text: 'Not Started' },
      { key: 'Acknowledged', text: 'Acknowledged' },
      { key: 'Overdue', text: 'Overdue' },
      { key: 'Optional', text: 'Optional' },
      { key: 'Expired', text: 'Expired' },
    ];
  }

  public render(): React.ReactElement<IPolicyAcknowledgementProps> {
    const {
      isLoading,
      error,
      policies,
      selectedPolicy,
      isPanelOpen,
      activeTab,
      successMessage,
    } = this.state;
    const { hasTeamsContext, showHistoryTab } = this.props;

    const filteredPolicies = this._getFilteredPolicies();

    const requiredCount = policies.filter((p) => p.isRequired && p.status !== 'Acknowledged').length;
    const acknowledgedCount = policies.filter((p) => p.status === 'Acknowledged').length;
    const overdueCount = policies.filter((p) => p.status === 'Overdue').length;
    const optionalCount = policies.filter((p) => p.status === 'Optional').length;

    return (
      <section className={`${styles.policyAcknowledgement} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>My Required Policies</h2>
          <p className={styles.subtitle}>
            Review and acknowledge company policies assigned to you.
          </p>
        </div>

        {successMessage && (
          <MessageBar
            messageBarType={MessageBarType.success}
            onDismiss={() => this.setState({ successMessage: undefined })}
            dismissButtonAriaLabel="Close"
          >
            {successMessage}
          </MessageBar>
        )}

        {error && (
          <MessageBar messageBarType={MessageBarType.error}>
            {error}
          </MessageBar>
        )}

        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <Spinner size={SpinnerSize.large} label="Loading policies..." />
          </div>
        ) : (
          <>
            <SummaryCards
              required={requiredCount}
              acknowledged={acknowledgedCount}
              overdue={overdueCount}
              optional={optionalCount}
            />

            <div className={styles.filterBar}>
              <SearchBox
                placeholder="Search policies..."
                onChange={(_, val) => this.setState({ searchText: val || '' })}
                className={styles.searchBox}
              />
              <Dropdown
                placeholder="Category"
                options={this._getCategories()}
                selectedKey={this.state.categoryFilter}
                onChange={(_, opt) =>
                  this.setState({ categoryFilter: (opt?.key as string) || 'All' })
                }
                className={styles.filterDropdown}
              />
              <Dropdown
                placeholder="Status"
                options={this._getStatusOptions()}
                selectedKey={this.state.statusFilter}
                onChange={(_, opt) =>
                  this.setState({ statusFilter: (opt?.key as string) || 'All' })
                }
                className={styles.filterDropdown}
              />
            </div>

            <Pivot
              selectedKey={activeTab}
              onLinkClick={(item) => {
                if (item?.props.itemKey) {
                  this.setState({ activeTab: item.props.itemKey });
                }
              }}
              className={styles.pivot}
            >
              <PivotItem headerText="Required Policies" itemKey="Required" />
              <PivotItem headerText="Acknowledged" itemKey="Acknowledged" />
              {showHistoryTab && (
                <PivotItem headerText="All Policies" itemKey="History" />
              )}
            </Pivot>

            {filteredPolicies.length === 0 ? (
              <div className={styles.emptyState}>
                <p>
                  {activeTab === 'Required'
                    ? 'You do not have any pending policies to acknowledge. Great job!'
                    : activeTab === 'Acknowledged'
                      ? 'You have not acknowledged any policies yet.'
                      : 'No policies match your current filters.'}
                </p>
              </div>
            ) : (
              <div className={styles.cardGrid}>
                {filteredPolicies.map((policy) => (
                  <PolicyCard
                    key={policy.id}
                    policy={policy}
                    onViewPolicy={this._onPolicyClick}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {isPanelOpen && selectedPolicy && (
          <PolicyDetailPanel
            policy={selectedPolicy}
            isOpen={isPanelOpen}
            onDismiss={this._onPanelDismiss}
            onAcknowledge={this._onAcknowledge}
          />
        )}
      </section>
    );
  }
}
