import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import Survey from "./o-survey/pages/Survey.svelte";
import ScanInvite from "./o-survey/molecules/ScanInvite.svelte";
import WelcomeSurvey from "./o-survey/components/WelcomeSurvey.svelte";
import Home from "./o-homepage/pages/Home.svelte";

const index: Page<any, DappState> = {
  isSystem: true,
  routeParts: [],
  title: "<span class='text-2xl sm:text-3xl'>CIRCLES</span><span class='text-xl sm:text-2xl'>UBI.ID</span>",
  pageBackgroundClass: "bg-cpurple",
  icon: "forum",
  type: "page",
  component: WelcomeSurvey,
};

const surveySteps: Page<any, DappState> = {
  type: "page",
  isSystem: true,
  anonymous: true,
  navigation: {},
  hideFooter: true,
  title: "<span class='text-2xl sm:text-3xl'>CIRCLES</span><span class='text-xl sm:text-2xl'>UBI.ID</span>",
  pageBackgroundClass: "bg-cpurple",
  routeParts: ["=page", ":id"],
  icon: "forum",
  component: Survey,
};

export const scanInvite: Page<any, DappState> = {
  type: "page",
  pageBackgroundClass: "bg-cpurple",
  isSystem: true,
  position: "modal",
  routeParts: ["=scanInvite"],
  title: "dapps.common.quickactions.scanToTrust",
  component: ScanInvite,
};

export interface DappState {
  // put state here
}

export const survey: DappManifest<DappState> = {
  type: "dapp",
  dappId: "survey:1",
  icon: "forum",
  title: "<span class='text-2xl sm:text-3xl'>CIRCLES</span><span class='text-xl sm:text-2xl'>UBI.ID</span>",
  pageBackgroundClass: "bg-cpurple",
  routeParts: ["survey"],
  defaultRoute: [""],
  tag: Promise.resolve("alpha"),
  hideFooterGradient: true,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [index, surveySteps, scanInvite],
};
