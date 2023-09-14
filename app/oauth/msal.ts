import { PublicClientApplication, Configuration } from "@azure/msal-browser";

const CLIENT_ID = "f0eaf1fc-c137-4bd1-8a54-f305273e64f4";
const TENANT_ID = "359cb345-7b01-4eb5-b890-f2f08666a7c1";

const IN_BROWER = typeof window !== "undefined";
const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID,
    authority: "https://login.microsoftonline.com/" + TENANT_ID,
    redirectUri: IN_BROWER ? window.location.origin : undefined,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

export const tokenRequest = {
  scopes: ["https://management.azure.com/user_impersonation"],
};

export const msal = new PublicClientApplication(msalConfig);
IN_BROWER && msal.initialize();
