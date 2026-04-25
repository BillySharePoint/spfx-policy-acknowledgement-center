# SPFx Policy Acknowledgement Center for SharePoint Intranets

## Project Goal

Build an open-source SharePoint Framework solution called **SPFx Policy Acknowledgement Center**.

This project should demonstrate how SharePoint Online can be used as a lightweight compliance, policy acknowledgement, and intranet governance platform without needing a separate third-party product.

The project should be portfolio-ready, visually polished, and practical enough that a SharePoint Developer, SharePoint Admin, or Microsoft 365 consultant could show it to hiring managers, technical interviewers, or potential clients.

The solution should include employee-facing policy acknowledgement features and an admin-facing compliance dashboard.

---

## Recommended GitHub Repository Name

```text
spfx-policy-acknowledgement-center
```

## Recommended GitHub Description

```text
An open-source SharePoint Framework solution for managing policy acknowledgements, employee compliance tracking, and intranet governance in Microsoft 365.
```

## Recommended Website/Portfolio Title

```text
Open-Source SPFx Policy Acknowledgement Center for SharePoint Intranets
```

## Portfolio Positioning Statement

Use this language in the README, blog post, and website project card:

> I built an open-source SPFx Policy Acknowledgement Center to show how SharePoint Online can be used for compliance tracking, employee communication, and intranet governance without needing a separate third-party platform.

---

# Why This Project Matters

Many organizations publish important policies in SharePoint, but they often lack a clean way to confirm that employees have read and acknowledged them.

Examples include:

- Acceptable Use Policy
- Remote Work Policy
- Information Security Policy
- Data Handling Policy
- HR Handbook
- Code of Conduct
- AI Usage Policy
- Records Retention Policy
- Privacy Policy
- Safety Procedures
- Department-specific SOPs

The business problem:

- Policies are published, but employees may not read them.
- HR, IT, Legal, Security, and Compliance teams need proof of acknowledgement.
- Managers need visibility into who has not completed required acknowledgements.
- Policies change over time, and each version needs to be tracked.
- Manual tracking through email or spreadsheets becomes messy.

This project solves that problem using:

- SharePoint Framework
- SharePoint lists
- PnPjs
- Fluent UI
- Microsoft Graph where appropriate
- Modern SharePoint pages
- Optional CSV export
- Optional list provisioning

---

# Primary Audience

This solution is intended for:

- SharePoint developers
- SharePoint administrators
- Microsoft 365 consultants
- Intranet owners
- HR teams
- IT governance teams
- Compliance teams
- Internal communications teams

---

# Main Use Cases

## Employee Use Case

An employee visits the company intranet and sees policies assigned to them.

They can:

- View required policies
- See due dates
- Open policy details
- Read policy description and link to the policy document
- See whether acknowledgement is required
- Click an acknowledgement checkbox
- Submit acknowledgement
- View acknowledgement history
- See overdue policies

## Admin/Owner Use Case

A policy owner, intranet owner, or admin can:

- Publish policies
- Set policy version numbers
- Set due dates
- Mark policies as active or inactive
- Assign policies by department or audience
- Track acknowledgement completion
- View overdue acknowledgements
- Filter reports by policy, department, status, or due date
- Export acknowledgement data
- Review policy version history

## Manager Use Case

A manager can:

- View acknowledgement status for their department or team
- See who is overdue
- Follow up with users who have not acknowledged required policies

---

# Solution Overview

The solution should contain at least two SPFx web parts:

1. **Policy Acknowledgement Web Part**
2. **Policy Compliance Dashboard Web Part**

Optional future web parts:

3. **My Policy History Web Part**
4. **Policy Owner Management Web Part**
5. **Viva Connections Policy Card / ACE**

---

# Recommended Technology Stack

Use the current supported SharePoint Framework toolchain available to the coding agent environment.

Recommended technologies:

- SharePoint Framework
- React
- TypeScript
- Fluent UI React
- PnPjs
- Microsoft Graph Toolkit or Graph client where useful
- SharePoint REST/PnPjs for list operations
- CSS modules or SCSS modules
- ESLint
- Jest where practical
- Optional Playwright for UI testing

Suggested libraries:

```text
@pnp/sp
@pnp/graph
@fluentui/react
@microsoft/sp-core-library
@microsoft/sp-webpart-base
@microsoft/sp-http
```

Use PnPjs for SharePoint list operations unless there is a specific reason not to.

