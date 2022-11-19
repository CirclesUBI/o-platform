import OpenLogin, {OpenloginUserInfo} from "@toruslabs/openlogin";
import {Environment} from "./environment";
import {Utilities} from "../dapps/o-banking/chain/utilities";

let openLogin: OpenLogin;

export type GetOpenLoginResult = OpenLogin|{login(args:any):{privKey:string}, getUserInfo():{userInfo:any}, logout():Promise<void>};

export async function getOpenLogin(): Promise<GetOpenLoginResult> {
  if (Environment.useMockLogin)
  {
    return <GetOpenLoginResult>{
      async login(_): Promise<{ privKey: string }> {
        const acc = Utilities.generateRandomKey();
        return {
          privKey: acc.privateKey
        };
      },
      async getUserInfo(): Promise<OpenloginUserInfo> {
        return {
          email: "email@some.hostname.of.some.mailserver.somewhere",
          name: "Oauth profile name",
          typeOfLogin: "google",
          profileImage: "https://some.url.to.somewhere",
          aggregateVerifier: "not-verified",
          verifier: "not-verified",
          verifierId: "not-verified"
        }
      }
    };
  }

  if (!openLogin) {
    openLogin = new OpenLogin({
      clientId: Environment.openLoginClientId,
      network: "mainnet",
      uxMode: "popup", // default is redirect , popup mode is also supported
    });
    await openLogin.init();
  }

  return openLogin;
}