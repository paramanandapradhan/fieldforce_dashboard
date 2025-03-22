import type { OrgDataModel } from "$lib/org/org-types";
import type { ClaimUsers, UserDataModel } from "$lib/user/user-types";
import type { FirebaseAuthClaimsType, FirebaseAuthStatesEnum } from "../auth-types";
import type { User as FirebaseAuthUserType } from 'firebase/auth';

type Props = {
    firebaseAuthUser: FirebaseAuthUserType | null,
    firebaseAuthState: FirebaseAuthStatesEnum | null,
    firebaseAuthClaims: FirebaseAuthClaimsType | null,
    authOrg: OrgDataModel | null,
    authOrgUser: UserDataModel | null,
    authOrgUsers: ClaimUsers[],
    isRootUser: boolean,
    isSupportUser: boolean,
    isAdminUser: boolean,
    isEmailVerificationRequired: boolean,
    isUserNameRequired: boolean,
    isNewOrganizationRequired: boolean,

}

export const authState = $state<Props>({
    firebaseAuthUser: null,
    firebaseAuthState: null,
    firebaseAuthClaims: null,
    authOrg: null,
    authOrgUser: null,
    authOrgUsers: [],
    isRootUser: false,
    isSupportUser: false,
    isAdminUser: false,
    isEmailVerificationRequired: false,
    isUserNameRequired: false,
    isNewOrganizationRequired: false,
});