---

# Core Features

## Feature 1: Employee Policy List

The employee-facing web part should show policies relevant to the current user.

Display fields:

- Policy title
- Category
- Policy version
- Due date
- Status
- Required/optional flag
- Acknowledgement status
- Last acknowledged date
- Policy owner
- Link to policy document or page

Suggested statuses:

```text
Not Started
Acknowledged
Overdue
Expired
Optional
```

Business rules:

- If a policy is active and required but has not been acknowledged, show as `Not Started`.
- If current date is past due date and not acknowledged, show as `Overdue`.
- If acknowledged, show as `Acknowledged`.
- If a policy is inactive, do not show it to employees by default.
- If a newer version of a policy is published, previous acknowledgements should not count for the new version unless the admin allows it.

---

## Feature 2: Policy Detail View

When a user clicks a policy, show a detail panel or modal.

The policy detail should include:

- Policy title
- Version
- Category
- Description
- Due date
- Policy owner
- Policy document link
- Acknowledgement instructions
- Required acknowledgement checkbox
- Submit acknowledgement button

Example acknowledgement text:

```text
I confirm that I have read and understood this policy.
```

The user must check the box before submitting.

After submission:

- Create a record in the Policy Acknowledgements list.
- Store the current user.
- Store the policy lookup.
- Store the policy version.
- Store acknowledgement date/time.
- Store acknowledgement status.
- Store optional metadata such as department and job title if available.
- Show success message.
- Refresh the policy list.

---

## Feature 3: Acknowledgement History

Employees should be able to view their acknowledgement history.

Display:

- Policy title
- Version acknowledged
- Acknowledgement date
- Status
- Due date

This can be part of the employee web part or a separate tab.

Suggested tabs:

```text
Required Policies
Acknowledged
History
```

---

## Feature 4: Admin Compliance Dashboard

Create a second SPFx web part for admins/policy owners.

The dashboard should show high-level metrics:

- Total active policies
- Total required acknowledgements
- Total completed acknowledgements
- Total overdue acknowledgements
- Completion percentage
- Overdue percentage
- Policies nearing due date

Suggested dashboard cards:

```text
Active Policies: 12
Completion Rate: 84%
Overdue Users: 19
Due This Week: 4
```

Suggested table columns:

- Policy title
- Version
- Category
- Due date
- Total assigned users
- Acknowledged count
- Pending count
- Overdue count
- Completion percentage
- Owner

Filters:

- Policy
- Category
- Department
- Status
- Due date range
- Owner

Actions:

- View details
- Export CSV
- Refresh data

---

## Feature 5: Policy Version Tracking

Each policy should have a version field.

Example versions:

```text
1.0
1.1
2.0
2026.04
```

Rules:

- Acknowledgement records must store the policy version at the time of acknowledgement.
- If a policy version changes, users should be required to acknowledge the new version.
- Admin dashboard should show acknowledgement status by version.
- Historical acknowledgement data should not be overwritten.

---

## Feature 6: Department or Audience Assignment

Use SharePoint list fields to assign policies by department or audience.

Minimum viable approach:

- Add a `Target Departments` multi-choice field on the Policies list.
- Add a `Department` field to users by reading from Microsoft Graph profile or manually mapping users in a SharePoint list.

Simple MVP behavior:

- If policy has no target department, show it to all users.
- If policy has target departments, show it only if the current user's department matches.

Alternative approach:

- Use a `Policy Assignments` list to explicitly map policies to departments, groups, or users.

Recommended MVP:

Start with department-based targeting using a choice field. Keep the architecture flexible for future Azure AD group targeting.

---

## Feature 7: CSV Export

The admin dashboard should support exporting acknowledgement data to CSV.

CSV columns:

```text
Policy Title
Policy Version
Policy Category
Required
Due Date
Employee Name
Employee Email
Department
Acknowledgement Status
Acknowledgement Date
Days Overdue
Policy Owner
```

Export should respect current filters where possible.

---

## Feature 8: Search and Filtering

Employee web part filters:

- Search by policy title
- Filter by category
- Filter by status

Admin dashboard filters:

- Search by policy title
- Filter by category
- Filter by department
- Filter by status
- Filter by due date
- Filter by owner

---

## Feature 9: Responsive UI

The UI should work well in:

- Full-width SharePoint section
- One-column page layout
- Two-column layout
- Mobile view
- Teams/Viva Connections context where possible

