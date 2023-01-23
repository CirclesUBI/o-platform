import { NavigationManifest } from "./navigationManifest";
import { RuntimeDapp } from "./runtimeDapp";
import { Routable } from "./routable";
import { Jumplist } from "./routables/jumplist";

export type FeaturedActionSpec = {
  text: string;
  icon?: string;
  action: () => void;
};

export interface DappManifest<TState extends { [x: string]: any }> extends Routable {
  type: "dapp";
  /**
   * A unique identifier for this auth manifest.
   * This identifier is used as a namespace for all incoming and outgoing events of the auth.
   */
  dappId: string;

  /**
   * This icon will be displayed in the auth overview.
   */
  icon?: string;
  /**
   * This title will be displayed as the auth name.
   */
  title: string;

  featuredAction?: () => Promise<FeaturedActionSpec>;

  /**
   * The route of the entry page of this auth.
   */
  routeParts: string[];

  defaultRoute?: string[];

  /**
   * Can be used to indicate a status in the auth overview next to the icon.
   */
  tag: Promise<string | null | undefined>;

  /**
   * Contains all pages of the auth.
   */
  //pages: PageManifest[];

  routables: Routable[];
  jumplist?: Jumplist<any, TState>;
  navigation?: NavigationManifest;

  hideFooterGradient?: boolean;

  /**
   * If the auth needs to initialize things before it can be used,
   * then these steps must be performed in this factory.
   * @param runtimeDapp
   */
  initialize?: (
    stack: RuntimeDapp<TState>[],
    runtimeDapp: RuntimeDapp<TState>
  ) => Promise<{
    initialRoutable: Routable;
    cancelDependencyLoading: boolean;
  }>;
}
