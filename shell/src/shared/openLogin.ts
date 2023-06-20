import { getED25519Key } from "@toruslabs/openlogin-ed25519";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import * as bs58 from "bs58";
import OpenLogin from "@toruslabs/openlogin";
import { LoginParams, LOGIN_PROVIDER, LOGIN_PROVIDER_TYPE, UX_MODE, UX_MODE_TYPE, OPENLOGIN_NETWORK, OPENLOGIN_NETWORK_TYPE } from "@toruslabs/openlogin-utils";
import loginConfig from "./loginConfig";
import { Environment } from "./environment";

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
let isWhiteLabelEnabled: boolean = false;
let selectedUxMode: UX_MODE_TYPE = UX_MODE.REDIRECT;
let selectedOpenloginNetwork: OPENLOGIN_NETWORK_TYPE = OPENLOGIN_NETWORK.TESTNET;

// const openlogin = this.openloginInstance;
// await openlogin.init();
// if (openlogin.privKey) {
//   this.privKey = openlogin.privKey;
//   await this.setProvider(this.privKey);
// }

export async function getOpenLogin(): Promise<OpenLogin> {
  const currentClientId = Environment.openLoginClientId;
  const op = new OpenLogin({
    clientId: currentClientId,
    network: selectedOpenloginNetwork,
    uxMode: selectedUxMode,
    whiteLabel: {},
    // loginConfig: loginConfig,
    // sdkUrl: "https://staging.openlogin.com",
  });
  op.init();
  return op;
}