Use clean spacing, modern cards, and Fluent UI components.

---

# SharePoint List Architecture

The solution should use SharePoint lists as the backend.

## List 1: Policies

Internal name suggestion:

```text
PolicyCenterPolicies
```

Display name:

```text
Policy Center - Policies
```

Purpose:

Stores the master list of policies.

Fields:

| Field Display Name | Internal Name | Type | Required | Notes |
|---|---|---:|---:|---|
| Title | Title | Single line text | Yes | Policy title |
| Policy ID | PolicyId | Single line text | Yes | Optional unique business ID |
| Description | PolicyDescription | Multiple lines text | No | Summary of the policy |
| Category | PolicyCategory | Choice | Yes | HR, IT, Security, Compliance, Operations, Finance, Other |
| Version | PolicyVersion | Single line text | Yes | Example: 1.0, 2.0, 2026.04 |
| Policy Document URL | PolicyDocumentUrl | Hyperlink | Yes | Link to PDF, Word document, or SharePoint page |
| Owner | PolicyOwner | Person | No | Policy owner |
| Required | IsRequired | Yes/No | Yes | Default true |
| Active | IsActive | Yes/No | Yes | Default true |
| Due Date | DueDate | Date only | No | Required acknowledgement deadline |
| Effective Date | EffectiveDate | Date only | No | Date policy becomes active |
| Expiry Date | ExpiryDate | Date only | No | Optional expiration date |
| Target Departments | TargetDepartments | Choice multi-select | No | Empty means all departments |
| Acknowledgement Text | AcknowledgementText | Multiple lines text | No | Custom acknowledgement statement |
| Sort Order | SortOrder | Number | No | Optional display order |

Suggested category choices:

```text
HR
IT
Security
Compliance
Operations
Finance
Legal
Facilities
Other
```

Suggested target department choices:

```text
All
Human Resources
Information Technology
Finance
Operations
Sales
Marketing
Legal
Executive
Other
```

---

## List 2: Policy Acknowledgements

Internal name suggestion:

```text
PolicyCenterAcknowledgements
```

Display name:

```text
Policy Center - Acknowledgements
```

Purpose:

Stores employee acknowledgement records.

Fields:

| Field Display Name | Internal Name | Type | Required | Notes |
|---|---|---:|---:|---|
| Title | Title | Single line text | Yes | Can be generated as PolicyTitle - UserEmail - Version |
| Policy | PolicyLookup | Lookup | Yes | Lookup to Policies list |
| Policy Title Snapshot | PolicyTitleSnapshot | Single line text | Yes | Store title at time of acknowledgement |
| Policy Version | PolicyVersion | Single line text | Yes | Version acknowledged |
| Employee | Employee | Person | Yes | User who acknowledged |
| Employee Email | EmployeeEmail | Single line text | Yes | Easier reporting/export |
| Employee Display Name | EmployeeDisplayName | Single line text | Yes | Easier reporting/export |
| Department | Department | Single line text | No | From Graph profile or manual mapping |
| Job Title | JobTitle | Single line text | No | Optional from Graph profile |
| Acknowledged Date | AcknowledgedDate | Date and time | Yes | Date/time submitted |
| Acknowledgement Status | AcknowledgementStatus | Choice | Yes | Acknowledged, Superseded, Revoked |
| Due Date Snapshot | DueDateSnapshot | Date only | No | Due date at time of acknowledgement |
| Comments | Comments | Multiple lines text | No | Optional |

Suggested acknowledgement status choices:

```text
Acknowledged
Superseded
Revoked
```

Important:

- Do not update old acknowledgement records when policy version changes.
- Keep historical records.
- If user acknowledges version 1.0 and policy becomes 2.0, version 1.0 acknowledgement remains but no longer satisfies version 2.0.

---

## List 3: Policy Assignments Optional

Internal name suggestion:

```text
PolicyCenterAssignments
```

Display name:

```text
Policy Center - Assignments
```

Purpose:

Optional advanced assignment list for future enhancement.

Fields:

| Field Display Name | Internal Name | Type | Required | Notes |
|---|---|---:|---:|---|
| Title | Title | Single line text | Yes | Assignment name |
| Policy | PolicyLookup | Lookup | Yes | Related policy |
| Assignment Type | AssignmentType | Choice | Yes | Department, User, Group |
| Department | Department | Single line text | No | Used when assignment type is Department |
| User | AssignedUser | Person | No | Used when assignment type is User |
| Group ID | GroupId | Single line text | No | Future Graph group targeting |
| Required | IsRequired | Yes/No | Yes | Default true |
| Due Date Override | DueDateOverride | Date only | No | Optional assignment-specific due date |

