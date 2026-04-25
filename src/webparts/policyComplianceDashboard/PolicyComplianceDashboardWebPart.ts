import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
    type IPropertyPaneConfiguration,
    PropertyPaneTextField,
    PropertyPaneToggle,
    PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import PolicyComplianceDashboard from './components/PolicyComplianceDashboard';
import { IPolicyComplianceDashboardProps } from './components/IPolicyComplianceDashboardProps';

export interface IPolicyComplianceDashboardWebPartProps {
    policiesListName: string;
    acknowledgementsListName: string;
    adminGroupName: string;
    enableCsvExport: boolean;
    showDepartmentFilter: boolean;
    pageSize: number;
}

export default class PolicyComplianceDashboardWebPart extends BaseClientSideWebPart<IPolicyComplianceDashboardWebPartProps> {

    private _isDarkTheme: boolean = false;

    public render(): void {
        const element: React.ReactElement<IPolicyComplianceDashboardProps> = React.createElement(
            PolicyComplianceDashboard,
            {
                context: this.context,
                policiesListName: this.properties.policiesListName || 'Policy Center - Policies',
                acknowledgementsListName: this.properties.acknowledgementsListName || 'Policy Center - Acknowledgements',
                enableCsvExport: this.properties.enableCsvExport !== false,
                showDepartmentFilter: this.properties.showDepartmentFilter !== false,
                pageSize: this.properties.pageSize || 25,
                isDarkTheme: this._isDarkTheme,
                hasTeamsContext: !!this.context.sdks.microsoftTeams,
            }
        );

        ReactDom.render(element, this.domElement);
    }

    protected onInit(): Promise<void> {
        return Promise.resolve();
    }

    protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
        if (!currentTheme) {
            return;
        }

        this._isDarkTheme = !!currentTheme.isInverted;
        const { semanticColors } = currentTheme;

        if (semanticColors) {
            this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
            this.domElement.style.setProperty('--link', semanticColors.link || null);
            this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
        }
    }

    protected onDispose(): void {
        ReactDom.unmountComponentAtNode(this.domElement);
    }

    protected get dataVersion(): Version {
        return Version.parse('1.0');
    }

    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
        return {
            pages: [
                {
                    header: {
                        description: 'Configure the Policy Compliance Dashboard web part settings.'
                    },
                    groups: [
                        {
                            groupName: 'Data Sources',
                            groupFields: [
                                PropertyPaneTextField('policiesListName', {
                                    label: 'Policies List Name',
                                    value: this.properties.policiesListName || 'Policy Center - Policies'
                                }),
                                PropertyPaneTextField('acknowledgementsListName', {
                                    label: 'Acknowledgements List Name',
                                    value: this.properties.acknowledgementsListName || 'Policy Center - Acknowledgements'
                                })
                            ]
                        },
                        {
                            groupName: 'Display Settings',
                            groupFields: [
                                PropertyPaneToggle('enableCsvExport', {
                                    label: 'Enable CSV Export',
                                    checked: this.properties.enableCsvExport !== false
                                }),
                                PropertyPaneToggle('showDepartmentFilter', {
                                    label: 'Show Department Filter',
                                    checked: this.properties.showDepartmentFilter !== false
                                }),
                                PropertyPaneSlider('pageSize', {
                                    label: 'Page Size',
                                    min: 10,
                                    max: 100,
                                    step: 5,
                                    value: this.properties.pageSize || 25
                                })
                            ]
                        },
                        {
                            groupName: 'Security',
                            groupFields: [
                                PropertyPaneTextField('adminGroupName', {
                                    label: 'Admin Group Name (optional)',
                                    description: 'SharePoint or M365 group name to restrict dashboard access'
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    }
}
