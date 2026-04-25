# Setup Guide

This guide walks through setting up the SPFx Policy Acknowledgement Center from scratch.

---

## Prerequisites

| Requirement | Details |
|-------------|---------|
| Node.js | v22.x LTS |
| npm | v10+ (included with Node.js 22) |
| SharePoint Online | Microsoft 365 tenant with App Catalog |
| Permissions | Site Collection Administrator on the target site |
| PnP PowerShell | Optional, for automated list provisioning (`Install-Module PnP.PowerShell`) |

---

## Step 1: Create SharePoint Lists

The solution requires two SharePoint lists on the target site.

### Option A: Automated Provisioning (Recommended)

The included PowerShell script creates both lists with all required fields.

```powershell
# Install PnP PowerShell if not already installed
Install-Module PnP.PowerShell -Scope CurrentUser

# Connect to your SharePoint site
Connect-PnPOnline -Url "https://yourtenant.sharepoint.com/sites/yoursite" -Interactive

# Run the provisioning script
.\provisioning\create-policy-center-lists.ps1
```

To also create sample policy data:

```powershell
.\provisioning\create-policy-center-lists.ps1 -CreateSampleData
```

Or pass the site URL directly:

```powershell
.\provisioning\create-policy-center-lists.ps1 -SiteUrl "https://yourtenant.sharepoint.com/sites/yoursite" -CreateSampleData
```

### Option B: Manual List Creation

If you prefer to create lists manually, follow the schema in [list-schema.md](list-schema.md).

#### Create "Policy Center - Policies" List

1. Go to **Site Contents** → **New** → **List** → **Blank list**.
2. Name: `Policy Center - Policies`.
3. Add columns:

| Column Name | Type | Required | Notes |
|-------------|------|----------|-------|
| Policy ID | Single line of text | Yes | Unique business identifier (e.g., POL-SEC-001) |
| Description | Multiple lines of text | No | Plain text |
| Category | Choice | Yes | HR, IT, Security, Compliance, Operations, Finance, Legal, Facilities, Other |
| Version | Single line of text | Yes | e.g., 1.0, 2.0 |
| Policy Document URL | Hyperlink | No | Link to the policy document |
| Policy Owner | Person | No | |
| Required | Yes/No | No | Default: Yes |
| Active | Yes/No | No | Default: Yes |
| Due Date | Date | No | Acknowledgement deadline |
| Effective Date | Date | No | When policy takes effect |
| Expiry Date | Date | No | Optional expiration |
| Target Departments | Choice (multi-select) | No | All, Human Resources, Information Technology, Finance, Operations, Sales, Marketing, Legal, Executive, Other. Allow fill-in choices. |
| Acknowledgement Text | Multiple lines of text | No | Custom acknowledgement statement |
| Sort Order | Number | No | Display order |

#### Create "Policy Center - Acknowledgements" List

1. Go to **Site Contents** → **New** → **List** → **Blank list**.
2. Name: `Policy Center - Acknowledgements`.
3. Add columns:

| Column Name | Type | Required | Notes |
|-------------|------|----------|-------|
| Policy | Lookup | Yes | Lookup to "Policy Center - Policies" (Title column) |
| Policy Title Snapshot | Single line of text | Yes | Policy title at time of acknowledgement |
| Policy Version | Single line of text | Yes | Version acknowledged |
| Employee | Person | Yes | User who acknowledged |
| Employee Email | Single line of text | Yes | For reporting/export |
| Employee Display Name | Single line of text | Yes | For reporting/export |
| Department | Single line of text | No | From user profile |
| Job Title | Single line of text | No | From user profile |
| Acknowledged Date | Date and Time | Yes | Include time |
| Acknowledgement Status | Choice | Yes | Acknowledged, Superseded, Revoked |
| Due Date Snapshot | Date | No | Due date at time of acknowledgement |
| Comments | Multiple lines of text | No | Optional |

> **Important:** The Lookup field (`PolicyLookup`) must reference the "Policy Center - Policies" list and show the `Title` column.

---

