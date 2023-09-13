import { SwaggerUIPlugin } from "swagger-ui";
import { msal, tokenRequest } from "./msal";
import { useCallback, useEffect } from "react";

const AuthBtnContainer = (props: any) => {
  const { authActions, authSelectors, getComponent } = props;

  const isAuthorized = !!authSelectors.authorized().size;

  const setSwaggerAuthorized = useCallback((token) => {
    const first = authSelectors.definitionsToAuthorize().valueSeq().first();
    const name = first
      .filter((schema) => schema.get("type") === "oauth2")
      .keySeq()
      .first();
    authActions.authorizeOauth2({
      auth: {
        name,
      },
      token: token,
    });
  }, [authActions, authSelectors]);

  const onClick = async () => {
    try {
      await msal.initialize();
      const res = await msal.loginPopup(tokenRequest);
      setSwaggerAuthorized(res.accessToken);
    } catch (error) {
      console.log("Authorization failed:", error);
    }
  };
  
  useEffect(() => {
    const accounts = msal.getAllAccounts();
    if (accounts.length > 0) {
      msal.acquireTokenSilent({
        ...tokenRequest,
        account: accounts[0],
      }).then((res) => {
        setSwaggerAuthorized(res.accessToken);
      });
    }
  }, [setSwaggerAuthorized])

  const LockAuthIcon = getComponent("LockAuthIcon", true);
  const UnlockAuthIcon = getComponent("UnlockAuthIcon", true);

  return (
    <div className="auth-wrapper">
      <button
        className={
          isAuthorized ? "btn authorize locked" : "btn authorize unlocked"
        }
        onClick={onClick}
      >
        <span>Authorize</span>
        {isAuthorized ? <LockAuthIcon /> : <UnlockAuthIcon />}
      </button>
    </div>
  );
};

export const OauthPlugin: SwaggerUIPlugin = (system) => {
  return {
    components: {
      AuthorizeBtnContainer: AuthBtnContainer,
    },
  };
};

export async function requestInterceptor(req) {
    if (req.url.startsWith("https://raw.githubusercontent.com")) {
        return req;
    }
    await msal.initialize();
    const accounts = msal.getAllAccounts();
    const res = await msal.acquireTokenSilent({
        ...tokenRequest,
        account: accounts[0]
    });
    req.headers.Authorization = `Bearer ${res.accessToken}`;
    return req;
}