For MVP, this list can be documented but not required.

---

## List 4: Policy Center Settings Optional

Internal name suggestion:

```text
PolicyCenterSettings
```

Display name:

```text
Policy Center - Settings
```

Purpose:

Optional configuration list.

Fields:

| Field Display Name | Internal Name | Type | Notes |
|---|---|---:|---|
| Title | Title | Single line text | Setting key |
| Value | SettingValue | Multiple lines text | Setting value |
| Description | SettingDescription | Multiple lines text | Explanation |

Possible settings:

```text
EnableGraphProfileLookup
DefaultAcknowledgementText
EnableCsvExport
EnableDepartmentTargeting
AdminGroupName
```

---

# SPFx Web Part 1: Policy Acknowledgement

## Web Part Name

```text
PolicyAcknowledgement
```

## Display Name

```text
Policy Acknowledgement
```

## Purpose

Employee-facing web part where users view and acknowledge assigned policies.

## Property Pane Settings

The web part should have configurable settings:

| Property | Type | Required | Description |
|---|---|---:|---|
| Policies List Name | Text | Yes | Default: Policy Center - Policies |
| Acknowledgements List Name | Text | Yes | Default: Policy Center - Acknowledgements |
| Show History Tab | Toggle | No | Default true |
| Enable Department Targeting | Toggle | No | Default true |
| Use Graph Profile Department | Toggle | No | Default true |
| Default View | Dropdown | No | Required, All, History |
| Show Optional Policies | Toggle | No | Default true |
| Page Size | Number | No | Default 10 |

## UI Layout

Suggested layout:

```text
Header
- Title: My Required Policies
- Subtitle: Review and acknowledge company policies assigned to you.

Summary cards
- Required
- Acknowledged
- Overdue
- Optional

Tabs
- Required Policies
- Acknowledged
- History

Policy cards/table
- Policy title
- Category
- Version
- Due date
- Status badge
- Action button
```

## Employee Action Buttons

Possible buttons:

```text
View Policy
Acknowledge
View History
```

## Status Badge Design

Use clear visual labels:

```text
Acknowledged
Not Started
Overdue
Optional
Expired
```

Use Fluent UI badges, pills, or labels.

## Acknowledgement Flow

1. User clicks `View Policy`.
2. Detail panel opens.
3. User reads the information and opens the policy document link.
4. User checks acknowledgement checkbox.
5. User clicks `Submit Acknowledgement`.
6. System validates that current policy version has not already been acknowledged.
7. System writes a record to the Acknowledgements list.
8. UI shows success message.
9. Policy status updates to `Acknowledged`.

## Duplicate Acknowledgement Handling

Before creating a new acknowledgement, check whether the current user already acknowledged the same policy version.

Match by:

```text
PolicyLookup ID
PolicyVersion
EmployeeEmail
AcknowledgementStatus = Acknowledged
```

If already acknowledged, show:

```text
You have already acknowledged this version of the policy.
```

---

# SPFx Web Part 2: Policy Compliance Dashboard

## Web Part Name

```text
PolicyComplianceDashboard
```

## Display Name

```text
Policy Compliance Dashboard
```

## Purpose

Admin-facing dashboard for policy owners, intranet managers, HR, IT, or compliance teams.

## Property Pane Settings

| Property | Type | Required | Description |
|---|---|---:|---|
| Policies List Name | Text | Yes | Default: Policy Center - Policies |
| Acknowledgements List Name | Text | Yes | Default: Policy Center - Acknowledgements |
| Admin Group Name | Text | No | Optional SharePoint/M365 group name |
| Enable CSV Export | Toggle | No | Default true |
| Show Department Filter | Toggle | No | Default true |
| Page Size | Number | No | Default 25 |

## UI Layout

Suggested layout:

```text
Header
- Title: Policy Compliance Dashboard
- Subtitle: Track policy acknowledgement status across the organization.

Metric cards
- Active Policies
- Completion Rate
- Overdue Users
- Due This Week

Filters
- Search
- Policy
- Category
- Department
- Status
- Due Date Range

Table
- Policy
- Version
- Category
- Due Date
- Assigned
- Acknowledged
- Pending
- Overdue
- Completion %
- Owner

Actions
- View Details
- Export CSV
- Refresh
```

