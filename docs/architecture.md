# Architecture

This document describes the technical architecture of the SPFx Policy Acknowledgement Center, including the web part structure, service layer, data flow, acknowledgement logic, and version tracking.

---

## Solution Structure

```
src/
├── common/
│   ├── index.ts                    # Shared utilities barrel export
│   └── PolicyUtils.ts              # Policy status calculation, date helpers
├── models/
│   ├── IAcknowledgement.ts         # Acknowledgement record interface
│   ├── IComplianceSummary.ts       # Dashboard summary metrics interface
│   ├── IPolicy.ts                  # Policy interface
│   ├── IPolicyStatus.ts            # Status enum/type
│   ├── IUserProfile.ts             # User profile interface
│   └── index.ts                    # Models barrel export
├── services/
│   ├── AcknowledgementService.ts   # Acknowledgement CRUD operations
│   ├── ExportService.ts            # CSV export
│   ├── PolicyService.ts            # Policy list operations
│   ├── UserProfileService.ts       # User profile resolution
│   └── index.ts                    # Services barrel export
└── webparts/
    ├── policyAcknowledgement/      # Employee-facing web part
    │   ├── PolicyAcknowledgementWebPart.ts
    │   ├── PolicyAcknowledgementWebPart.manifest.json
    │   ├── components/
    │   │   ├── PolicyAcknowledgement.tsx      # Main component
    │   │   ├── PolicyAcknowledgement.module.scss
    │   │   ├── IPolicyAcknowledgementProps.ts
    │   │   ├── PolicyCard.tsx                 # Individual policy card
    │   │   ├── PolicyDetailPanel.tsx          # Detail panel with acknowledgement form
    │   │   ├── StatusBadge.tsx                # Status pill/badge component
    │   │   └── SummaryCards.tsx               # Top-level summary cards
    │   └── loc/
    │       ├── en-us.js
    │       └── mystrings.d.ts
    └── policyComplianceDashboard/  # Admin-facing web part
        ├── PolicyComplianceDashboardWebPart.ts
        ├── PolicyComplianceDashboardWebPart.manifest.json
        ├── components/
        │   ├── PolicyComplianceDashboard.tsx       # Main component
        │   ├── PolicyComplianceDashboard.module.scss
        │   └── IPolicyComplianceDashboardProps.ts
        └── loc/
            ├── en-us.js
            └── mystrings.d.ts
```

---

## Web Parts

### PolicyAcknowledgement (Employee-Facing)

**Manifest ID:** Defined in `PolicyAcknowledgementWebPart.manifest.json`

**Responsibility:** Displays policies assigned to the current user and allows them to submit acknowledgements.

**Property Pane Properties:**

| Property | Type | Purpose |
|----------|------|---------|
| `policiesListName` | string | Policies list display name |
| `acknowledgementsListName` | string | Acknowledgements list display name |
| `showHistoryTab` | boolean | Toggle History tab visibility |
| `enableDepartmentTargeting` | boolean | Enable/disable department filtering |
| `useGraphProfileDepartment` | boolean | Use Graph for department resolution |
| `defaultView` | string | Default active tab |
| `showOptionalPolicies` | boolean | Include non-required policies |
| `pageSize` | number | Items per page |

**Component Hierarchy:**

```
PolicyAcknowledgementWebPart
└── PolicyAcknowledgement (main component)
    ├── SummaryCards (top-level metrics)
    ├── Pivot (tabs: Required / Acknowledged / History)
    │   └── PolicyCard[] (list of policy cards)
    ├── PolicyDetailPanel (slide-out panel)
    │   ├── Policy details display
    │   ├── Acknowledgement checkbox
    │   └── Submit button
    └── StatusBadge (reusable status indicator)
```

### PolicyComplianceDashboard (Admin-Facing)

**Manifest ID:** Defined in `PolicyComplianceDashboardWebPart.manifest.json`

**Responsibility:** Displays compliance metrics, per-policy breakdowns, and supports CSV export.

**Property Pane Properties:**

