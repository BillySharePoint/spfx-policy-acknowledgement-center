# SPFx Policy Acknowledgement Center

SPFx Policy Acknowledgement Center is an open-source SharePoint Framework solution that helps organizations publish policies, collect employee acknowledgements, and track compliance directly in SharePoint Online.

Many organizations publish important policies — Acceptable Use, Remote Work, Information Security, AI Usage, Code of Conduct — but lack a clean way to confirm employees have read and acknowledged them. HR, IT, Legal, Security, and Compliance teams need proof of acknowledgement, managers need visibility into who hasn't completed required acknowledgements, and policy versions change over time.

This project solves that problem using SharePoint lists, PnPjs, Fluent UI, and Microsoft Graph — no third-party platform required.

---

## Overview

The SPFx Policy Acknowledgement Center provides:

- An **employee-facing web part** where users view assigned policies, read details, and submit acknowledgements.
- An **admin-facing compliance dashboard** where policy owners track completion rates, filter by department or category, and export data to CSV.
- **Version tracking** so that when a policy is updated, employees must re-acknowledge the new version.
- **Department targeting** using Microsoft Graph profile data to show only relevant policies.
- A clean, modern UI built with Fluent UI React that works across full-width pages, multi-column layouts, and mobile views.

---

## Features

- **Policy List with Status Badges** — View all assigned policies with real-time status (Not Started, Acknowledged, Overdue, Expired, Optional).
- **Policy Detail Panel** — Read policy description, open linked documents, and submit acknowledgement with a required checkbox.
- **Acknowledgement History** — Employees can review past acknowledgements across all policy versions.
- **Compliance Dashboard** — Summary cards showing active policies, completion rate, overdue users, and policies due soon.
- **Filterable Reports** — Filter by policy, category, department, status, due date, and owner.
- **CSV Export** — Export acknowledgement data for offline reporting.
- **Version Tracking** — Each acknowledgement is tied to a specific policy version; version changes require re-acknowledgement.
- **Department Targeting** — Policies can target specific departments; user department is resolved via Microsoft Graph.
- **Responsive Design** — Works in full-width, one-column, two-column, and mobile layouts.
- **Dark Theme Support** — Respects SharePoint theme changes including dark mode.
- **Configurable via Property Pane** — All settings (list names, targeting, export, page size) are configurable without code changes.

---

## Screenshots

> Screenshots will be added after deployment to a SharePoint environment.