## Detail View

When admin clicks a policy, show a detail panel with:

- Policy details
- Completion summary
- Employee acknowledgement rows
- Pending users if assignment data is available
- Overdue users
- CSV export for selected policy

## Important MVP Constraint

If the project does not have a complete employee directory or assignment list, the dashboard may not know every user who is supposed to acknowledge a policy.

For MVP, provide two reporting modes:

### Mode 1: Acknowledgement-Based Reporting

Uses existing acknowledgement records only.

Can show:

- Who acknowledged
- When they acknowledged
- What version they acknowledged
- Department if stored

Cannot fully show who is missing unless assignment data exists.

### Mode 2: Assignment-Based Reporting

Uses a target user/department list or assignment list.

Can show:

- Assigned users
- Acknowledged users
- Pending users
- Overdue users

For MVP, document this clearly in README.

---

# Optional SPFx Web Part 3: Policy Owner Management

This is optional and can be added later.

Purpose:

Allow policy owners to create/edit policies directly from a SharePoint page instead of editing the SharePoint list manually.

Features:

- Create policy
- Edit policy
- Deactivate policy
- Publish new version
- Validate required fields
- View previous versions

Recommendation:

Do not build this first unless the coding agent can complete the MVP quickly. Start with list-backed configuration.

---

# Optional Viva Connections Extension

Future enhancement:

Create a Viva Connections Adaptive Card Extension that shows:

```text
You have 3 policies to acknowledge
1 overdue policy
Open Policy Center
```

This would make the project look even more modern and aligned with Microsoft 365 employee experience.

---

# Data Access Layer

Create a clean service layer.

Suggested folders:

```text
/src/services
  PolicyService.ts
  AcknowledgementService.ts
  UserProfileService.ts
  ExportService.ts
  ListProvisioningService.ts
```

## PolicyService.ts

Responsibilities:

- Get active policies
- Get policy by ID
- Get policies by category
- Get policies relevant to user department
- Parse SharePoint list fields into strongly typed objects

## AcknowledgementService.ts

Responsibilities:

- Get current user's acknowledgements
- Check if policy version is already acknowledged
- Create acknowledgement record
- Get acknowledgement records for dashboard
- Get acknowledgement records by policy

## UserProfileService.ts

Responsibilities:

- Get current user email/display name from page context
- Optionally get department and job title from Microsoft Graph
- Fallback gracefully if Graph profile data is unavailable

## ExportService.ts

Responsibilities:

- Convert dashboard rows to CSV
- Download CSV in browser
- Respect filters when exporting

## ListProvisioningService.ts Optional

Responsibilities:

- Check whether required lists exist
- Create lists if they do not exist
- Create fields if they do not exist
- Create sample data if enabled

---

# TypeScript Interfaces

Create strong interfaces.

Suggested file:

```text
/src/models/IPolicy.ts
```

```typescript
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
```

Suggested file:

```text
/src/models/IAcknowledgement.ts
```

```typescript
export interface IAcknowledgement {
  id: number;
  policyId: number;
  policyTitleSnapshot: string;
  policyVersion: string;
  employeeDisplayName: string;
  employeeEmail: string;
  department?: string;
  jobTitle?: string;
  acknowledgedDate: Date;
  acknowledgementStatus: 'Acknowledged' | 'Superseded' | 'Revoked';
  dueDateSnapshot?: Date;
  comments?: string;
}
```

Suggested file:

```text
/src/models/IUserProfile.ts
```

```typescript
export interface IUserProfile {
  displayName: string;
  email: string;
  department?: string;
  jobTitle?: string;
}
```

Suggested file:

```text
/src/models/IPolicyStatus.ts
```

```typescript
export type PolicyStatus =
  | 'NotStarted'
  | 'Acknowledged'
  | 'Overdue'
  | 'Optional'
  | 'Expired';

export interface IPolicyWithStatus extends IPolicy {
  status: PolicyStatus;
  acknowledgedDate?: Date;
  acknowledgedVersion?: string;
}
```

Suggested file:

```text
/src/models/IComplianceSummary.ts
```

