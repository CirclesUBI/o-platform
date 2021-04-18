import { faPeopleArrows } from "@fortawesome/free-solid-svg-icons";
import Home from "./o-passport/pages/Home.svelte";
import Account from "./o-passport/pages/Account.svelte";
import Keys from "./o-passport/pages/Keys.svelte";
import Settings from "./o-passport/pages/Settings.svelte";
import CreatePassport from "./o-passport/pages/CreatePassport.svelte";
import ExchangeToken from "./o-passport/pages/ExchangeToken.svelte";
import CreateOrImportKey from "./o-passport/pages/CreateOrImportKey.svelte";
import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { logout } from "./o-passport/processes/logout";
import gql from "graphql-tag";
import {push} from "svelte-spa-router";

const index: PageManifest = {
  isDefault: true,
  routeParts: ["profile"],
  component: Home,
  title: "Profile",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

const createPassport : PageManifest = {
  isDefault: false,
  isSystem: true,
  isFullWidth: true,
  hideFooter: true,
  routeParts: ["new-passport"],
  component: CreatePassport,
  title: "Create your new passport",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};

const createOrImportKey : PageManifest = {
  isDefault: false,
  isSystem: true,
  isFullWidth: true,
  hideFooter: true,
  routeParts: ["create-or-import-key"],
  component: CreateOrImportKey,
  title: "Create a new key or import an existing",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};

const account: PageManifest = {
  isDefault: false,
  routeParts: ["account"],
  component: Account,
  title: "Accounts",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

const keys: PageManifest = {
  isDefault: false,
  routeParts: ["keys"],
  component: Keys,
  title: "Keys",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

const settings: PageManifest = {
  isDefault: false,
  routeParts: ["settings"],
  component: Settings,
  title: "Settings",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

const exchangeToken: PageManifest = {
  isDefault: false,
  isSystem: true,
  isFullWidth: true,
  hideFooter: true,
  routeParts: ["exchangeToken", ":jwt"],
  component: ExchangeToken,
  title: "Login",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

export interface DappState {
  // put state here
}

export const passport: DappManifest<DappState> = {
  dappId: "passport:1",
  isSingleton: true,
  dependencies: [],
  isHidden: false,
  icon: faPeopleArrows,
  title: "Passport",
  routeParts: ["passport"],
  tag: Promise.resolve("alpha"),
  actions: [
    {
      key: "logout",
      label: "Logout",
      event: () => {
        window.o.apiClient.client.subscribeToResult()
        .then(client => {
          client.mutate({
            mutation: gql`
              mutation logout {
                logout {
                  success
                }
              }
            `,
            variables: {
            }
          });
        });

        push("/");
        return {
          type: "process.nop",
          id: ""
        };
/*
        return new RunProcess<ShellProcessContext>(
          shellProcess,
          true,
          async (ctx) => {
            ctx.childProcessDefinition = logout;
            ctx.childContext = {
              data: {},
              dirtyFlags: {},
              environment: {
                errorView: Error,
                progressView: LoadingIndicator,
                successView: Success,
              },
            };
            return ctx;
          }
        );
 */
      },
    },
  ],
  isEnabled: true,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialPage: index,
      cancelDependencyLoading: false,
    };
  },
  pages: [index, account, keys, settings, exchangeToken, createPassport, createOrImportKey],
};
