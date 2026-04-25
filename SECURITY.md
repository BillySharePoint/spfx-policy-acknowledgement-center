# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, please report security issues by emailing the repository owner directly. You can find contact information on the repository's GitHub profile.

When reporting, please include:

- A description of the vulnerability.
- Steps to reproduce.
- Potential impact.
- Suggested fix (if any).

You should receive a response within 7 days acknowledging receipt. We will work with you to understand the issue and coordinate a fix before any public disclosure.

## Security Practices

### Data Access

- The solution accesses only the SharePoint lists configured in the web part properties.
- All data access uses the current user's credentials (delegated permissions).
- No data is sent to external services or third-party endpoints.
- No data is stored in browser local storage or cookies.

### API Permissions

- The solution optionally requests `User.Read` (delegated) from Microsoft Graph to read the current user's department and job title.
- No application-level permissions are required.
- If Graph permissions are not approved, the solution falls back gracefully to SharePoint page context data.

### Authentication

- Authentication is handled entirely by the SharePoint Framework and the SharePoint Online platform.
- No custom authentication logic is implemented.
- No credentials, tokens, or secrets are stored in the solution code or configuration.

### Content Security

- CSV exports are generated client-side using the browser's Blob API.
- No server-side code execution occurs.
- All SharePoint list operations go through the standard SharePoint REST API via PnPjs.

## Dependency Management

- Dependencies are managed via npm and locked with `package-lock.json`.
- SPFx framework dependencies are pinned to version 1.22.2.
- Review `npm audit` output regularly and update dependencies to address known vulnerabilities.

## Disclaimer

This project is provided as-is under the MIT License. It is the responsibility of the deploying organization to review the code, configure appropriate SharePoint permissions, and ensure compliance with their own security policies before deploying to production.
