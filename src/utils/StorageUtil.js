import { Storage } from "@ionic/storage";
import * as integration from "scholarpresent-integration";

const store = new Storage();
store
  .create()
  .then((value) => {
    console.log("[StorageUtil.js] Storage initiated ", value);
  })
  .catch((error) => {
    console.log("[StorageUtil.js] Storage initiated error ", error);
  });
export const getRoleName = async (roleId) => {
  console.log("getRoleName roleId:", roleId);
  let retVal = "No Role";
  let roleObject = await getUserRoles();
  console.log("roleObject ", roleObject);
  if (!Array.isArray(roleObject)) {
    roleObject = JSON.parse(roleObject);
  }
  console.log(
    "getRoleName roleObject ",
    roleObject,
    "roleObject?.items: ",
    roleObject?.items
  );
  let roleItems;
  if (roleObject?.items) {
    roleItems = roleObject?.items;
  } else {
    roleItems = roleObject;
  }
  console.log("getRoleName roleItems ", roleItems);
  if (roleItems) {
    let role = roleItems.find((item) => item.id === roleId);
    retVal = role?.roleName ? role?.roleName : "No Role";
  }
  console.log("getRoleName retVal ", retVal);
  return retVal;
};

export const getRoleId = async (roleName) => {
  console.log("getRoleId roleName:", roleName);
  let retVal = "No Role";
  let roleObject = await getUserRoles();
  console.log("roleObject ", roleObject);
  if (!Array.isArray(roleObject)) {
    roleObject = JSON.parse(roleObject);
  }
  console.log(
    "getRoleId roleObject ",
    roleObject,
    "roleObject?.items: ",
    roleObject?.items
  );
  let roleItems;
  if (roleObject?.items) {
    roleItems = roleObject?.items;
  } else {
    roleItems = roleObject;
  }
  console.log("getRoleId roleItems ", roleItems);
  if (roleItems) {
    let role = roleItems.find((item) => item.roleName === roleName);
    retVal = role?.id ? role?.id : "";
  }
  console.log("getRoleId retVal ", retVal);
  return retVal;
};

export const cacheSessionFromUserProfile = async (userProfile) => {
  const store = new Storage();
  await store.create();
  console.log("cacheSessionFromUserProfile  userProfile:", userProfile);

  store.set(TENANT_ID, userProfile.tenantId);
  store.set(CACHE_USER_LOGIN_ID, userProfile.id);
  store.set(CACHE_USER_LOGIN_ROLE_NAME, userProfile.roleName);
  store.set(
    CACHE_USER_PROFILE_FULL_NAME,
    userProfile?.firstName + " " + userProfile?.lastName
  );

  integration.getTenantInfo().then((value) => {
    console.log("getTenantInfo  ", value);
    if (value?.tenantName) {
      store.set(TENANT_NAME, value.tenantName);
      store.set(TENANT_COUNTRY_NAME, value.countryName);
      store.set(TENANT_COUNTRY_DIALING_CODE, value.countryDialingCode);
      store.set(TENANT_COUNTRY_CODE, value.countryCode);
    }
  });
};
export const cacheSession = async (userSession) => {
  const { accessToken } = userSession;
  const { idToken } = userSession;

  const store = new Storage();
  await store.create();

  let tenantId = accessToken.payload["cognito:groups"][0];
  console.log("tenantId ", tenantId);
  store.set(TENANT_ID, tenantId);
  console.log("cacheSession userSession ", userSession, " idToken ", idToken);

  try {
    const userIdPerTenantStr = idToken.payload["userIdPerTenant"];
    console.log("cacheSession idToken.payload ", idToken.payload);

    if (idToken?.payload?.userIdPerTenant) {
      const userIdPerTenant = JSON.parse(idToken.payload["userIdPerTenant"]);
      let userIdTenantKeys = Object.keys(userIdPerTenant);
      let userLogonId = userIdTenantKeys[0];
      store.set(CACHE_USER_LOGIN_ID, userLogonId);
    }

    if (idToken?.payload?.userIdPerTenant) {
      const userProfileStr = idToken.payload["userProfile"];
      if (userProfileStr) {
        const userProfile = JSON.parse(userProfileStr);
        if (userProfile.roleName) {
          store.set(CACHE_USER_LOGIN_ROLE_NAME, userProfile.roleName);
        }
        store.set(
          CACHE_USER_PROFILE_FULL_NAME,
          userProfile?.firstName + " " + userProfile?.lastName
        );
      }
    }

    integration
      .currentUserInfo()
      .then((currentUser) =>
        store.set(CACHE_COGNITO_CURRENT_USER, currentUser)
      );
  } catch (error) {
    console.log("cacheSession error ", error);
  }

  integration.getTenantInfo(tenantId).then((value) => {
    console.log("getTenantInfo  ", value);
    if (value?.tenantName) {
      store.set(TENANT_NAME, value.tenantName);
      store.set(TENANT_COUNTRY_NAME, value.countryName);
      store.set(TENANT_COUNTRY_DIALING_CODE, value.countryDialingCode);
      store.set(TENANT_COUNTRY_CODE, value.countryCode);
    }
  });
};