## Step 2: Configure List Permissions

### Policies List

| Group | Permission Level |
|-------|-----------------|
| Site Members (Employees) | Read |
| Site Owners (Admins) | Edit or Full Control |

### Acknowledgements List

| Group | Permission Level |
|-------|-----------------|
| Site Members (Employees) | Contribute (to create acknowledgement records) |
| Site Owners (Admins) | Full Control |

To set permissions:

1. Go to **List Settings** → **Permissions for this list**.
2. Stop inheriting permissions if needed.
3. Assign appropriate permission levels.

---

## Step 3: Add Sample Data

### Using PowerShell

Run the provisioning script with the `-CreateSampleData` flag (see Step 1).

### Using JSON Files

Sample data files are provided in the `sample-data/` directory:

- `policies.sample.json` — 10 sample policies
- `acknowledgements.sample.json` — Sample acknowledgement records
- `departments.sample.json` — Department reference data

You can use these as reference when manually entering data or building your own import script.

### Manual Entry

Add a few policies to the "Policy Center - Policies" list with these test values:

| Title | Policy ID | Category | Version | Required | Active | Due Date |
|-------|-----------|----------|---------|----------|--------|----------|
| Information Security Policy | POL-SEC-001 | Security | 1.0 | Yes | Yes | 60 days from today |
| Remote Work Policy | POL-HR-001 | HR | 2.0 | Yes | Yes | 30 days from today |
| AI Usage Policy | POL-IT-001 | IT | 1.0 | Yes | Yes | 75 days from today |
| Code of Conduct | POL-HR-002 | HR | 3.0 | Yes | Yes | 90 days from today |

---

## Step 4: Add Web Parts to a SharePoint Page

### Employee Policy Acknowledgement Page

1. Navigate to the SharePoint site where the lists are created.
2. Create a new page or edit an existing page.
3. Add a web part → Search for **Policy Acknowledgement**.
4. Add it to a full-width or one-column section.
5. Configure via the property pane:
   - **Policies List Name:** `Policy Center - Policies`
   - **Acknowledgements List Name:** `Policy Center - Acknowledgements`
   - Enable department targeting and Graph profile as needed.
6. Publish the page.

### Admin Compliance Dashboard Page

1. Create a separate page (e.g., "Policy Compliance Dashboard").
2. Restrict page access to admins/policy owners.
3. Add a web part → Search for **Policy Compliance Dashboard**.
4. Add it to a full-width section.
5. Configure via the property pane:
   - **Policies List Name:** `Policy Center - Policies`
   - **Acknowledgements List Name:** `Policy Center - Acknowledgements`
   - Enable CSV export and department filter as needed.
6. Publish the page.

---

## Step 5: Approve API Permissions (Optional)

If you enable Microsoft Graph profile enrichment (department and job title), approve the API permission:

1. Go to **SharePoint Admin Center** → **Advanced** → **API access**.
2. Find the pending request for `User.Read` from the Policy Acknowledgement Center package.
3. Click **Approve**.

If this permission is not approved, the solution will gracefully fall back to basic user info from the page context (display name and email only).

---

## Verification

After setup, verify that:

- [ ] Both lists appear in Site Contents.
- [ ] Sample policies appear in the Policies list.
- [ ] The employee web part loads and displays policies.
- [ ] An employee can open a policy, check the acknowledgement box, and submit.
- [ ] The acknowledgement record appears in the Acknowledgements list.
- [ ] The admin dashboard shows policy metrics and acknowledgement data.
- [ ] CSV export downloads a file (if enabled).

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Web part shows "List not found" | Verify that list names in the property pane match the actual SharePoint list names exactly. |
| No policies displayed | Ensure policies have `IsActive` set to `Yes`. |
| Department targeting shows all policies | Approve `User.Read` Graph permission or set Target Departments to empty (shows to all users). |
| Cannot submit acknowledgement | Ensure employees have Contribute access to the Acknowledgements list. |
| Graph profile falls back to basic | Check that `User.Read` permission is approved in SharePoint Admin Center. |
