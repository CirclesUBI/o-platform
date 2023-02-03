/**
 * Contains environment variables which are filled in by webpack.
 */
import {getSdk, Sdk} from "./api/data/types";
import {GraphQLClient} from "graphql-request";

export class Environment {

  static get api(): Sdk {
    return getSdk(new GraphQLClient(Environment.apiEndpointUrl));
  }
  public static get showLanguageSwitcher(): boolean {
    // @ts-ignore
    return "__SHOW_LANGUAGE_SWITCHER__" == "true";
  }

  public static get placesApiKey(): string {
    return "__PLACES_API_KEY__";
  }

  public static get apiEndpointUrl(): string {
    return "__API_ENDPOINT__";
  }

  public static get pathfinderEndpointUrl(): string {
    return "__PATHFINDER_ENDPOINT__";
  }

  public static get circlesSubgraphEndpoint(): string {
    return "__CIRCLES_SUBGRAPH_ENDPOINT__";
  }

  public static get circlesHubAddress(): string {
    return "__CIRCLES_HUB_ADDRESS__";
  }

  public static get safeProxyFactoryAddress(): string {
    return "__SAFE_PROXY_FACTORY_ADDRESS__";
  }

  public static get masterSafeAddress(): string {
    return "__SAFE_ADDRESS__";
  }

  public static get xdaiRpcGatewayUrl(): string {
    return "__RPC_ENDPOINT__";
  }

  public static get useMockLogin(): boolean {
    // @ts-ignore
    return "__USE_MOCKS__" == "true";
  }

  public static get openLoginClientId(): string {
    return "__OPENLOGIN_CLIENT_ID__";
  }

  public static get hereApiKey(): string {
    return "__HERE_API_KEY__";
  }

  public static get userLanguage(): string {
    if (!this.showLanguageSwitcher)
      return "en";

    if (localStorage.getItem("userLanguage")) {
      return localStorage.getItem("userLanguage");
    } else {
      return navigator.language.toLowerCase();
    }
  }
  public static set userLanguage(value: string) {
    localStorage.setItem("userLanguage", value);
  }

  public static getTestProfile(index: number): {
    privateKey: string;
    email: string;
    name: string;
    typeOfLogin: string;
    profileImage: string;
    aggregateVerifier: "not-verified";
    verifier: "not-verified";
    verifierId: "not-verified";
  } {
    if (!this.useMockLogin) throw new Error(`The built-in test keys can only be used if USE_MOCKS == true.`);

    const names = [
      "Chica Vahan"
    ];
    const whitespace = new RegExp("\\s", "g");
    const emails = names.map((o) => o.replace(whitespace, ".")).map((o) => o + "@example.com");
    const pictures = [
      "https://images.unsplash.com/photo-1657781536566-1a1f6f5fea99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTExMA&ixlib=rb-1.2.1&q=80&w=1080"
    ];
    const keys = [
      "0x471ae2170c3fea6a94f63f38e9a13faaf7bde116a9617fec9b931fc1837103c0"
    ];
    const profiles: {
      privateKey: string;
      email: string;
      name: string;
      typeOfLogin: string;
      profileImage: string;
      aggregateVerifier: "not-verified";
      verifier: "not-verified";
      verifierId: "not-verified";
    }[] = [];
    for (let i = 0; i < keys.length; i++) {
      const email = emails[i];
      const key = keys[i];
      const name = names[i];
      const picture = pictures[i];
      profiles.push({
        privateKey: key,
        name,
        email,
        profileImage: picture,
        typeOfLogin: "google",
        verifier: "not-verified",
        verifierId: "not-verified",
        aggregateVerifier: "not-verified",
      });
    }
    return profiles[index];
  }
}
