import OpenLogin from "openlogin";
import { LOGIN_PROVIDER_TYPE, UX_MODE, UX_MODE_TYPE, OPENLOGIN_NETWORK, OPENLOGIN_NETWORK_TYPE } from "@toruslabs/openlogin-utils";
import loginConfig from "./loginConfig";
import { Environment } from "./environment";
import whitelabel from "./torusWhiteLabel";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
export type OpenloginUserInfo = {
  email?: string;
  name?: string;
  profileImage?: string;
  aggregateVerifier: string;
  verifier: string;
  verifierId: string;
  typeOfLogin: LOGIN_PROVIDER_TYPE;
};

let selectedUxMode: UX_MODE_TYPE = UX_MODE.POPUP;
let selectedOpenloginNetwork: OPENLOGIN_NETWORK_TYPE = OPENLOGIN_NETWORK.MAINNET;

export async function getOpenLogin(): Promise<OpenLogin> {
  if (Environment.useMockLogin) {
    return <any>{
      async login(params: any): Promise<{ privKey: string }> {
        const acc = RpcGateway.get().eth.accounts.create();
        return {
          privKey: acc.privateKey,
        };
      },
      async logout(): Promise<void> { },
      async getUserInfo(): Promise<OpenloginUserInfo> {
        return {
          email: "email@some.hostname.of.some.mailserver.somewhere",
          name: "Oauth profile name",
          typeOfLogin: "google",
          profileImage: "https://some.url.to.somewhere",
          aggregateVerifier: "not-verified",
          verifier: "not-verified",
          verifierId: "not-verified",
        };
      },
    };
  }

  const currentClientId = Environment.openLoginClientId;
  const op = new OpenLogin({
    clientId: currentClientId,
    network: selectedOpenloginNetwork,
    uxMode: selectedUxMode,
    // loginConfig: loginConfig,
    whiteLabel: whitelabel,
  });
  op.init();
  return op;
}