```typescript
export interface IComplianceSummary {
  policyId: number;
  policyTitle: string;
  policyVersion: string;
  category: string;
  dueDate?: Date;
  assignedCount?: number;
  acknowledgedCount: number;
  pendingCount?: number;
  overdueCount?: number;
  completionPercentage?: number;
  ownerName?: string;
}
```

---

# Suggested Folder Structure

```text
spfx-policy-acknowledgement-center/
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CHANGELOG.md
├── SECURITY.md
├── docs/
│   ├── setup-guide.md
│   ├── deployment-guide.md
│   ├── configuration-guide.md
│   ├── list-schema.md
│   ├── permissions.md
│   ├── architecture.md
│   ├── screenshots.md
│   └── roadmap.md
├── sample-data/
│   ├── policies.sample.json
│   ├── acknowledgements.sample.json
│   └── departments.sample.json
├── assets/
│   ├── screenshots/
│   └── diagrams/
├── src/
│   ├── models/
│   ├── services/
│   ├── common/
│   ├── controls/
│   └── webparts/
│       ├── policyAcknowledgement/
│       └── policyComplianceDashboard/
└── sharepoint/
    └── solution/
```

---

# UI/UX Requirements

## Visual Style

The UI should feel modern and enterprise-ready.

Use:

- Clean card layout
- Fluent UI components
- Status badges
- Responsive tables
- Clear buttons
- Empty states
- Loading states
- Error states
- Accessible color contrast

## Empty States

Examples:

No assigned policies:

```text
You do not have any policies assigned at this time.
```

No acknowledgements yet:

```text
You have not acknowledged any policies yet.
```

No dashboard data:

```text
No acknowledgement records were found. Publish policies and ask employees to acknowledge them to populate the dashboard.
```

## Loading States

Show a spinner or skeleton loader while data is loading.

Example:

```text
Loading policies...
```

## Error States

Handle errors gracefully.

Examples:

```text
Unable to load policies. Please check that the configured SharePoint list exists and that you have permission to view it.
```

```text
Unable to save acknowledgement. Please try again or contact your SharePoint administrator.
```

---

# Accessibility Requirements

Follow basic accessibility practices:

- Buttons must have meaningful labels.
- Form controls must have labels.
- Status should not rely only on color.
- Use semantic headings.
- Ensure keyboard navigation works.
- Modal/panel should be dismissible.
- Use ARIA labels where needed.
- Tables should have headers.

---

# Permissions and Security

## SharePoint Permissions

Minimum required permissions:

Employee users:

- Read access to Policies list
- Add item permission to Acknowledgements list
- Read own acknowledgement records

Admin/policy owners:

- Read/write access to Policies list
- Read access to Acknowledgements list
- Export access based on list permissions

Important:

For a real production deployment, item-level permissions may be needed on the Acknowledgements list if acknowledgement data is sensitive.

## Item-Level Privacy Consideration

Acknowledgement records may contain employee names, email addresses, department, and compliance status.

The README should clearly state:

```text
This project is a sample open-source implementation. Before production use, review list permissions, privacy requirements, retention policies, and compliance obligations with your organization.
```

## Microsoft Graph Permissions

If using Graph profile lookup, the solution may require permission to read user profile data.

Possible Graph permission:

```text
User.Read
```

Depending on implementation, additional permissions may be required for directory lookups. Keep Graph usage minimal in MVP.

Recommended MVP:

- Use page context for current user name/email.
- Use Graph only for optional department/job title enrichment.
- If Graph fails, continue without department/job title.

---

# List Provisioning Options

The solution can support one of these approaches.

## Option A: Manual List Setup

Provide documentation so users create the lists manually.

Pros:

- Easier to build
- Transparent
- Good for open-source sample

Cons:

- More setup work for users

## Option B: PnP Provisioning Template

Provide a PnP provisioning XML or PowerShell script.

Pros:

- Easier setup for SharePoint admins
- More professional

Cons:

- More initial work

## Option C: In-App Provisioning

Add a setup button in the admin web part to create lists automatically.

Pros:

- Great user experience

Cons:

- More complex
- Requires elevated permissions
- More error handling required

Recommended MVP:

Use **Option A + Option B**.

Provide manual documentation first, then add a PnP PowerShell provisioning script.

Suggested provisioning folder:

```text
/provisioning
  create-policy-center-lists.ps1
  policy-center-template.xml
```

---

# Sample Data

Create sample policies so users can quickly demo the project.

Example sample policies:

```json
[
  {
    "Title": "Information Security Policy",
    "PolicyCategory": "Security",
    "PolicyVersion": "1.0",
    "IsRequired": true,
    "IsActive": true,
    "DueDate": "2026-06-30",
    "TargetDepartments": [],
    "PolicyDescription": "Defines employee responsibilities for protecting company information and systems."
  },
  {
    "Title": "Remote Work Policy",
    "PolicyCategory": "HR",
    "PolicyVersion": "2.0",
    "IsRequired": true,
    "IsActive": true,
    "DueDate": "2026-05-31",
    "TargetDepartments": [],
    "PolicyDescription": "Explains expectations, eligibility, and security requirements for remote work."
  },
  {
    "Title": "AI Usage Policy",
    "PolicyCategory": "IT",
    "PolicyVersion": "1.0",
    "IsRequired": true,
    "IsActive": true,
    "DueDate": "2026-07-15",
    "TargetDepartments": ["Information Technology", "Marketing", "Operations"],
    "PolicyDescription": "Provides guidelines for responsible use of generative AI tools in the workplace."
  }
]
```

---

# Business Logic Details

## Determine Policy Visibility

A policy is visible to an employee if:

- `IsActive` is true
- Current date is after `EffectiveDate` if provided
- Current date is before `ExpiryDate` if provided
- Policy has no target departments, or current user's department is included in target departments

## Determine Acknowledgement Status

Inputs:

- Policy
- Current user
- Current user's acknowledgement records
- Current date

Rules:

1. If policy is not required, status is `Optional` unless acknowledged.
2. If current user has acknowledged current policy version, status is `Acknowledged`.
3. If policy is required and due date is in the past, status is `Overdue`.
4. If policy is required and not acknowledged, status is `NotStarted`.
5. If policy is expired, status is `Expired`.

## Version Rule

Acknowledgement only counts if:

```text
Acknowledgement.PolicyLookupId == Policy.Id
AND Acknowledgement.PolicyVersion == Policy.PolicyVersion
AND Acknowledgement.EmployeeEmail == CurrentUser.Email
AND Acknowledgement.AcknowledgementStatus == Acknowledged
```

---

# CSV Export Logic

Export should generate a CSV file in the browser.

Filename format:

```text
policy-acknowledgement-report-yyyy-mm-dd.csv
```

CSV should include dashboard rows or detailed acknowledgement rows depending on current view.

Recommended export behavior:

- If on summary table, export summary rows.
- If viewing a policy detail panel, export acknowledgement detail rows for that policy.
- Respect current filters when possible.

---

# README Requirements

The README should be polished because this is a portfolio project.

Include these sections:

```text
# SPFx Policy Acknowledgement Center

## Overview
## Why This Project Exists
## Features
## Screenshots
## Architecture
## Web Parts Included
## SharePoint Lists Used
## Setup Instructions
## Local Development
## Deployment
## Configuration
## Permissions
## Sample Data
## Roadmap
## Known Limitations
## Contributing
## License
```

## README Opening Example

```markdown
# SPFx Policy Acknowledgement Center

SPFx Policy Acknowledgement Center is an open-source SharePoint Framework solution that helps organizations publish policies, collect employee acknowledgements, and track compliance directly in SharePoint Online.

It is designed for modern SharePoint intranets, HR portals, IT governance sites, and Microsoft 365 employee experience scenarios where organizations need a simple way to prove that employees reviewed important policies.
```

## README Feature List Example

```markdown
## Features

- Employee-facing policy acknowledgement web part
- Admin compliance dashboard web part
- SharePoint list-backed policy management
- Policy version tracking
- Due date and overdue status logic
- Department targeting support
- Acknowledgement history
- CSV export
- Fluent UI interface
- PnPjs-based SharePoint integration
- Optional Microsoft Graph profile lookup
```

---

# Documentation Requirements

## docs/setup-guide.md

Should explain:

- Prerequisites
- Required SharePoint lists
- How to create fields
- How to add sample data
- How to add web parts to a page

## docs/deployment-guide.md

Should explain:

- How to build the SPFx package
- How to bundle and package solution
- How to upload to app catalog
- How to deploy tenant-wide or site-specific
- How to approve API permissions if Graph is used

## docs/configuration-guide.md

Should explain:

- Web part property pane settings
- List name configuration
- Department targeting
- Optional Graph settings
- CSV export settings

## docs/list-schema.md

Should include all list columns and field types.

## docs/architecture.md

