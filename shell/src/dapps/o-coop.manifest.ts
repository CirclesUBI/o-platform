import Organisations from "./o-coop/pages/Organisations.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { createOrganisation } from "./o-coop/processes/createOrganisation";
import { ContactsDappState } from "./o-contacts.manifest";
import OrganisationDetail from "./o-coop/pages/OrganisationDetail.svelte";
import { addMember } from "./o-coop/processes/addMember";
import { JumplistItem } from "@o-platform/o-interfaces/dist/routables/jumplist";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { loadProfile } from "../shared/functions/loadProfile";
import { CapabilityType, Organisation, Profile } from "../shared/api/data/types";
import { me } from "../shared/stores/me";
import { getSessionInfo } from "./o-passport/processes/identify/services/getSessionInfo";
import { addOwner } from "./o-coop/processes/addOwner";
import { push } from "svelte-spa-router";
import { Link } from "@o-platform/o-interfaces/dist/routables/link";

const externalChat: Link<any, DappState> = {
  type: "link",
  title: "common.support",
  icon: "whatsapp",
  routeParts: ["=chat"],
  openInNewTab: true,
  url: () => "https://wa.me/6281337303696",
};

const index: Page<any, ContactsDappState> = {
  routeParts: ["=organisations"],
  component: Organisations,
  title: "Coops",
  type: "page",
};

export const profile: Page<any, ContactsDappState> = {
  type: "page",
  isSystem: true,
  position: "modal",
  routeParts: ["=organisations", ":id"],
  title: "Profile",
  component: OrganisationDetail,
};

export interface DappState {
  // put state here
}

export const coop: DappManifest<DappState> = {
  type: "dapp",
  dappId: "coops:1",
  icon: "passport",
  title: "Coops",
  routeParts: ["=coops"],
  defaultRoute: ["organisations"],
  tag: Promise.resolve("alpha"),
  jumplist: {
    type: "jumplist",
    title: "Coops",
    icon: "organization",
    isSystem: true,
    routeParts: [],
    items: async (params, runtimeDapp) => {
      let $me: Profile | Organisation = null;
      me.subscribe((me) => ($me = me))();

      const list = [];
      if ($me.__typename !== "Organisation" && !$me.memberships) {
        list.push(<JumplistItem>{
          key: "createOrganisation",
          type: "action",
          order: 2,
          icon: "plus",
          category: "Coops",
          title: window.o.i18n("dapps.common.quickactions.createOrganization"),
          action: async () => {
            window.o.runProcess(
              createOrganisation,
              {
                successAction: async (data) => {
                  const createdOrga = await loadProfile(data.circlesAddress, $me);

                  window.o.publishEvent(<PlatformEvent>{
                    type: "shell.loggedOut",
                  });
                  window.o.publishEvent(<PlatformEvent>{
                    type: "shell.authenticated",
                    profile: {
                      ...createdOrga.profile,
                      __typename: "Organisation",
                      type: "Organisation",
                      name: createdOrga.profile.firstName,
                      description: createdOrga.profile.dream,
                      locationName: createdOrga.profile.locationName,
                      location: createdOrga.profile.location,
                    },
                  });

                  push(`#/market/mystore/${createdOrga.profile.circlesAddress}`);
                },
              },
              {}
            );
          },
        });
      }

      // if (<string>$me.__typename === "Organisation") {
      //   list.push(<JumplistItem>{
      //     category: $me.displayName,
      //     key: "addMember",
      //     type: "action",
      //     icon: "plus",
      //     title: window.o.i18n("dapps.common.quickactions.addMember"),
      //     action: async () => {
      //       window.o.runProcess(
      //         addMember,
      //         {
      //           groupId: $me.circlesAddress,
      //           successAction: (data: any) => {},
      //         },
      //         {}
      //       );
      //     },
      //   });
      //   list.push(<JumplistItem>{
      //     category: $me.displayName,
      //     key: "addOwner",
      //     type: "action",
      //     icon: "plus",
      //     title: window.o.i18n("dapps.common.quickactions.addOwner"),
      //     action: async () => {
      //       window.o.runProcess(
      //         addOwner,
      //         {
      //           groupId: $me.circlesAddress,
      //           successAction: (data: any) => {},
      //         },
      //         {}
      //       );
      //     },
      //   });
      // }

      return list;
    },
  },
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [index, profile, externalChat],
};
