import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

import OpenLogin from "openlogin";
import { LoginParams, LOGIN_PROVIDER, LOGIN_PROVIDER_TYPE, UX_MODE, UX_MODE_TYPE, OPENLOGIN_NETWORK, OPENLOGIN_NETWORK_TYPE } from "@toruslabs/openlogin-utils";
import loginConfig from "./loginConfig";
import { Environment } from "./environment";
import whitelabel from "./torusWhiteLabel";
export type OpenloginUserInfo = {
  email?: string;
  name?: string;
  profileImage?: string;
  aggregateVerifier: string;
  verifier: string;
  verifierId: string;
  typeOfLogin: LOGIN_PROVIDER_TYPE;
};

let loading: boolean = false;
let privKey: string = "";
let ethereumPrivateKeyProvider: EthereumPrivateKeyProvider | null = null;
let selectedLoginProvider: LOGIN_PROVIDER_TYPE = LOGIN_PROVIDER.GOOGLE;
let login_hint: string = "";
let selectedUxMode: UX_MODE_TYPE = UX_MODE.POPUP;
let selectedOpenloginNetwork: OPENLOGIN_NETWORK_TYPE = OPENLOGIN_NETWORK.MAINNET;

export async function getOpenLogin(): Promise<OpenLogin> {
  const currentClientId = Environment.openLoginClientId;
  const op = new OpenLogin({
    clientId: currentClientId,
    network: selectedOpenloginNetwork,
    uxMode: selectedUxMode,
    loginConfig: loginConfig,
    whiteLabel: whitelabel,

    // sdkUrl: "https://staging.openlogin.com",
  });
  op.init();
  return op;
}
