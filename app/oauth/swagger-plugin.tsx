import { SwaggerUIPlugin } from "swagger-ui";
import { getTokeSilent } from "./session";
import { AuthBtnContainer } from "./components";

export const OauthPlugin: SwaggerUIPlugin = (system) => {
  return {
    components: {
      AuthorizeBtnContainer: AuthBtnContainer,
    },
  };
};

export async function requestInterceptor(req: any) {
  if (req.url.startsWith("https://raw.githubusercontent.com")) {
    return req;
  }
  const token = await getTokeSilent();
  if (!token) {
    console.warn(
      "No Access token provided, please authorize through AAD or manually enter access token."
    );
  }
  req.headers.Authorization = `Bearer ${token}`;
  return req;
}
