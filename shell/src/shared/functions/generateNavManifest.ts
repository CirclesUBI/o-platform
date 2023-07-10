import LinkComponent from "../molecules/NextNav/Components/Link.svelte";
import ListComponent from "../molecules/NextNav/Components/List.svelte";
import ActionButtonComponent from "../molecules/NextNav/Components/ActionButton.svelte";
import { NavigationElement, NavigationManifest } from "@o-platform/o-interfaces/dist/navigationManifest";
import { Prompt } from "@o-platform/o-process/dist/events/prompt";
import { media } from "../stores/media";

export type GenerateNavManifestArgs = {
  leftSlotOverride?: NavigationElement;
  leftIsOpen: boolean;
  centerIsOpen: boolean;
  centerContainsProcess: boolean;
  rightSlotOverride?: NavigationElement;
  rightIsOpen: boolean;
  notificationCount?: number;
  canGoBack?: boolean;
  canSkip?: boolean;
  showLogin?: boolean;
  hideFooterGradient?: boolean;
};
let params = {
  leftStatic: <any>null,
  leftSlotOverride: <NavigationElement>null,
  rightStatic: <any>null,
  rightSlotOverride: <NavigationElement>null,
};
function applyOverrides(params) {
  const left = params.leftStatic;
  if (params.leftSlotOverride && params.leftSlotOverride.props) {
    left.props = {
      ...left.props,
      ...params.leftSlotOverride.props,
    };
  }

  const right = params.rightStatic;
  if (params.rightSlotOverride && params.rightSlotOverride.props) {
    right.props = {
      ...right.props,
      ...params.rightSlotOverride.props,
    };
  }
  return {
    left: left,
    right: right,
  };
}

const homeNavManifest = (leftSlotOverride?: NavigationElement, rightSlotOverride?: NavigationElement) => {
  const left = applyOverrides({
    leftStatic: {
      component: LinkComponent,

      props: {
        icon: "menu",
        action: () =>
          window.o.publishEvent({
            type: "shell.openNavigation",
          }),
      },
    },

    leftSlotOverride: leftSlotOverride,
  });

  const right = applyOverrides({
    rightStatic: {
      component: LinkComponent,

      props: {
        icon: "menu",
        action: () =>
          window.o.publishEvent({
            type: "shell.openNavigation",
          }),
      },
    },

    rightSlotOverride: rightSlotOverride,
  });

  return {
    leftSlot: left.left,
    rightSlot: right.right,
    loginPill: {
      component: ActionButtonComponent,
      props: {
        icon: "logo",
        action: () =>
          window.o.publishEvent({
            type: "shell.openModal",
          }),
      },
    },
  };
};

const defaultNavManifest: (leftSlotOverride?: NavigationElement, rightSlotOverride?: NavigationElement) => NavigationManifest = (
  leftSlotOverride?: NavigationElement,
  rightSlotOverride?: NavigationElement
) => {
  const left = applyOverrides({
    leftStatic: {
      component: LinkComponent,
      props: {
        icon: "menu",
        action: () =>
          window.o.publishEvent({
            type: "shell.openNavigation",
          }),
      },
    },

    leftSlotOverride: leftSlotOverride,
  });

  return {
    leftSlot: left.left,
    rightSlot: null,
    navPill: {
      left: {
        component: ListComponent,
        props: {
          icon: "bell",
          action: () =>
            window.o.publishEvent({
              type: "shell.contacts",
            }),
        },
      },
      center: {
        component: ActionButtonComponent,
        props: {
          icon: "actionbutton",
          action: () =>
            window.o.publishEvent({
              type: "shell.openModal",
            }),
        },
      },
      right: {
        component: LinkComponent,
        props: {
          icon: "home",
          action: () =>
            window.o.publishEvent({
              type: "shell.home",
            }),
        },
      },
    },
  };
};

function generateCloseButton(centerContainsProcess: boolean): NavigationElement {
  if (centerContainsProcess) {
    return {
      component: ActionButtonComponent,
      props: {
        icon: "close",
        action: () =>
          window.o.publishEvent({
            type: "process.cancelRequest",
          }),
      },
    };
  } else {
    return {
      component: ActionButtonComponent,
      props: {
        icon: "close",
        action: () =>
          window.o.publishEvent({
            type: "shell.root",
          }),
      },
    };
  }
}

export function generateNavManifest(args: GenerateNavManifestArgs, prompt: Prompt<any>) {
  let newManifest: NavigationManifest;
  let small: string | boolean = false;
  const unsub = media.subscribe(($media) => {
    small = $media.small;
  });
  unsub();

  if (args.showLogin) {
    newManifest = homeNavManifest(args.leftSlotOverride, args.rightSlotOverride);
  } else {
    newManifest = defaultNavManifest(args.leftSlotOverride, args.rightSlotOverride);
  }
  if (args.leftIsOpen || args.rightIsOpen) {
    if (small) {
      // Remove the center only if mobile.
      delete newManifest.navPill;
    }

    if (args.leftIsOpen) {
      // Remove right too
      // delete newManifest.rightSlot;
      newManifest.leftSlot.props.icon = "x";
      newManifest.leftSlot.props.action = () => window.o.publishEvent({ type: "shell.closeNavigation" });
      // if (small) {
      //   // Remove the left button on mobile, as we have a special button for closing.
      //   delete newManifest.leftSlot;
      // }
    } else if (args.rightIsOpen) {
      // Remove left too
      delete newManifest.leftSlot;
      newManifest.rightSlot.props.icon = "simplearrowright";
      newManifest.leftSlot.props.action = () => window.o.publishEvent({ type: "shell.closeFilters" });
    }
  }

  if (args.centerIsOpen) {
    // Remove left and right
    delete newManifest.leftSlot;
    delete newManifest.rightSlot;

    if (args.centerContainsProcess) {
      // Replace the regular center buttons with
      // the process navigation buttons
      if (args.showLogin) {
        newManifest.loginPill = generateCloseButton(true);
      } else {
        newManifest.navPill.center = generateCloseButton(true);
        newManifest.navPill.left = null;
        newManifest.navPill.right = null;
      }
    } else {
      if (args.showLogin) {
        newManifest.loginPill = generateCloseButton(false);
      } else {
        newManifest.navPill.center = generateCloseButton(false);
        newManifest.navPill.left = null;
        newManifest.navPill.right = null;
      }
    }

    if (newManifest.navPill && args.canGoBack) {
      newManifest.navPill.left = {
        component: ListComponent,
        props: {
          text: window.o.i18n("shared.functions.generateNavManifest.back"),
          action: () =>
            window.o.publishEvent({
              type: args.centerContainsProcess ? "process.back" : "shell.back",
            }),
        },
      };
    }
    if (newManifest.navPill && args.canSkip) {
      newManifest.navPill.right = {
        component: ListComponent,
        props: {
          text: window.o.i18n("shared.functions.generateNavManifest.skip"),
          action: () =>
            window.o.publishEvent({
              type: args.centerContainsProcess ? "process.skip" : "shell.forward",
            }),
        },
      };
    }
  }

  newManifest.hideFooterGradient = args.hideFooterGradient;

  return newManifest;
}