| View | Description |
|------|-------------|
| Employee Policy List | _Screenshot placeholder_ |
| Policy Detail Panel | _Screenshot placeholder_ |
| Acknowledgement History | _Screenshot placeholder_ |
| Compliance Dashboard | _Screenshot placeholder_ |
| Dashboard Filters | _Screenshot placeholder_ |
| CSV Export | _Screenshot placeholder_ |
| Mobile View | _Screenshot placeholder_ |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SharePoint Page                           │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────────────┐ │
│  │  PolicyAcknowledgement│  │ PolicyComplianceDashboard    │ │
│  │  WebPart (Employee)   │  │ WebPart (Admin)              │ │
│  └──────────┬───────────┘  └──────────┬───────────────────┘ │
│             │                         │                     │
│  ┌──────────▼─────────────────────────▼───────────────────┐ │
│  │                  Service Layer                          │ │
│  │  PolicyService │ AcknowledgementService │ ExportService │ │
│  │                │ UserProfileService                     │ │
│  └──────────┬─────────────────────────┬───────────────────┘ │
│             │                         │                     │
│  ┌──────────▼───────────┐  ┌──────────▼───────────────────┐ │
│  │   PnPjs / SP REST    │  │   Microsoft Graph API        │ │
│  └──────────┬───────────┘  └──────────┬───────────────────┘ │
│             │                         │                     │
│  ┌──────────▼───────────┐  ┌──────────▼───────────────────┐ │
│  │  SharePoint Lists    │  │  User Profile (dept, title)  │ │
│  │  - Policies          │  └──────────────────────────────┘ │
│  │  - Acknowledgements  │                                   │
│  └──────────────────────┘                                   │
└─────────────────────────────────────────────────────────────┘
```

**Service Layer:**

| Service | Responsibility |
|---------|----------------|
| `PolicyService` | CRUD operations on the Policies list; fetches active policies, filters by category |
| `AcknowledgementService` | Creates acknowledgement records; queries by user, policy, or all; checks version match |
| `UserProfileService` | Resolves current user info from page context and enriches with Microsoft Graph (department, job title) |
| `ExportService` | Generates and downloads CSV files from acknowledgement data |

---

## Web Parts Included

### 1. Policy Acknowledgement (Employee-Facing)

- Displays active policies assigned to the current user
- Three tabs: **Required Policies**, **Acknowledged**, **History**
- Policy detail panel with acknowledgement submission
- Status badges: Not Started, Acknowledged, Overdue, Expired, Optional
- Search and filter by title, category, status
- Department-based targeting via Microsoft Graph

### 2. Policy Compliance Dashboard (Admin-Facing)

- Summary cards: Active Policies, Completion Rate, Overdue Users, Due This Week
- Detailed table with per-policy completion metrics
- Filters: policy, category, department, status, due date, owner
- CSV export of filtered acknowledgement data
- Drill-down into individual policy acknowledgement details

---

## SharePoint Lists Used

### Policy Center - Policies

Stores the master list of organizational policies.

| Field | Internal Name | Type |
|-------|---------------|------|
| Title | Title | Single line of text |
| Policy ID | PolicyId | Single line of text |
| Description | PolicyDescription | Multiple lines of text |
| Category | PolicyCategory | Choice |
| Version | PolicyVersion | Single line of text |
| Policy Document URL | PolicyDocumentUrl | Hyperlink |
| Policy Owner | PolicyOwner | Person |
| Required | IsRequired | Yes/No |
| Active | IsActive | Yes/No |
| Due Date | DueDate | Date |
| Effective Date | EffectiveDate | Date |
| Expiry Date | ExpiryDate | Date |
| Target Departments | TargetDepartments | Multi-Choice |
| Acknowledgement Text | AcknowledgementText | Multiple lines of text |
| Sort Order | SortOrder | Number |

### Policy Center - Acknowledgements

Stores individual employee acknowledgement records.

| Field | Internal Name | Type |
|-------|---------------|------|
| Title | Title | Single line of text |
| Policy | PolicyLookup | Lookup → Policies |
| Policy Title Snapshot | PolicyTitleSnapshot | Single line of text |
| Policy Version | PolicyVersion | Single line of text |
| Employee | Employee | Person |
| Employee Email | EmployeeEmail | Single line of text |
| Employee Display Name | EmployeeDisplayName | Single line of text |
| Department | Department | Single line of text |
| Job Title | JobTitle | Single line of text |
| Acknowledged Date | AcknowledgedDate | Date and Time |
| Acknowledgement Status | AcknowledgementStatus | Choice |
| Due Date Snapshot | DueDateSnapshot | Date |
| Comments | Comments | Multiple lines of text |

---

## Setup Instructions

### Prerequisites

- Node.js 22.x (LTS)
- SharePoint Online tenant with App Catalog
- Site Collection Administrator permissions (for list creation)
- PnP PowerShell module (optional, for automated list provisioning)

### 1. Create SharePoint Lists

**Option A: PowerShell (Recommended)**

```powershell
Install-Module PnP.PowerShell -Scope CurrentUser
Connect-PnPOnline -Url "https://yourtenant.sharepoint.com/sites/yoursite" -Interactive
.\provisioning\create-policy-center-lists.ps1
```

To include sample data:

```powershell
.\provisioning\create-policy-center-lists.ps1 -CreateSampleData
```

**Option B: Manual**

Create the two lists manually following the schema in [docs/list-schema.md](docs/list-schema.md).

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure serve.json

Update `config/serve.json` with your tenant URL:

```json
{
  "initialPage": "https://yourtenant.sharepoint.com/sites/yoursite/_layouts/workbench.aspx"
}
```

### 4. Run Locally

```bash
npm run start
```

### 5. Deploy

See [docs/deployment-guide.md](docs/deployment-guide.md) for full deployment instructions.

---

## Local Development

```bash
# Install dependencies
npm install

