# Changelog

All notable changes to the SPFx Policy Acknowledgement Center will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-04-25

### Added

#### Policy Acknowledgement Web Part (Employee-Facing)
- View active policies with real-time status badges (Not Started, Acknowledged, Overdue, Expired, Optional).
- Policy detail panel with description, document link, policy owner, and acknowledgement form.
- Acknowledgement submission with required checkbox confirmation.
- Tabbed navigation: Required Policies, Acknowledged, History.
- Search policies by title.
- Filter by category and status.
- Department-based policy targeting using Microsoft Graph user profile.
- Responsive layout support (full-width, multi-column, mobile).
- Dark theme support.
- Configurable via SharePoint property pane (list names, targeting, tabs, page size).

#### Policy Compliance Dashboard Web Part (Admin-Facing)
- Summary cards: Active Policies, Completion Rate, Overdue Users, Due This Week.
- Per-policy compliance table with acknowledged, pending, and overdue counts.
- Filter by category, department, status, and due date.
- CSV export of acknowledgement data with proper encoding.
- Configurable via SharePoint property pane (list names, export, filters, page size).

#### Service Layer
- `PolicyService` — Fetch active policies, filter by category, get by ID.
- `AcknowledgementService` — Create acknowledgements, query by user/policy/all.
- `UserProfileService` — Resolve user profile from page context with Microsoft Graph enrichment fallback.
- `ExportService` — Client-side CSV generation with UTF-8 BOM and proper field escaping.

#### Infrastructure
- SharePoint list schema: Policy Center - Policies, Policy Center - Acknowledgements.
- PnP PowerShell provisioning script (`create-policy-center-lists.ps1`) with optional sample data.
- Sample data files (JSON) for policies, acknowledgements, and departments.
- Full documentation: setup guide, deployment guide, configuration guide, list schema, architecture, roadmap.
- MIT License.
