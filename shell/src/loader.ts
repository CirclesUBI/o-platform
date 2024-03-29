import { passport } from "./dapps/o-passport.manifest";
import { banking } from "./dapps/o-banking.manifest";
import { home } from "./dapps/o-dashboard.manifest";
import { homepage } from "./dapps/o-homepage.manifest";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { contacts } from "./dapps/o-contacts.manifest";
import { coop } from "./dapps/o-coop.manifest";
import { translation } from "./dapps/o-translation.manifest";
import { notifications } from "./dapps/o-notification.manifest";
import { marketlisting } from "./dapps/o-marketlisting.manifest";
import { survey } from "./dapps/o-survey.manifest";

export const dapps: DappManifest<any>[] = [
  homepage,
  passport,
  banking,
  home,
  contacts,
  coop,
  translation,
  notifications,
  marketlisting,
  survey
];
