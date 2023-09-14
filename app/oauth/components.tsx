import { useCallback, useEffect, useState } from "react";
import { msal, tokenRequest } from "./msal";
import {
  TokenOrigin,
  getSessionData,
  getTokeSilent,
  setSessionData,
} from "./session";

export const AuthBtnContainer = (props: any) => {
  const { authActions, authSelectors, getComponent } = props;

  const [showDialog, setShowDialog] = useState(false);

  const isAuthorized = !!authSelectors.authorized().size;

  const setSwaggerAuthorized = useCallback(() => {
    const first = authSelectors.definitionsToAuthorize().valueSeq().first();
    const name = first
      .filter((schema) => schema.get("type") === "oauth2")
      .keySeq()
      .first();
    authActions.authorizeOauth2({
      auth: {
        name,
      },
      token: "dummy token",
    });
  }, [authActions, authSelectors]);

  const onAuthorize = async () => {
    try {
      await msal.initialize();
      const res = await msal.loginPopup(tokenRequest);
      setSessionData({ origin: TokenOrigin.AAD, token: res.accessToken });
      setSwaggerAuthorized();
    } catch (error) {
      console.log("Authorization failed:", error);
    }
  };

  const onDialogClose = (isComfirm: boolean) => {
    setShowDialog(false);
    if (isComfirm) {
      setSwaggerAuthorized();
    }
  };

  useEffect(() => {
    getTokeSilent().then((token) => {
      if (token) {
        setSwaggerAuthorized();
      }
    });
  }, [setSwaggerAuthorized]);

  const LockAuthIcon = getComponent("LockAuthIcon", true);
  const UnlockAuthIcon = getComponent("UnlockAuthIcon", true);

  return (
    <div className="auth-wrapper">
      <button
        className={
          isAuthorized ? "btn authorize locked" : "btn authorize unlocked"
        }
        onClick={onAuthorize}
      >
        <span>Authorize through AAD</span>
        {isAuthorized ? <LockAuthIcon /> : <UnlockAuthIcon />}
      </button>
      <button
        className={
          isAuthorized ? "btn authorize locked" : "btn authorize unlocked"
        }
        onClick={() => setShowDialog(true)}
      >
        <span>Enter access token</span>
        {isAuthorized ? <LockAuthIcon /> : <UnlockAuthIcon />}
      </button>
      {showDialog && <EnterTokenDialog onClose={onDialogClose} />}
    </div>
  );
};

const EnterTokenDialog = (props: { onClose: (isComfirm: boolean) => void }) => {
  const { onClose } = props;

  const [token, setToken] = useState("");

  const onComfirm = () => {
    setSessionData({ origin: TokenOrigin.MANUAL, token });
    onClose(true);
  };

  useEffect(() => {
    const { origin, token } = getSessionData() || {};
    if (origin === TokenOrigin.MANUAL) {
      setToken(token);
    }
  }, []);

  return (
    <div className="dialog-ux">
      <div className="backdrop-ux"></div>
      <div className="modal-ux">
        <div className="modal-dialog-ux">
          <div className="modal-ux-inner">
            <div className="modal-ux-header">
              <h3>Enter access token</h3>
              <button
                type="button"
                className="close-modal"
                onClick={() => onClose(false)}
              >
                <span aria-hidden="true">X</span>
              </button>
            </div>
            <div className="modal-ux-content">
              <input
                style={{ width: "100%" }}
                type="password"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                }}
              ></input>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  paddingTop: "1em",
                }}
              >
                <button
                  type="button"
                  className="btn execute"
                  onClick={onComfirm}
                >
                  <span aria-hidden="true">Confirm</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