| Property | Type | Purpose |
|----------|------|---------|
| `policiesListName` | string | Policies list display name |
| `acknowledgementsListName` | string | Acknowledgements list display name |
| `adminGroupName` | string | Optional admin group name |
| `enableCsvExport` | boolean | Toggle CSV export button |
| `showDepartmentFilter` | boolean | Toggle department filter |
| `pageSize` | number | Rows per page |

**Component Hierarchy:**

```
PolicyComplianceDashboardWebPart
└── PolicyComplianceDashboard (main component)
    ├── Summary cards (Active Policies, Completion %, Overdue, Due Soon)
    ├── Filter bar (Category, Department, Status, Due Date)
    ├── DetailsList (policy compliance table)
    └── Export button → ExportService
```

---

## Service Layer

All data access is encapsulated in service classes. Web part components never call SharePoint or Graph APIs directly.

### PolicyService

**File:** `src/services/PolicyService.ts`

| Method | Returns | Description |
|--------|---------|-------------|
| `getActivePolicies()` | `IPolicy[]` | Fetches all active policies, ordered by SortOrder. Expands PolicyOwner. |
| `getPolicyById(id)` | `IPolicy \| undefined` | Fetches a single policy by list item ID. |
| `getPoliciesByCategory(category)` | `IPolicy[]` | Fetches active policies filtered by category. |

**PnPjs Usage:**
- Uses `spfi().using(SPFx(context))` for authentication.
- Queries use `select`, `expand`, `filter`, `orderBy`, and `top` for efficient requests.
- Filters on `IsActive eq 1` to only return active policies.

### AcknowledgementService

**File:** `src/services/AcknowledgementService.ts`

| Method | Returns | Description |
|--------|---------|-------------|
| `getCurrentUserAcknowledgements(userEmail)` | `IAcknowledgement[]` | All acknowledgements for the current user. |
| `getAcknowledgementsForPolicy(policyId)` | `IAcknowledgement[]` | All acknowledgements for a specific policy. |
| `getAllAcknowledgements()` | `IAcknowledgement[]` | All acknowledgement records (admin use). |
| `createAcknowledgement(params, userProfile)` | `IAcknowledgement` | Creates a new acknowledgement record. |

**Key Behavior:**
- Stores snapshot data (policy title, version, due date, department, job title) at time of acknowledgement.
- Sets `AcknowledgementStatus` to "Acknowledged" on creation.
- Generates Title as `{PolicyTitle} - {UserEmail} - v{Version}`.

### UserProfileService

**File:** `src/services/UserProfileService.ts`

| Method | Returns | Description |
|--------|---------|-------------|
| `getBasicProfile()` | `IUserProfile` | Returns display name and email from page context. Always available. |
| `getEnrichedProfile()` | `Promise<IUserProfile>` | Returns display name, email, department, and job title from Microsoft Graph. Falls back to basic profile on error. |
| `getCurrentUserId()` | `Promise<number>` | Returns SharePoint user ID for Person field assignment. |

**Fallback Strategy:**
1. Try Microsoft Graph `/me` endpoint.
2. If Graph fails (no permissions, network error), fall back to page context.
3. Log warning to console but do not show errors to the user.

### ExportService

**File:** `src/services/ExportService.ts`

| Method | Returns | Description |
|--------|---------|-------------|
| `exportToCsv(data, filename)` | `void` | Generates CSV and triggers browser download. |
| `generateFilename(prefix)` | `string` | Creates timestamped filename (e.g., `policy-acknowledgements-2026-04-25.csv`). |

**Implementation Details:**
- Client-side CSV generation using Blob API.
- UTF-8 BOM prefix for Excel compatibility.
- Proper escaping of fields containing commas, quotes, and newlines.
- Uses `URL.createObjectURL` for download without server round-trip.

---

## Data Flow

### Employee Acknowledging a Policy

