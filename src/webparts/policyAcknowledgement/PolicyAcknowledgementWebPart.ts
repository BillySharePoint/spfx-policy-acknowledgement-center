import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import PolicyAcknowledgement from './components/PolicyAcknowledgement';
import { IPolicyAcknowledgementProps } from './components/IPolicyAcknowledgementProps';

export interface IPolicyAcknowledgementWebPartProps {
  policiesListName: string;
  acknowledgementsListName: string;
  showHistoryTab: boolean;
  enableDepartmentTargeting: boolean;
  useGraphProfileDepartment: boolean;
  defaultView: string;
  showOptionalPolicies: boolean;
  pageSize: number;
}

export default class PolicyAcknowledgementWebPart extends BaseClientSideWebPart<IPolicyAcknowledgementWebPartProps> {

  private _isDarkTheme: boolean = false;

  public render(): void {
    const element: React.ReactElement<IPolicyAcknowledgementProps> = React.createElement(
      PolicyAcknowledgement,
      {
        context: this.context,
        policiesListName: this.properties.policiesListName || 'Policy Center - Policies',
        acknowledgementsListName: this.properties.acknowledgementsListName || 'Policy Center - Acknowledgements',
        showHistoryTab: this.properties.showHistoryTab !== false,
        enableDepartmentTargeting: this.properties.enableDepartmentTargeting !== false,
        useGraphProfileDepartment: this.properties.useGraphProfileDepartment !== false,
        defaultView: this.properties.defaultView || 'Required',
        showOptionalPolicies: this.properties.showOptionalPolicies !== false,
        pageSize: this.properties.pageSize || 10,
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
            description: 'Configure the Policy Acknowledgement web part settings.'
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
                PropertyPaneToggle('showHistoryTab', {
                  label: 'Show History Tab',
                  checked: this.properties.showHistoryTab !== false
                }),
                PropertyPaneToggle('showOptionalPolicies', {
                  label: 'Show Optional Policies',
                  checked: this.properties.showOptionalPolicies !== false
                }),
                PropertyPaneDropdown('defaultView', {
                  label: 'Default View',
                  options: [
                    { key: 'Required', text: 'Required Policies' },
                    { key: 'All', text: 'All Policies' },
                    { key: 'History', text: 'History' }
                  ],
                  selectedKey: this.properties.defaultView || 'Required'
                }),
                PropertyPaneSlider('pageSize', {
                  label: 'Page Size',
                  min: 5,
                  max: 50,
                  step: 5,
                  value: this.properties.pageSize || 10
                })
              ]
            },
            {
              groupName: 'Department Targeting',
              groupFields: [
                PropertyPaneToggle('enableDepartmentTargeting', {
                  label: 'Enable Department Targeting',
                  checked: this.properties.enableDepartmentTargeting !== false
                }),
                PropertyPaneToggle('useGraphProfileDepartment', {
                  label: 'Use Graph Profile for Department',
                  checked: this.properties.useGraphProfileDepartment !== false
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
