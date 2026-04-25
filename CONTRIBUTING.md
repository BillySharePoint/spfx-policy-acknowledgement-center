# Contributing to SPFx Policy Acknowledgement Center

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

---

## How to Contribute

### Reporting Issues

- Use the [GitHub Issues](../../issues) tab to report bugs or request features.
- Before creating a new issue, search existing issues to avoid duplicates.
- For bug reports, include:
  - Steps to reproduce
  - Expected behavior
  - Actual behavior
  - SPFx version, Node.js version, and browser
  - Screenshots if applicable

### Suggesting Features

- Open an issue with the `enhancement` label.
- Describe the use case and why it would be valuable.
- Reference the [roadmap](docs/roadmap.md) to see if the feature is already planned.

### Submitting Pull Requests

1. **Fork** the repository.
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following the coding standards below.
4. **Test** your changes locally against a SharePoint Online site.
5. **Commit** with a clear, descriptive message:
   ```bash
   git commit -m "Add department filter to compliance dashboard"
   ```
6. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** against the `main` branch.

---

## Development Setup

### Prerequisites

- Node.js 22.x
- npm 10+
- A SharePoint Online tenant for testing

### Getting Started

```bash
# Clone your fork
git clone https://github.com/your-username/spfx-policy-acknowledgement-center.git
cd spfx-policy-acknowledgement-center

# Install dependencies
npm install

# Start the local workbench
npm run start
```

### Building

```bash
npm run build
```

### Cleaning

```bash
npm run clean
```

---

## Coding Standards

### TypeScript

- Use TypeScript strict mode conventions.
- Define interfaces for all data structures in the `src/models/` directory.
- Use `async`/`await` instead of raw Promises.
- Avoid `any` — use `unknown` or proper types.

### React

- Use functional components with hooks where practical.
- Keep components focused on a single responsibility.
- Place component props interfaces in separate files (e.g., `IPolicyAcknowledgementProps.ts`).

### Services

- All SharePoint and Graph API calls should go through the service layer (`src/services/`).
- Components should never call APIs directly.
- Services should handle errors gracefully and provide fallback behavior.

### Styling

- Use SCSS modules (`.module.scss`) for component styles.
- Follow Fluent UI design patterns.
- Support both light and dark themes.

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Interfaces | Prefix with `I` | `IPolicy`, `IAcknowledgement` |
| Service classes | PascalCase with `Service` suffix | `PolicyService`, `ExportService` |
| Components | PascalCase | `PolicyCard`, `StatusBadge` |
| Files | PascalCase for components/classes, camelCase for utilities | `PolicyCard.tsx`, `index.ts` |
| CSS classes | camelCase in SCSS modules | `.policyCard`, `.statusBadge` |

---

## Commit Messages

Use clear, descriptive commit messages:

- **feat:** A new feature (`feat: add CSV export to dashboard`)
- **fix:** A bug fix (`fix: correct overdue status calculation`)
- **docs:** Documentation changes (`docs: update setup guide`)
- **style:** Code style changes, no logic change (`style: format service files`)
- **refactor:** Code refactoring (`refactor: extract status logic to utility`)
- **test:** Adding or updating tests (`test: add PolicyService unit tests`)
- **chore:** Build, tooling, or dependency changes (`chore: update PnPjs to 4.x`)

---

## Pull Request Guidelines

- Keep PRs focused on a single change or feature.
- Include a clear description of what the PR does and why.
- Reference the related issue number (e.g., "Closes #12").
- Ensure the solution builds without errors (`npm run build`).
- Test against a live SharePoint Online environment if possible.
- Update documentation if your change affects setup, configuration, or usage.

---

## Code of Conduct

Be respectful and constructive. We are all working toward the same goal of building a useful open-source tool for the SharePoint community.

- Be welcoming to newcomers.
- Provide constructive feedback.
- Focus on the code, not the person.
- Respect differing viewpoints and experiences.

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
