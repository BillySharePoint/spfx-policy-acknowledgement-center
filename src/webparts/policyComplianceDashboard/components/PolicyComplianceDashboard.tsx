import * as React from 'react';
import styles from './PolicyComplianceDashboard.module.scss';
import type { IPolicyComplianceDashboardProps } from './IPolicyComplianceDashboardProps';
import {
    Spinner,
    SpinnerSize,
    MessageBar,
    MessageBarType,
    SearchBox,
    Dropdown,
    IDropdownOption,
    DetailsList,
    DetailsListLayoutMode,
    SelectionMode,
    IColumn,
    CommandBar,
    ICommandBarItemProps,
    Panel,
    PanelType,
    Separator,
    Icon,
} from '@fluentui/react';
import { PolicyService } from '../../../services/PolicyService';
import { AcknowledgementService } from '../../../services/AcknowledgementService';
import { ExportService } from '../../../services/ExportService';
import { IPolicy } from '../../../models/IPolicy';
import { IAcknowledgement } from '../../../models/IAcknowledgement';
import { IComplianceSummary } from '../../../models/IComplianceSummary';
import { formatDate, daysOverdue } from '../../../common/PolicyUtils';

export interface IPolicyComplianceDashboardState {
    policies: IPolicy[];
    acknowledgements: IAcknowledgement[];
    summaries: IComplianceSummary[];
    isLoading: boolean;
    error: string | undefined;
    searchText: string;
    categoryFilter: string;
    statusFilter: string;
    departmentFilter: string;
    selectedPolicy: IPolicy | undefined;
    selectedPolicyAcks: IAcknowledgement[];
    isPanelOpen: boolean;
}

export default class PolicyComplianceDashboard extends React.Component<
    IPolicyComplianceDashboardProps,
    IPolicyComplianceDashboardState
