import { WebPartContext } from '@microsoft/sp-webpart-base';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import { IUserProfile } from '../models/IUserProfile';

export class UserProfileService {
    private _context: WebPartContext;

    constructor(context: WebPartContext) {
        this._context = context;
    }

    /**
     * Gets basic user info from page context (always available).
     */
    public getBasicProfile(): IUserProfile {
        return {
            displayName: this._context.pageContext.user.displayName,
            email: this._context.pageContext.user.email || this._context.pageContext.user.loginName,
            department: undefined,
            jobTitle: undefined,
        };
    }

    /**
     * Gets enriched user profile from Microsoft Graph (department + job title).
     * Falls back to basic profile if Graph is unavailable.
     */
    public async getEnrichedProfile(): Promise<IUserProfile> {
        const basic = this.getBasicProfile();

        try {
            const graphClient: MSGraphClientV3 = await this._context.msGraphClientFactory.getClient('3');
            const graphProfile = await graphClient
                .api('/me')
                .select('displayName,mail,department,jobTitle,userPrincipalName')
                .get();

            return {
                displayName: graphProfile.displayName || basic.displayName,
                email: graphProfile.mail || graphProfile.userPrincipalName || basic.email,
                department: graphProfile.department || undefined,
                jobTitle: graphProfile.jobTitle || undefined,
            };
        } catch {
            // Graph may not have permissions; fall back gracefully
            console.warn('PolicyCenter: Unable to retrieve Graph profile. Falling back to page context.');
            return basic;
        }
    }

    /**
     * Gets current user's SharePoint site user ID (needed for Person fields).
     */
    public async getCurrentUserId(): Promise<number> {
        try {
            return this._context.pageContext.legacyPageContext?.userId || 0;
        } catch {
            return 0;
        }
    }
}
