# Roadmap

This roadmap outlines planned features and improvements for the SPFx Policy Acknowledgement Center.

---

## v1.0 — MVP (Current)

The initial release provides core policy acknowledgement and compliance tracking functionality.

### Employee Web Part
- [x] View active policies with status badges (Not Started, Acknowledged, Overdue, Expired, Optional)
- [x] Policy detail panel with description, document link, and owner
- [x] Acknowledgement submission with required checkbox
- [x] Tabbed navigation: Required Policies, Acknowledged, History
- [x] Search by policy title
- [x] Filter by category and status
- [x] Department-based targeting via Microsoft Graph profile
- [x] Responsive design for full-width, multi-column, and mobile layouts
- [x] Dark theme support

### Admin Dashboard
- [x] Summary cards: Active Policies, Completion Rate, Overdue Users, Due This Week
- [x] Per-policy compliance table with completion metrics
- [x] Filter by category, department, status, and due date
- [x] CSV export of acknowledgement data
- [x] Configurable via property pane

### Infrastructure
- [x] SharePoint list-based backend (Policies + Acknowledgements)
- [x] PnP PowerShell provisioning script with sample data
- [x] Service layer architecture (PolicyService, AcknowledgementService, UserProfileService, ExportService)
- [x] PnPjs 4 for all SharePoint operations
- [x] Microsoft Graph fallback for user profile enrichment
- [x] Full property pane configuration (list names, targeting, export, page size)

---

## v1.1 — Enhanced Filtering & Notifications

### Planned Features
- [ ] Enhanced search with full-text search across policy title and description
- [ ] Filter by policy owner
- [ ] Filter by due date range (date picker)
- [ ] Bulk acknowledgement (acknowledge multiple policies at once)
- [ ] Sortable columns in the admin compliance table
- [ ] Clickable drill-down from dashboard summary cards to filtered views
- [ ] Power Automate template for email reminders (overdue policies)
- [ ] Power Automate template for manager notifications
- [ ] Pagination improvements with "Load More" or infinite scroll

---

## v1.2 — Analytics & History

### Planned Features
- [ ] **My Policy History Web Part** — A standalone web part for employees to view their complete acknowledgement history across all policies
- [ ] Policy analytics charts (acknowledgement trend over time)
- [ ] Department-level compliance heatmap
- [ ] Overdue aging report (days overdue breakdown)
- [ ] Policy effectiveness metrics (average time to acknowledge)
- [ ] Dashboard print/PDF export
- [ ] Acknowledgement audit log with timestamps
- [ ] Admin ability to revoke acknowledgements
- [ ] Admin ability to mark old acknowledgements as Superseded when version changes

---

## v2.0 — Advanced Targeting & Integration

### Planned Features
- [ ] **Azure AD / Entra ID group-based targeting** — Assign policies to security groups or Microsoft 365 groups instead of just departments
- [ ] **Policy Assignments list** — Explicit policy-to-user/group/department mapping for fine-grained control
- [ ] **Viva Connections Adaptive Card Extension (ACE)** — Dashboard card showing pending acknowledgements in Viva Connections
- [ ] **Policy Owner Management Web Part** — Dedicated interface for policy owners to create, edit, and manage policies
- [ ] **Power Automate integration** — Triggers for new policy published, acknowledgement submitted, policy overdue
- [ ] **Teams integration** — Acknowledgement notifications via Teams bot or Activity Feed
- [ ] **Multi-language support** — Localized strings for policy UI
- [ ] **Custom views** — Save and share filter configurations
- [ ] **Acknowledgement delegation** — Managers can acknowledge on behalf of employees (with audit trail)
- [ ] **Policy attachments** — Attach multiple documents to a single policy
- [ ] **Acknowledgement expiration** — Auto-expire acknowledgements after a configurable period, requiring re-acknowledgement

---

## Future Considerations

These items are under consideration but not yet scheduled:

- SharePoint Embedded or Microsoft Lists integration
- Power BI report template for advanced compliance analytics
- Integration with Microsoft Purview for compliance workflows
- Policy approval workflow (draft → review → published)
- Digitally signed acknowledgements
- API-based integration with third-party HR/compliance systems
- Site template with pre-configured pages, lists, and web parts

---

## Contributing to the Roadmap

Have a feature request? Open a [GitHub Issue](../../issues) with the `enhancement` label. Community contributions are welcome — see [CONTRIBUTING.md](../CONTRIBUTING.md).
