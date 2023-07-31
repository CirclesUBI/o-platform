import { CHAIN_NAMESPACES, CustomChainConfig, SafeEventEmitterProvider, WALLET_ADAPTERS, ADAPTER_EVENTS, getEvmChainConfig } from "@web3auth/base";
import { OpenloginAdapter, OpenloginLoginParams, OpenloginUserInfo } from "@web3auth/openlogin-adapter";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { Environment } from "./environment";
import RPC from "./web3RPC";

export type GetWeb3AuthResult =
  | Web3AuthNoModal
  | { login(args: any): Promise<{ privKey: string }>; getUserInfo(): Promise<{ userInfo: Partial<OpenloginUserInfo> }>; logout(): Promise<void> };

export class Web3Auth {
  private web3auth: Web3AuthNoModal | null;
  private provider: SafeEventEmitterProvider | null;
  private tmpPrivKey: {
    privKey: string;
  };

  constructor() {}

  init = async () => {
    try {
      this.web3auth = new Web3AuthNoModal({
        clientId: Environment.openLoginClientId,
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x64",
          rpcTarget: "https://rpc.circlesubi.id",
          displayName: "Circles",
          blockExplorer: "https://gnosis.blockscout.com",
          ticker: "xDai",
          tickerName: "xDai",
        },
        enableLogging: true,
        web3AuthNetwork: "mainnet",
      });

      const openloginAdapter = new OpenloginAdapter({
        privateKeyProvider: new EthereumPrivateKeyProvider({
          config: {
            chainConfig: getEvmChainConfig(1) as CustomChainConfig,
          },
        }),
      });
      this.web3auth.configureAdapter(openloginAdapter);

      await this.web3auth.init();
      this.subscribeAuthEvents(this.web3auth);
      if (this.web3auth.connectedAdapterName && this.web3auth.provider) {
        this.setProvider(this.web3auth.provider);
        return true;
      }
    } catch (error) {
      console.error("ERRORRRR:", error);
    }
  };

  // subscribe to lifecycle events emitted by web3auth
  subscribeAuthEvents = (web3auth: Web3AuthNoModal) => {
    this.web3auth.on(ADAPTER_EVENTS.CONNECTED, (data: any) => {
      console.log("connected to wallet", data);
      // this.web3auth.provider will be available here after user is connected
    });
    this.web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
      console.log("connecting");
    });
    this.web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
      console.log("disconnected");
    });
    this.web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
      console.log("error 1", error);
    });
  };

  private setProvider: ((provider: SafeEventEmitterProvider) => void) | null = (provider: SafeEventEmitterProvider) => {
    this.provider = provider;
  };

  login = async (loginProvider: string, mockprofileIndex: number = 0) => {
    if (Environment.useMockLogin) {
      if (mockprofileIndex) {
        const user: any = Environment.getTestProfile(mockprofileIndex);
        this.tmpPrivKey = {
          privKey: user.privateKey,
        };
      } else {
        const acc = RpcGateway.get().eth.accounts.create();
        this.tmpPrivKey = {
          privKey: acc.privateKey,
        };
      }
    } else {
      if (!this.web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      try {
        const web3authProvider = await this.web3auth.connectTo<OpenloginLoginParams>(WALLET_ADAPTERS.OPENLOGIN, {
          loginProvider: loginProvider,
          extraLoginOptions: { display: "touch", ui_locales: "en,id", prompt: "select_account" },
        });
        this.setProvider(web3authProvider);
      } catch (error) {
        console.error("login Error:", error);
      }
    }
  };

  authenticateUser = async () => {
    if (!this.web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const idToken = await this.web3auth.authenticateUser();
    console.log("idToken: ", idToken);
  };

  getUserInfo = async (mockprofileIndex: number = 0) => {
    console.log("Mockindes:", mockprofileIndex);
    if (Environment.useMockLogin) {
      const user: Partial<OpenloginUserInfo> = Environment.getTestProfile(mockprofileIndex);
      return user as OpenloginUserInfo;
    } else {
      if (!this.web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      const user: Partial<OpenloginUserInfo> = await this.web3auth.getUserInfo();
      return user as OpenloginUserInfo;
    }
  };

  logout = async () => {
    if (!this.web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await this.web3auth.logout();
    this.setProvider(null);
  };

  getAccounts = async () => {
    if (!this.provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(this.provider);
    const address = await rpc.getAccounts();
    console.log(address);
  };

  getBalance = async () => {
    if (!this.provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(this.provider);
    const balance = await rpc.getBalance();
    console.log(balance);
  };

  sendTransaction = async () => {
    if (!this.provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(this.provider);
    const receipt = await rpc.sendTransaction();
    console.log(receipt);
  };

  signMessage = async () => {
    if (!this.provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(this.provider);
    const signedMessage = await rpc.signMessage();
    console.log(signedMessage);
  };

  getPrivateKey = async () => {
    if (Environment.useMockLogin) {
      return this.tmpPrivKey;
    } else {
      if (!this.provider) {
        console.log("provider not initialized yet");
        return;
      }
      const rpc = new RPC(this.provider);
      const privateKey = await rpc.getPrivateKey();
      console.log("privateKey:", privateKey);
      return {
        privKey: privateKey,
      };
    }
  };
}
