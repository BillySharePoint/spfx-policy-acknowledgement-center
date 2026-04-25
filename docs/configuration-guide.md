# Configuration Guide

Both web parts in the SPFx Policy Acknowledgement Center are configurable through the SharePoint property pane. No code changes are needed for standard configuration.

---

## Policy Acknowledgement Web Part (Employee-Facing)

Open the property pane by editing the page and clicking the pencil icon on the web part.

### Data Sources

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Policies List Name** | Text | `Policy Center - Policies` | The display name of the SharePoint list containing policies. Must match exactly. |
| **Acknowledgements List Name** | Text | `Policy Center - Acknowledgements` | The display name of the SharePoint list containing acknowledgement records. Must match exactly. |

### Display Settings

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Default View** | Dropdown | `Required` | The tab shown when the web part first loads. Options: `Required`, `Acknowledged`, `History`. |
| **Show History Tab** | Toggle | On | Whether to show the History tab. Disable if you don't want employees to see their full acknowledgement history. |
| **Show Optional Policies** | Toggle | On | Whether to display policies that are not marked as required. |
| **Page Size** | Slider | 10 | Number of policies shown per page. Range: 5–50. |

### Targeting Settings

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Enable Department Targeting** | Toggle | On | When enabled, policies with Target Departments set will only appear for users whose department matches. Policies with no Target Departments are shown to everyone. |
| **Use Graph Profile Department** | Toggle | On | When enabled, the user's department is resolved from Microsoft Graph (`/me` endpoint). When disabled, department targeting is not available. Requires `User.Read` API permission. |

---

## Policy Compliance Dashboard Web Part (Admin-Facing)

### Data Sources

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Policies List Name** | Text | `Policy Center - Policies` | Same as above. Should match the employee web part configuration. |
| **Acknowledgements List Name** | Text | `Policy Center - Acknowledgements` | Same as above. |

### Display Settings

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Enable CSV Export** | Toggle | On | Shows/hides the "Export to CSV" button on the dashboard. |
| **Show Department Filter** | Toggle | On | Shows/hides the department filter dropdown in the dashboard filters. |
| **Page Size** | Slider | 25 | Number of rows shown in the compliance table. Range: 10–100. |

---

## List Name Configuration

Both web parts default to these list names:

- **Policies:** `Policy Center - Policies`
- **Acknowledgements:** `Policy Center - Acknowledgements`

If you renamed the lists or use different names, update both web parts to match. The list names are **case-sensitive** and must match the SharePoint list display name exactly.

> **Tip:** If both web parts are on the same page, ensure they point to the same lists.

---

## Department Targeting

Department targeting allows you to assign policies to specific departments. Here's how it works:

### How Policies Are Filtered

1. The web part reads the current user's department from Microsoft Graph (if `useGraphProfileDepartment` is enabled).
2. For each policy, it checks the `Target Departments` multi-choice field.
3. If `Target Departments` is empty or contains "All", the policy is shown to everyone.
4. If `Target Departments` contains specific departments, the policy is only shown if the user's department matches one of them.

### Department Choices

The default department choices in the Policies list are:

- All
- Human Resources
- Information Technology
- Finance
- Operations
- Sales
- Marketing
- Legal
- Executive
- Other

These can be modified in the SharePoint list column settings. The `Target Departments` field has **Fill-in choices** enabled, so custom departments can be added.

### When Graph Is Unavailable

If the `User.Read` Graph permission is not approved, or if `useGraphProfileDepartment` is disabled:

- The user's department cannot be determined.
- All policies are shown regardless of Target Departments.
- A warning is logged to the browser console.

---

## Microsoft Graph Settings

The solution optionally uses Microsoft Graph to enrich user profiles.

### What It Reads

| Endpoint | Fields | Purpose |
|----------|--------|---------|
| `GET /me` | `displayName`, `mail`, `department`, `jobTitle`, `userPrincipalName` | Resolve user department for targeting; store department and job title in acknowledgement records |

### Required Permission

| Permission | Type | Admin Consent |
|------------|------|---------------|
| `User.Read` | Delegated | Yes (approved via SharePoint Admin Center) |

### How to Approve

1. Deploy the solution to the App Catalog.
2. Go to **SharePoint Admin Center** → **Advanced** → **API access**.
3. Approve the `User.Read` permission request.

### Fallback Behavior

If Graph is unavailable, the solution falls back to:

- **Display name** and **email** from the SharePoint page context.
- **Department** and **job title** will be `undefined` (not stored in acknowledgement records).
- Department targeting will not filter policies.

---

## CSV Export Configuration

The admin dashboard includes a CSV export feature.

### Export Behavior

- Clicking "Export to CSV" downloads a file with the current filtered data.
- The filename format is: `policy-acknowledgements-YYYY-MM-DD.csv`
- The CSV includes a UTF-8 BOM for proper Excel compatibility.
- The export respects current dashboard filters.

### CSV Columns

| Column | Description |
|--------|-------------|
| Policy Title | Name of the policy |
| Policy Version | Version that was acknowledged |
| Policy Category | Category of the policy |
| Required | Whether the policy was required |
| Due Date | Policy due date |
| Employee Name | Display name of the employee |
| Employee Email | Email address |
| Department | Employee's department |
| Acknowledgement Status | Acknowledged, Superseded, or Revoked |
| Acknowledgement Date | Date/time of acknowledgement |

### Disabling Export

Set **Enable CSV Export** to Off in the dashboard property pane to hide the export button.

---

## Advanced: Multiple Sites

If you need the same policy set across multiple sites:

1. Create the lists on a central site.
2. On each page where you add the web parts, configure the **list names** to point to the central site's lists.

> **Note:** The current version reads lists from the current site context. Cross-site list access would require customization of the service layer.