# Start the local workbench
npm run start

# Build for production
npm run build

# Clean build artifacts
npm run clean
```

The solution uses SPFx 1.22.2 with Heft as the build system. The local workbench will open at your configured SharePoint site's workbench page.

---

## Deployment

```bash
# Build production bundle
npm run build

# The .sppkg file is generated at sharepoint/solution/spfx-policy-acknowledgement-center.sppkg
```

1. Upload the `.sppkg` file to your tenant or site-level App Catalog.
2. Deploy the solution (check "Make this solution available to all sites in the organization" for tenant-wide deployment).
3. Approve API permissions in the SharePoint Admin Center if using Microsoft Graph enrichment.
4. Add the web parts to a SharePoint page.

See [docs/deployment-guide.md](docs/deployment-guide.md) for detailed steps.

---

## Configuration

Both web parts are configurable via the SharePoint property pane:

| Property | Web Part | Default | Description |
|----------|----------|---------|-------------|
| Policies List Name | Both | Policy Center - Policies | Name of the Policies list |
| Acknowledgements List Name | Both | Policy Center - Acknowledgements | Name of the Acknowledgements list |
| Show History Tab | Employee | true | Show/hide the History tab |
| Enable Department Targeting | Employee | true | Filter policies by user department |
| Use Graph Profile Department | Employee | true | Resolve department from Microsoft Graph |
| Default View | Employee | Required | Default tab (Required, Acknowledged, History) |
| Show Optional Policies | Employee | true | Include non-required policies |
| Page Size | Both | 10 / 25 | Number of items per page |
| Enable CSV Export | Dashboard | true | Show/hide export button |
| Show Department Filter | Dashboard | true | Show department filter dropdown |

See [docs/configuration-guide.md](docs/configuration-guide.md) for details.

---

## Permissions

### SharePoint Permissions

- **Employees** need Read access to the Policies list and Contribute access to the Acknowledgements list.
- **Admins/Policy Owners** need Read access to both lists (and Edit on Policies if managing policies directly).

### API Permissions (Optional)

If `useGraphProfileDepartment` is enabled, the solution requests:

| API | Permission | Type | Purpose |
|-----|------------|------|---------|
| Microsoft Graph | `User.Read` | Delegated | Read current user's department and job title |

Approve in **SharePoint Admin Center → API access**.

---

## Sample Data

The `provisioning/create-policy-center-lists.ps1` script can create sample policies with the `-CreateSampleData` flag. Sample policies include:

- Information Security Policy
- Remote Work Policy
- AI Usage Policy
- Data Handling and Classification Policy
- Code of Conduct
- Acceptable Use Policy
- Records Retention Policy
- Workplace Safety Procedures
- Privacy Policy
- Travel and Expense Policy

JSON sample data files are also available in the `sample-data/` directory.

---

## Roadmap

See [docs/roadmap.md](docs/roadmap.md) for the full roadmap.

| Version | Focus |
|---------|-------|
| v1.0 | MVP — Employee acknowledgement + Admin dashboard |
| v1.1 | Enhanced filtering, bulk operations, email reminders |
| v1.2 | My Policy History web part, policy analytics |
| v2.0 | Azure AD group targeting, Viva Connections ACE, Power Automate integration |

---

## Known Limitations

- Department targeting relies on Microsoft Graph `User.Read` permission; if not approved, all policies are shown to all users.
- SharePoint list item threshold (5,000 items) applies to the Acknowledgements list; for large organizations, consider indexed columns or archival strategies.
- The solution does not send email notifications; consider Power Automate flows for reminder emails.
- CSV export is client-side; very large datasets may be slow to export.
- The compliance dashboard shows acknowledgement data but does not enforce access control — place it on a page restricted to admins.

---

## Tech Stack

| Technology | Version |
|------------|---------|
| SharePoint Framework (SPFx) | 1.22.2 |
| React | 17 |
| TypeScript | 5.8 |
| Fluent UI React | 8 |
| PnPjs | 4 |
| Node.js | 22 |

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

This project is licensed under the [MIT License](LICENSE).