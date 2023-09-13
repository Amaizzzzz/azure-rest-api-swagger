
import { msal, tokenRequest } from "./msal";

export const Login = () => {

    const handleLogin = async () => {
        await msal.initialize();
        const res = await msal.loginPopup(tokenRequest);
        console.log(res);
    }

    const handleToken = async () => {
        await msal.initialize();
        const accounts = msal.getAllAccounts();
        const res = await msal.acquireTokenSilent({
            ...tokenRequest,
            account: accounts[0]
        });
        console.log(res);
    }


    return (
        <div>
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleToken}>Token</button>
        </div>
    )
}