import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { JumplistItem } from "@o-platform/o-interfaces/dist/routables/jumplist";

export default async function getJumplistItems(manifestsWithJumplist, runtimeDapp) {
  if (!manifestsWithJumplist) return;
  if (!runtimeDapp) return;

  let categories: {
    manifest: DappManifest<any>;
    items: {
      ["action"]: JumplistItem[];
      ["profile"]: JumplistItem[];
    };
  }[] = [];

  categories = await Promise.all(
    manifestsWithJumplist.map(async (o) => {
      if (!o.jumplist) {
        return;
      }
      const jumplistItems = await o.jumplist.items({}, runtimeDapp);
      return <
        {
          manifest: DappManifest<any>;
          items: {
            ["action"]: JumplistItem[];
            ["profile"]: JumplistItem[];
          };
        }
      >{
        manifest: o,
        items: jumplistItems.groupBy((c) => c.type ?? "action"),
      };
    })
  );

  if (!categories.includes(undefined)) {
    const actions = categories
      .filter((o) => (o.items ? o.items["action"] : null))
      .flatMap((o) => (o.items ? o.items["action"] : null))
      .sort(compareOrder);

    const profiles = categories.filter((o) => (o.items ? o.items["profile"] : null)).flatMap((o) => (o.items ? o.items["profile"] : null));

    return { actions: actions, profiles: profiles };
  } else {
    return null;
  }
}

function compareOrder(a, b) {
  if (a.order < b.order) {
    return -1;
  }
  if (a.order > b.order) {
    return 1;
  }
  return 0;
}