export const cacheTenantDetails = async (tenantId, roleName, fullName) => {
  const store = new Storage();
  await store.create();

  integration.getTenantInfo(tenantId).then((value) => {
    console.log("getTenantInfo  ", value);
    if (value?.tenantName) {
      console.log("Tenant cached ", value);

      store.set(TENANT_NAME, value.tenantName);
      store.set(TENANT_COUNTRY_NAME, value.countryName);
      store.set(TENANT_COUNTRY_DIALING_CODE, value.countryDialingCode);
      store.set(TENANT_COUNTRY_CODE, value.countryCode);
    }
  });

  store.set(CACHE_USER_LOGIN_ROLE_NAME, roleName);
  store.set(CACHE_USER_PROFILE_FULL_NAME, fullName);
};

export const cacheUserRoleName = async (roleName) => {
  const store = new Storage();
  await store.create();
  store.set(CACHE_USER_LOGIN_ROLE_NAME, roleName);
};
export const getUserProfile = async (userSession) => {
  const { idToken } = userSession;

  const userProfileStr = idToken.payload["userProfile"];
  const userProfile = JSON.parse(userProfileStr);
  console.log("getUserProfile userProfile ", userProfile);

  return userProfile;
};
export const getUserRoles = async (isHardRefresh = false) => {
  let roles = await store.get(CACHE_ALL_USER_ROLES);
  console.log("getUserRoles roles ", roles);
  if (roles === null || isHardRefresh) {
    roles = await integration.getUserRoles(null);
    store.set(CACHE_ALL_USER_ROLES, roles);
  }
  return roles;
};

export const CACHE_ALL_USER_ROLES = "ALL_USER_ROLES";
export const CACHE_USER_LOGIN_ROLE_NAME = "LOGIN_ROLE_NAME";
export const CACHE_CONFIG_STORAGE = "CACHE_CONFIG_STORAGE";
export const CACHE_COGNITO_CURRENT_USER = "CACHE_COGNITO_CURRENT_USER";

export const CACHE_USER_LOGIN_ID = "LOGIN_USER_ID";

export const CACHE_USER_PROFILE_FULL_NAME = "CACHE_USER_PROFILE_FULL_NAME";

export const CACHE_USER_PROFILE_URL = "USER_PROFILE_URL";
export const SAFARI_DISABLE_NOTIFICATION = "SAFARI_DISABLE_NOTIFICATION";

export const TENANT_NAME = "TENANT_NAME";

export const TENANT_ID = "TENANT_ID";

export const TENANT_COUNTRY_NAME = "TENANT_COUNTRY_NAME";

export const TENANT_COUNTRY_DIALING_CODE = "TENANT_COUNTRY_DIALING_CODE";

export const TENANT_COUNTRY_CODE = "TENANT_COUNTRY_CODE";

// Use to remember whether to show the tour or not.
export const TOUR_ACTIVE = "TOUR_ACTIVE";
