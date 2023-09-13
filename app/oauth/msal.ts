import { PublicClientApplication, Configuration } from "@azure/msal-browser";

const msalConfig: Configuration = {
    auth: {
        clientId: "f0eaf1fc-c137-4bd1-8a54-f305273e64f4",
        authority: "https://login.microsoftonline.com/359cb345-7b01-4eb5-b890-f2f08666a7c1",
        redirectUri: "http://localhost:3000/",
    },
    cache: {
        cacheLocation: "sessionStorage",
    },
};


export const tokenRequest = {
    scopes: ['https://management.azure.com/user_impersonation']
};


export const msal = new PublicClientApplication(msalConfig);
msal.initialize();
