import { PublicClientApplication, Configuration } from "@azure/msal-browser";

const CLIENT_ID = "f0eaf1fc-c137-4bd1-8a54-f305273e64f4";
const TENANT_ID = "359cb345-7b01-4eb5-b890-f2f08666a7c1";

const IN_BROWER = typeof window !== "undefined";

const IS_DEVELOP = process.env.NEXT_PUBLIC_VERCEL_ENV === "development";

const msalConfig: Configuration = {
    auth: {
        clientId: CLIENT_ID,
        authority: "https://login.microsoftonline.com/" + TENANT_ID,
        redirectUri: IS_DEVELOP ? "http://localhost:3000" : process.env.NEXT_PUBLIC_VERCEL_URL,
    },
    cache: {
        cacheLocation: "sessionStorage",
    },
};


export const tokenRequest = {
    scopes: ['https://management.azure.com/user_impersonation']
};


export const msal = new PublicClientApplication(msalConfig);
IN_BROWER && msal.initialize();