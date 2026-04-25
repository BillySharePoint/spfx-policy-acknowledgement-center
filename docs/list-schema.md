# List Schema

This document defines the full schema for both SharePoint lists used by the SPFx Policy Acknowledgement Center.

---

## List 1: Policy Center - Policies

**Display Name:** `Policy Center - Policies`
**URL Name:** `PolicyCenterPolicies`
**Template:** Custom List (GenericList)

### Purpose

Stores the master list of organizational policies that employees must acknowledge.

### Fields

| # | Display Name | Internal Name | Type | Required | Default | Notes |
|---|-------------|---------------|------|----------|---------|-------|
| 1 | Title | Title | Single line of text | Yes | — | Built-in field. The policy title (e.g., "Information Security Policy"). |
| 2 | Policy ID | PolicyId | Single line of text | Yes | — | Unique business identifier (e.g., POL-SEC-001, POL-HR-002). |
| 3 | Description | PolicyDescription | Multiple lines of text | No | — | Plain text summary of the policy. |
| 4 | Category | PolicyCategory | Choice | Yes | — | Policy classification. |
| 5 | Version | PolicyVersion | Single line of text | Yes | — | Version string (e.g., 1.0, 2.0, 2026.04). |
| 6 | Policy Document URL | PolicyDocumentUrl | Hyperlink (URL) | No | — | Link to the full policy document (PDF, Word, or SharePoint page). |
| 7 | Policy Owner | PolicyOwner | Person or Group | No | — | The person responsible for the policy. Single user only. |
| 8 | Required | IsRequired | Yes/No | No | Yes | Whether acknowledgement is mandatory. |
| 9 | Active | IsActive | Yes/No | No | Yes | Whether the policy is currently active. Only active policies are shown to employees. |
| 10 | Due Date | DueDate | Date Only | No | — | Deadline for employees to acknowledge this policy. |
| 11 | Effective Date | EffectiveDate | Date Only | No | — | Date the policy becomes active. |
| 12 | Expiry Date | ExpiryDate | Date Only | No | — | Date the policy expires (optional). |
| 13 | Target Departments | TargetDepartments | Choice (Multi-Select) | No | — | Departments this policy applies to. Empty = all departments. Fill-in choices enabled. |
| 14 | Acknowledgement Text | AcknowledgementText | Multiple lines of text | No | — | Custom acknowledgement statement shown to employees. Falls back to default if empty. |
| 15 | Sort Order | SortOrder | Number | No | — | Optional numeric value for controlling display order. Lower numbers appear first. |

### Category Choices

```
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

### Target Department Choices

```
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

> Fill-in choices are enabled on the Target Departments field, allowing additional departments to be added without modifying the column definition.

### Indexing Recommendations

For performance with large lists, consider indexing:

- `IsActive` — Used in the primary filter query
- `PolicyCategory` — Used in category filtering
- `DueDate` — Used in due date filtering and sorting

---

## List 2: Policy Center - Acknowledgements

**Display Name:** `Policy Center - Acknowledgements`
**URL Name:** `PolicyCenterAcknowledgements`
**Template:** Custom List (GenericList)

### Purpose

Stores individual acknowledgement records. Each row represents one employee acknowledging one specific version of one policy.

### Fields

| # | Display Name | Internal Name | Type | Required | Default | Notes |
|---|-------------|---------------|------|----------|---------|-------|
| 1 | Title | Title | Single line of text | Yes | — | Auto-generated: `{PolicyTitle} - {UserEmail} - v{Version}` |
| 2 | Policy | PolicyLookup | Lookup | Yes | — | Lookup to "Policy Center - Policies" list, showing Title field. |
| 3 | Policy Title Snapshot | PolicyTitleSnapshot | Single line of text | Yes | — | Policy title at the time of acknowledgement. Preserved even if the policy title changes later. |
| 4 | Policy Version | PolicyVersion | Single line of text | Yes | — | The version of the policy that was acknowledged (e.g., "1.0"). |
| 5 | Employee | Employee | Person or Group | Yes | — | The SharePoint user who submitted the acknowledgement. |
| 6 | Employee Email | EmployeeEmail | Single line of text | Yes | — | Email address for reporting and CSV export. |
| 7 | Employee Display Name | EmployeeDisplayName | Single line of text | Yes | — | Display name for reporting and CSV export. |
| 8 | Department | Department | Single line of text | No | — | Employee's department at time of acknowledgement (from Graph or manual). |
| 9 | Job Title | JobTitle | Single line of text | No | — | Employee's job title at time of acknowledgement (from Graph). |
| 10 | Acknowledged Date | AcknowledgedDate | Date and Time | Yes | — | Date and time the acknowledgement was submitted. |
| 11 | Acknowledgement Status | AcknowledgementStatus | Choice | Yes | Acknowledged | Current status of this acknowledgement record. |
| 12 | Due Date Snapshot | DueDateSnapshot | Date Only | No | — | The policy's due date at the time of acknowledgement. Preserved for historical accuracy. |
| 13 | Comments | Comments | Multiple lines of text | No | — | Optional comments from the employee. |

### Acknowledgement Status Choices

```
Acknowledged
Superseded
Revoked
```

| Status | Meaning |
|--------|---------|
| **Acknowledged** | The employee has acknowledged this version of the policy. This is the active/valid status. |
| **Superseded** | A newer version of the policy has been published. This acknowledgement is historical but no longer satisfies the current version requirement. |
| **Revoked** | The acknowledgement has been administratively revoked (e.g., policy withdrawn, error correction). |

### Lookup Field Configuration

The `PolicyLookup` field must be configured as:

- **Type:** Lookup
- **Get information from:** `Policy Center - Policies`
- **In this column:** `Title`
- **Required:** Yes

### Indexing Recommendations

For performance with large lists, consider indexing:

- `EmployeeEmail` — Used in per-user queries
- `PolicyLookupId` — Used in per-policy queries (auto-created with lookup)
- `AcknowledgementStatus` — Used in status filtering
- `AcknowledgedDate` — Used in date sorting

---

## Data Integrity Rules

1. **Acknowledgement records are immutable.** When a policy version changes, existing acknowledgement records for the old version are not modified or deleted.

2. **Version matching is exact.** An acknowledgement for version "1.0" does not satisfy version "2.0". Employees must re-acknowledge when the version changes.

3. **Snapshot fields preserve history.** The `PolicyTitleSnapshot`, `DueDateSnapshot`, `Department`, and `JobTitle` fields capture values at the time of acknowledgement. This ensures accurate historical records even if the policy or user profile changes later.

4. **One acknowledgement per user per policy version.** The solution checks for existing acknowledgements before creating duplicates. If a user has already acknowledged version "1.0" of a policy, they cannot acknowledge it again (the submit button is disabled).

---

## Provisioning Script Reference

The `provisioning/create-policy-center-lists.ps1` PowerShell script automates creation of both lists with all fields. It is idempotent — running it multiple times will not create duplicate fields or lists.

```powershell
# Basic provisioning
.\provisioning\create-policy-center-lists.ps1

# With sample data
.\provisioning\create-policy-center-lists.ps1 -CreateSampleData

# With site URL
.\provisioning\create-policy-center-lists.ps1 -SiteUrl "https://yourtenant.sharepoint.com/sites/yoursite"
```