> {
    private _policyService: PolicyService;
    private _ackService: AcknowledgementService;

    constructor(props: IPolicyComplianceDashboardProps) {
        super(props);

        this._policyService = new PolicyService(props.context, props.policiesListName);
        this._ackService = new AcknowledgementService(props.context, props.acknowledgementsListName);

        this.state = {
            policies: [],
            acknowledgements: [],
            summaries: [],
            isLoading: true,
            error: undefined,
            searchText: '',
            categoryFilter: 'All',
            statusFilter: 'All',
            departmentFilter: 'All',
            selectedPolicy: undefined,
            selectedPolicyAcks: [],
            isPanelOpen: false,
        };
    }

    public async componentDidMount(): Promise<void> {
        await this._loadData();
    }

    private async _loadData(): Promise<void> {
        this.setState({ isLoading: true, error: undefined });
        try {
            const policies = await this._policyService.getActivePolicies();
            const acknowledgements = await this._ackService.getAllAcknowledgements();
            const summaries = this._buildSummaries(policies, acknowledgements);

            this.setState({
                policies,
                acknowledgements,
                summaries,
                isLoading: false,
            });
        } catch (err) {
            this.setState({
                isLoading: false,
                error: 'Unable to load dashboard data. Please check that the configured SharePoint lists exist and that you have permission.',
            });
            console.error('PolicyCenter Dashboard: Error loading data', err);
        }
    }

    private _buildSummaries(
        policies: IPolicy[],
        acknowledgements: IAcknowledgement[]
    ): IComplianceSummary[] {
        const now = new Date();
        return policies.map((policy) => {
            const policyAcks = acknowledgements.filter(
                (a) =>
                    a.policyId === policy.id &&
                    a.policyVersion === policy.version &&
                    a.acknowledgementStatus === 'Acknowledged'
            );

            const acknowledgedCount = policyAcks.length;
            const overdueCount =
                policy.dueDate && policy.dueDate < now
                    ? policyAcks.length === 0
                        ? 1
                        : 0
                    : 0;

            return {
                policyId: policy.id,
                policyTitle: policy.title,
                policyVersion: policy.version,
                category: policy.category,
                dueDate: policy.dueDate,
                ownerName: policy.ownerName,
                isRequired: policy.isRequired,
                acknowledgedCount,
                pendingCount: undefined,
                overdueCount,
                completionPercentage: undefined,
                assignedCount: undefined,
            };
        });
    }

    private _getFilteredSummaries(): IComplianceSummary[] {
        const { summaries, searchText, categoryFilter } = this.state;

        let filtered = [...summaries];

        if (searchText) {
            const lower = searchText.toLowerCase();
            filtered = filtered.filter((s) =>
                s.policyTitle.toLowerCase().includes(lower)
            );
        }

        if (categoryFilter && categoryFilter !== 'All') {
            filtered = filtered.filter((s) => s.category === categoryFilter);
        }

        return filtered;
    }

    private _getCategories(): IDropdownOption[] {
        const cats = new Set(this.state.summaries.map((s) => s.category));
        const options: IDropdownOption[] = [{ key: 'All', text: 'All Categories' }];
        cats.forEach((c) => options.push({ key: c, text: c }));
        return options;
    }

    private _getDepartments(): IDropdownOption[] {
        const depts = new Set(
            this.state.acknowledgements
                .map((a) => a.department)
                .filter((d) => d && d.trim() !== '')
        );
        const options: IDropdownOption[] = [{ key: 'All', text: 'All Departments' }];
        depts.forEach((d) => options.push({ key: d!, text: d! }));
        return options;
    }

    private _onViewPolicyDetail = (policy: IComplianceSummary): void => {
        const fullPolicy = this.state.policies.find((p) => p.id === policy.policyId);
        const policyAcks = this.state.acknowledgements.filter(
            (a) => a.policyId === policy.policyId
        );
        this.setState({
            selectedPolicy: fullPolicy,
            selectedPolicyAcks: policyAcks,
            isPanelOpen: true,
        });
    };

    private _onExportCsv = (): void => {
        const filtered = this._getFilteredSummaries();
        const rows = filtered.map((s) => ({
            'Policy Title': s.policyTitle,
            'Version': s.policyVersion,
            'Category': s.category,
            'Required': s.isRequired ? 'Yes' : 'No',
            'Due Date': s.dueDate ? formatDate(s.dueDate) : '',
            'Acknowledged Count': s.acknowledgedCount,
            'Owner': s.ownerName || '',
        }));

        ExportService.exportToCsv(
            rows,
            ExportService.generateFilename('policy-compliance-summary')
        );
    };

    private _onExportDetailCsv = (): void => {
        const { selectedPolicy, selectedPolicyAcks } = this.state;
        if (!selectedPolicy) return;

        const rows = selectedPolicyAcks.map((a) => ({
            'Policy Title': a.policyTitleSnapshot,
            'Policy Version': a.policyVersion,
            'Employee Name': a.employeeDisplayName,
            'Employee Email': a.employeeEmail,
            'Department': a.department || '',
            'Job Title': a.jobTitle || '',
            'Acknowledgement Status': a.acknowledgementStatus,
            'Acknowledgement Date': formatDate(a.acknowledgedDate),
            'Due Date': a.dueDateSnapshot ? formatDate(a.dueDateSnapshot) : '',
            'Days Overdue': a.dueDateSnapshot ? daysOverdue(a.dueDateSnapshot).toString() : '0',
            'Comments': a.comments || '',
        }));

        ExportService.exportToCsv(
            rows,
            ExportService.generateFilename(`policy-acknowledgements-${selectedPolicy.id}`)
        );
    };

    private _getColumns(): IColumn[] {
        return [
            {
                key: 'policyTitle',
                name: 'Policy',
                fieldName: 'policyTitle',
                minWidth: 180,
                maxWidth: 300,
                isResizable: true,
                onRender: (item: IComplianceSummary) => (
                    <span
                        className={styles.policyLink}
                        onClick={() => this._onViewPolicyDetail(item)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') this._onViewPolicyDetail(item);
                        }}
                    >
                        {item.policyTitle}
                    </span>
                ),
            },
            {
                key: 'policyVersion',
                name: 'Version',
                fieldName: 'policyVersion',
                minWidth: 60,
                maxWidth: 80,
                isResizable: true,
            },
            {
                key: 'category',
                name: 'Category',
                fieldName: 'category',
                minWidth: 90,
                maxWidth: 130,
                isResizable: true,
            },
            {
                key: 'dueDate',
                name: 'Due Date',
                minWidth: 90,
                maxWidth: 120,
                isResizable: true,
                onRender: (item: IComplianceSummary) => formatDate(item.dueDate),
            },
            {
                key: 'acknowledgedCount',
                name: 'Acknowledged',
                fieldName: 'acknowledgedCount',
                minWidth: 90,
                maxWidth: 110,
                isResizable: true,
            },
            {
                key: 'isRequired',
                name: 'Required',
                minWidth: 70,
                maxWidth: 80,
                isResizable: true,
                onRender: (item: IComplianceSummary) =>
                    item.isRequired ? (
                        <span className={styles.requiredBadge}>Required</span>
                    ) : (
                        <span className={styles.optionalBadge}>Optional</span>
                    ),
            },
            {
                key: 'ownerName',
                name: 'Owner',
                fieldName: 'ownerName',
                minWidth: 100,
                maxWidth: 160,
                isResizable: true,
            },
        ];
    }

    private _getCommandBarItems(): ICommandBarItemProps[] {
        const items: ICommandBarItemProps[] = [
            {
                key: 'refresh',
                text: 'Refresh',
                iconProps: { iconName: 'Refresh' },
                onClick: () => { this._loadData().catch(err => console.error(err)); },
            },
        ];

        if (this.props.enableCsvExport) {
            items.push({
                key: 'export',
                text: 'Export CSV',
                iconProps: { iconName: 'ExcelDocument' },
                onClick: () => this._onExportCsv(),
            });
        }

        return items;
    }

    public render(): React.ReactElement<IPolicyComplianceDashboardProps> {
        const {
            isLoading,
            error,
            summaries,
            isPanelOpen,
            selectedPolicy,
            selectedPolicyAcks,
        } = this.state;
        const { hasTeamsContext, showDepartmentFilter, enableCsvExport } = this.props;

        const filteredSummaries = this._getFilteredSummaries();

        // Metrics
        const totalActive = summaries.length;
        const totalRequired = summaries.filter((s) => s.isRequired).length;
        const totalAcks = summaries.reduce((sum, s) => sum + s.acknowledgedCount, 0);
        const now = new Date();
        const dueThisWeek = summaries.filter((s) => {
            if (!s.dueDate) return false;
            const diffDays = (s.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
            return diffDays >= 0 && diffDays <= 7;
        }).length;

        return (
            <section className={`${styles.policyComplianceDashboard} ${hasTeamsContext ? styles.teams : ''}`}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Policy Compliance Dashboard</h2>
                    <p className={styles.subtitle}>
                        Track policy acknowledgement status across the organization.
                    </p>
                </div>

                {error && (
                    <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>
                )}

                {isLoading ? (
                    <div className={styles.spinnerContainer}>
                        <Spinner size={SpinnerSize.large} label="Loading dashboard data..." />
                    </div>
                ) : (
                    <>
                        {/* Metric Cards */}
                        <div className={styles.metricCards}>
                            <div className={`${styles.metricCard} ${styles.metricBlue}`}>
                                <div className={styles.metricNumber}>{totalActive}</div>
                                <div className={styles.metricLabel}>Active Policies</div>
                            </div>
                            <div className={`${styles.metricCard} ${styles.metricGreen}`}>
                                <div className={styles.metricNumber}>{totalAcks}</div>
                                <div className={styles.metricLabel}>Total Acknowledgements</div>
                            </div>
                            <div className={`${styles.metricCard} ${styles.metricPurple}`}>
                                <div className={styles.metricNumber}>{totalRequired}</div>
                                <div className={styles.metricLabel}>Required Policies</div>
                            </div>
                            <div className={`${styles.metricCard} ${styles.metricOrange}`}>
                                <div className={styles.metricNumber}>{dueThisWeek}</div>
                                <div className={styles.metricLabel}>Due This Week</div>
                            </div>
                        </div>

                        {/* Command Bar */}
                        <CommandBar items={this._getCommandBarItems()} className={styles.commandBar} />

                        {/* Filters */}
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
                            {showDepartmentFilter && (
                                <Dropdown
                                    placeholder="Department"
                                    options={this._getDepartments()}
                                    selectedKey={this.state.departmentFilter}
                                    onChange={(_, opt) =>
                                        this.setState({ departmentFilter: (opt?.key as string) || 'All' })
                                    }
                                    className={styles.filterDropdown}
                                />
                            )}
                        </div>

                        {/* Data Table */}
                        {filteredSummaries.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>
                                    No acknowledgement records were found. Publish policies and ask employees
                                    to acknowledge them to populate the dashboard.
                                </p>
                            </div>
                        ) : (
                            <DetailsList
                                items={filteredSummaries}
                                columns={this._getColumns()}
                                layoutMode={DetailsListLayoutMode.justified}
                                selectionMode={SelectionMode.none}
                                isHeaderVisible={true}
                                className={styles.dataTable}
                            />
                        )}
                    </>
                )}

                {/* Policy Detail Panel */}
                {isPanelOpen && selectedPolicy && (
                    <Panel
                        isOpen={isPanelOpen}
                        onDismiss={() =>
                            this.setState({ isPanelOpen: false, selectedPolicy: undefined })
                        }
                        type={PanelType.large}
                        headerText={selectedPolicy.title}
                        closeButtonAriaLabel="Close"
                    >
                        <div className={styles.panelContent}>
                            <div className={styles.panelMeta}>
                                <div className={styles.panelMetaItem}>
                                    <Icon iconName="Tag" />
                                    <span className={styles.metaLabel}>Category:</span>
                                    <span>{selectedPolicy.category}</span>
                                </div>
                                <div className={styles.panelMetaItem}>
                                    <Icon iconName="History" />
                                    <span className={styles.metaLabel}>Version:</span>
                                    <span>{selectedPolicy.version}</span>
                                </div>
                                <div className={styles.panelMetaItem}>
                                    <Icon iconName="Calendar" />
                                    <span className={styles.metaLabel}>Due Date:</span>
                                    <span>{formatDate(selectedPolicy.dueDate)}</span>
                                </div>
                                <div className={styles.panelMetaItem}>
                                    <Icon iconName="Contact" />
                                    <span className={styles.metaLabel}>Owner:</span>
                                    <span>{selectedPolicy.ownerName || '—'}</span>
                                </div>
                            </div>

                            <Separator />

                            <div className={styles.panelActions}>
                                <h3>Acknowledgement Records ({selectedPolicyAcks.length})</h3>
                                {enableCsvExport && selectedPolicyAcks.length > 0 && (
                                    <CommandBar
                                        items={[
                                            {
                                                key: 'exportDetail',
                                                text: 'Export Acknowledgements',
                                                iconProps: { iconName: 'ExcelDocument' },
                                                onClick: () => this._onExportDetailCsv(),
                                            },
                                        ]}
                                    />
                                )}
                            </div>

                            {selectedPolicyAcks.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <p>No acknowledgement records found for this policy.</p>
                                </div>
                            ) : (
                                <DetailsList
                                    items={selectedPolicyAcks}
                                    columns={[
                                        {
                                            key: 'employeeDisplayName',
                                            name: 'Employee',
                                            fieldName: 'employeeDisplayName',
                                            minWidth: 120,
                                            maxWidth: 200,
                                            isResizable: true,
                                        },
                                        {
                                            key: 'employeeEmail',
                                            name: 'Email',
                                            fieldName: 'employeeEmail',
                                            minWidth: 150,
                                            maxWidth: 250,
                                            isResizable: true,
                                        },
                                        {
                                            key: 'department',
                                            name: 'Department',
                                            fieldName: 'department',
                                            minWidth: 100,
                                            maxWidth: 150,
                                            isResizable: true,
                                        },
                                        {
                                            key: 'policyVersion',
                                            name: 'Version',
                                            fieldName: 'policyVersion',
                                            minWidth: 60,
                                            maxWidth: 80,
                                            isResizable: true,
                                        },
                                        {
                                            key: 'acknowledgedDate',
                                            name: 'Acknowledged Date',
                                            minWidth: 120,
                                            maxWidth: 160,
                                            isResizable: true,
                                            onRender: (item: IAcknowledgement) =>
                                                formatDate(item.acknowledgedDate),
                                        },
                                        {
                                            key: 'acknowledgementStatus',
                                            name: 'Status',
                                            fieldName: 'acknowledgementStatus',
                                            minWidth: 90,
                                            maxWidth: 110,
                                            isResizable: true,
                                        },
                                    ]}
                                    layoutMode={DetailsListLayoutMode.justified}
                                    selectionMode={SelectionMode.none}
                                    isHeaderVisible={true}
                                    className={styles.dataTable}
                                />
                            )}
                        </div>
                    </Panel>
                )}
            </section>
        );
    }
}
