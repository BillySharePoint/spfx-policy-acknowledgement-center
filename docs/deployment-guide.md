# Deployment Guide

This guide covers building, packaging, and deploying the SPFx Policy Acknowledgement Center to SharePoint Online.

---

## Prerequisites

- Node.js 22.x installed
- npm dependencies installed (`npm install`)
- SharePoint Online tenant with an App Catalog
- Tenant Admin or Site Collection Admin permissions

---

## Step 1: Build the Solution

Run the production build:

```bash
npm run build
```

This command:
1. Cleans previous build artifacts.
2. Compiles TypeScript.
3. Bundles all assets for production.
4. Runs tests.
5. Generates the `.sppkg` package file.

The output package is located at:

```
sharepoint/solution/spfx-policy-acknowledgement-center.sppkg
```

---

## Step 2: Upload to App Catalog

### Tenant-Level App Catalog (Recommended)

1. Navigate to your **SharePoint Admin Center**.
2. Go to **More features** → **Apps** → **Open** (under "Apps").
3. Click **Upload** and select the `.sppkg` file.
4. In the deployment dialog:
   - Check **"Make this solution available to all sites in the organization"** for tenant-wide deployment.
   - Click **Deploy**.

### Site-Level App Catalog

If you prefer site-scoped deployment:

1. Ensure a site-level App Catalog exists on the target site. Create one if needed:

   ```powershell
   Add-PnPSiteCollectionAppCatalog -Site "https://yourtenant.sharepoint.com/sites/yoursite"
   ```

2. Navigate to `https://yourtenant.sharepoint.com/sites/yoursite/AppCatalog`.
3. Upload the `.sppkg` file.
4. Click **Deploy**.

---

## Step 3: Approve API Permissions

If the solution uses Microsoft Graph (for user profile enrichment), you need to approve the API permissions.

1. Go to **SharePoint Admin Center** → **Advanced** → **API access**.
2. You should see a pending permission request for:

   | API | Permission | Type |
   |-----|------------|------|
   | Microsoft Graph | `User.Read` | Delegated |

3. Select the request and click **Approve**.

> If you do not approve this permission, the solution will still work but will not be able to read user department and job title from Microsoft Graph. It will fall back to basic page context data.

---

## Step 4: Add the Solution to a Site

### If Deployed Tenant-Wide

The web parts are automatically available on all sites. No additional steps needed — just edit a page and add the web parts.

### If Deployed to Site-Level App Catalog

1. Go to the target site → **Site Contents** → **New** → **App**.
2. Find **spfx-policy-acknowledgement-center-client-side-solution**.
3. Click **Add**.
4. Wait for the app to install.

---

## Step 5: Add Web Parts to Pages

### Employee Page

1. Navigate to the site and create or edit a page.
2. Click **+** to add a web part.
3. Search for **Policy Acknowledgement**.
4. Place it in a full-width or single-column section.
5. Open the property pane and configure list names if they differ from defaults.
6. Publish the page.

### Admin Dashboard Page

1. Create a new page (recommended: restrict access to admins only).
2. Add the **Policy Compliance Dashboard** web part.
3. Place it in a full-width section for best results.
4. Configure list names and export settings in the property pane.
5. Publish the page.

---

## Step 6: Verify Deployment

After deployment, verify:

- [ ] Web parts appear in the web part picker.
- [ ] Employee web part loads policies from the Policies list.
- [ ] Admin dashboard loads metrics and acknowledgement data.
- [ ] Acknowledgement submission creates records in the Acknowledgements list.
- [ ] CSV export works (if enabled).
- [ ] Department targeting works (if Graph permission approved).

---

## Updating the Solution

To deploy an updated version:

1. Increment the version in `config/package-solution.json`:

   ```json
   "version": "1.1.0.0"
   ```

2. Rebuild:

   ```bash
   npm run build
   ```

3. Upload the new `.sppkg` file to the App Catalog.
4. SharePoint will prompt you to replace the existing package.
5. Click **Deploy** to update.

The updated web parts will be available immediately on all pages where they are used.

---

## Removing the Solution

### From Tenant App Catalog

1. Go to the App Catalog.
2. Select the package → **Delete**.
3. Confirm removal.

### From Site App Catalog

1. Go to **Site Contents**.
2. Find the app → click **...** → **Remove**.

### Clean Up

After removing the solution, the SharePoint lists and data remain intact. Remove them manually if no longer needed:

```powershell
Connect-PnPOnline -Url "https://yourtenant.sharepoint.com/sites/yoursite" -Interactive
Remove-PnPList -Identity "Policy Center - Policies" -Force
Remove-PnPList -Identity "Policy Center - Acknowledgements" -Force
```

---

## CI/CD Considerations

For automated deployments, consider:

- **Azure DevOps Pipelines** or **GitHub Actions** with the [CLI for Microsoft 365](https://pnp.github.io/cli-microsoft365/).
- Use `m365 spo app add` and `m365 spo app deploy` commands.
- Store tenant credentials securely using pipeline secrets or Azure Key Vault.

Example GitHub Actions step:

```yaml
- name: Deploy to App Catalog
  run: |
    m365 login --authType certificate --certificateFile ${{ secrets.CERT_PATH }} --thumbprint ${{ secrets.CERT_THUMBPRINT }} --appId ${{ secrets.APP_ID }} --tenant ${{ secrets.TENANT_ID }}
    m365 spo app add --filePath sharepoint/solution/spfx-policy-acknowledgement-center.sppkg --appCatalogUrl https://yourtenant.sharepoint.com/sites/appcatalog --overwrite
    m365 spo app deploy --name spfx-policy-acknowledgement-center.sppkg --appCatalogUrl https://yourtenant.sharepoint.com/sites/appcatalog
```