Should explain:

- Web part architecture
- Service layer
- Data flow
- Acknowledgement logic
- Version tracking

## docs/roadmap.md

Should include future enhancements.

---

# Suggested Roadmap

## Version 1.0 MVP

- Policy Acknowledgement web part
- Policy Compliance Dashboard web part
- Policies list integration
- Acknowledgements list integration
- Policy version tracking
- Due date and overdue logic
- Employee acknowledgement submission
- Basic admin summary dashboard
- CSV export
- Documentation
- Sample data

## Version 1.1

- PnP provisioning script
- Better filtering
- Improved dashboard charts
- Policy detail export
- Better mobile layout

## Version 1.2

- Department-based reporting
- Manager view
- Optional assignment list support
- Policy owner management panel

## Version 2.0

- Viva Connections Adaptive Card Extension
- Power Automate notification templates
- Microsoft Teams notification support
- Azure AD group targeting
- Advanced reporting

---

# Suggested Power Automate Integration Optional

This project can later include Power Automate examples.

Possible flows:

1. Send reminder when policy is due in 7 days.
2. Send overdue reminder to employee.
3. Send weekly compliance summary to policy owner.
4. Notify Teams channel when a new policy is published.
5. Archive old acknowledgements based on retention policy.

Document these as optional ideas, not required for MVP.

---

# Suggested Blog Post Angle

After the project is built, create a blog post titled:

```text
Building an Open-Source Policy Acknowledgement System in SharePoint with SPFx
```

Blog sections:

- The problem with manual policy acknowledgement tracking
- Why SharePoint is a good fit
- How the SPFx solution works
- SharePoint lists used
- Employee experience
- Admin compliance dashboard
- Lessons learned
- GitHub repo link
- Screenshots
- Future roadmap

---

# Suggested LinkedIn Launch Post

```text
I just published a new open-source SharePoint Framework project: SPFx Policy Acknowledgement Center.

The idea is simple:
Employees need to read important company policies.
HR, IT, and Compliance teams need proof that those policies were acknowledged.
SharePoint Online can handle more of this than many people realize.

This project includes:
✅ Employee-facing policy acknowledgement web part
✅ Admin compliance dashboard
✅ Policy version tracking
✅ Due date and overdue logic
✅ SharePoint list-backed data model
✅ CSV export
✅ PnPjs + Fluent UI

I built this as a practical intranet governance example for modern SharePoint environments.

GitHub: [insert link]
Blog: [insert link]

#SharePoint #SPFx #Microsoft365 #PowerPlatform #Intranet #OpenSource
```

---

# Acceptance Criteria

The coding agent should consider the MVP complete when:

- The SPFx solution builds successfully.
- The employee web part loads active policies from a SharePoint list.
- The employee web part can detect current user's acknowledgement status.
- The employee can acknowledge a policy version.
- The acknowledgement is saved to the SharePoint list.
- Duplicate acknowledgements for the same user/policy/version are prevented.
- The dashboard web part displays active policies and acknowledgement counts.
- The dashboard can export CSV.
- List schema documentation exists.
- README is complete and portfolio-ready.
- Sample data is provided.
- Screenshots are included or screenshot placeholders are documented.

---

# Known Limitations to Document

Include these in README so the project feels honest and professional:

```text
This project is intended as an open-source starter/reference implementation.
Before using in production, review permissions, privacy requirements, data retention rules, and compliance requirements with your organization.

The MVP uses SharePoint lists as the data source and does not replace a full enterprise compliance platform.

Pending/overdue reporting depends on how assigned users are defined. For complete missing-user reporting, configure assignment data or extend the solution with Azure AD group targeting.
```

---

# Recommended License

Use MIT License unless there is a specific reason to choose another license.

Reason:

- Simple
- Open-source friendly
- Common for portfolio projects
- Allows others to use and contribute

---

# Final Notes for Coding Agent

The most important goal is to make this project look like a real enterprise SharePoint solution, not a toy demo.

Prioritize:

1. Clean architecture
2. Strong README
3. Practical SharePoint list model
4. Polished UI
5. Screenshots
6. Clear setup instructions
7. Realistic business logic
8. Good TypeScript models
9. Good error handling
10. Portfolio-ready presentation

Do not overbuild the first version. The MVP should focus on the core scenario:

```text
Publish policy → Employee acknowledges → Admin tracks completion
```

Everything else can be roadmap.