```
1. Page loads
   └── PolicyAcknowledgementWebPart.render()
       └── PolicyAcknowledgement component mounts

2. Component initialization (parallel)
   ├── UserProfileService.getEnrichedProfile()
   │   └── GET /me (Graph) → IUserProfile { displayName, email, department, jobTitle }
   ├── PolicyService.getActivePolicies()
   │   └── GET _api/web/lists/.../items (PnPjs) → IPolicy[]
   └── AcknowledgementService.getCurrentUserAcknowledgements(email)
       └── GET _api/web/lists/.../items (PnPjs) → IAcknowledgement[]

3. Department targeting (if enabled)
   └── Filter policies: show if TargetDepartments is empty OR contains user's department

4. Status calculation (per policy)
   ├── Has acknowledgement for current version? → "Acknowledged"
   ├── Past due date and not acknowledged? → "Overdue"
   ├── Not required? → "Optional"
   ├── Expired? → "Expired"
   └── Otherwise → "Not Started"

5. User clicks a policy card
   └── PolicyDetailPanel opens with policy details

6. User checks acknowledgement box and clicks Submit
   └── AcknowledgementService.createAcknowledgement({
         policyId, policyTitle, policyVersion, dueDate
       }, userProfile)
       └── POST _api/web/lists/.../items (PnPjs) → new IAcknowledgement

7. Success
   ├── Show success message
   ├── Close panel
   └── Refresh policy list (re-fetch acknowledgements)
```

### Admin Viewing Compliance Dashboard

```
1. Page loads
   └── PolicyComplianceDashboardWebPart.render()

2. Data loading (parallel)
   ├── PolicyService.getActivePolicies() → IPolicy[]
   └── AcknowledgementService.getAllAcknowledgements() → IAcknowledgement[]

3. Metric calculation
   ├── Total active policies
   ├── Per-policy: acknowledged count / total expected
   ├── Completion rate = (acknowledged / total expected) × 100
   ├── Overdue = past due date and not acknowledged
   └── Due this week = due date within 7 days

4. Admin applies filters
   └── Re-calculate metrics on filtered subset

5. Admin clicks Export
   └── ExportService.exportToCsv(filteredData, generatedFilename)
       └── Browser downloads CSV file
```

---

## Acknowledgement Logic

### When Is an Acknowledgement Valid?

An acknowledgement is valid when **all** of these are true:

1. The `AcknowledgementStatus` is `"Acknowledged"` (not Superseded or Revoked).
2. The `PolicyVersion` on the acknowledgement matches the current `PolicyVersion` on the policy.
3. The `PolicyLookup` points to the correct policy item.

### Version Change Handling

When a policy version changes (e.g., from "1.0" to "2.0"):

1. Existing "1.0" acknowledgements remain in the list unchanged.
2. The employee web part checks if the user has an acknowledgement matching the **current** policy version.
3. If no matching acknowledgement exists, the policy shows as "Not Started" or "Overdue".
4. The employee must acknowledge the new version.
5. The old acknowledgement is preserved for audit history.

> **Note:** The current version does not automatically set old acknowledgements to "Superseded." This can be done manually or via a Power Automate flow.

### Duplicate Prevention

Before creating an acknowledgement, the service checks if the user already has an "Acknowledged" record for the same policy and version. If one exists, submission is blocked and the user is shown a message.

---

## Version Tracking

| Concept | Implementation |
|---------|----------------|
| Policy version | Stored as a text field (`PolicyVersion`) on the Policies list. Free-form (e.g., "1.0", "2.0", "2026.04"). |
| Acknowledgement version | Stored as `PolicyVersion` on each acknowledgement record. Captures the version at time of acknowledgement. |
| Version comparison | Exact string match. "1.0" ≠ "2.0". |
| Historical integrity | Acknowledgement records are never modified. Snapshot fields preserve the state at time of acknowledgement. |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | SharePoint Framework (SPFx) 1.22.2 |
| UI Library | React 17 |
| Component Library | Fluent UI React 8 |
| Language | TypeScript 5.8 |
| Data Access | PnPjs 4 |
| Build System | Heft (Rush Stack) |
| Styling | SCSS Modules |
| User Profile | Microsoft Graph API (delegated) |
| Backend | SharePoint Lists (no custom APIs) |
