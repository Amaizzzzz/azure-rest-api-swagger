import { msal, tokenRequest } from "./msal";

export enum TokenOrigin {
  AAD,
  MANUAL,
}

const KEY = "AZURE_API_SWAGGER_UI_TOKEN";

interface ISessionData {
  origin: TokenOrigin;
  token: string;
}

export function setSessionData(data: ISessionData) {
    console.log({data})
  sessionStorage.setItem(KEY, JSON.stringify(data));
}

// get token from session storage
export function getSessionData(): ISessionData| null {
  try {
    const data = JSON.parse(sessionStorage.getItem(KEY) || "{}");
    return data;
  } catch (e) {
    return null;
  }
}

export async function getTokeSilent(): Promise<string| null> {
  const { origin, token } = getSessionData() || {};
  if (origin === TokenOrigin.AAD) {
    await msal.initialize();
    const account = msal.getAllAccounts()[0];
    const res = await msal.acquireTokenSilent({
      ...tokenRequest,
      account,
    });
    return res.accessToken;
  }
  if (origin === TokenOrigin.MANUAL) {
    return token || null;
  }
  return null;
}