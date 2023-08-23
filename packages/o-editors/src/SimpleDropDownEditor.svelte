<script lang="ts">
import { onMount } from "svelte";

// import Select from "svelte-select";
import Select from "../../../shell/src/shared/molecules/Select/Select.svelte";

import { EditorContext } from "./editorContext";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { DropdownSelectorContext } from "./DropdownSelectEditorContext";
import ProcessNavigation from "./ProcessNavigation.svelte";
import { Observable } from "rxjs";
import { normalizePromptField, PromptField } from "@o-platform/o-process/dist/states/prompt";
import { Profile, SafeInfo } from "@o-platform/shell/src/shared/api/data/types";
import UserImage from "@o-platform/shell/src/shared/atoms/UserImage.svelte";
import BeerItem from "./BeerItem.svelte";
// let selected;
let items;
let choices;
let filteredItems = [];
const itemId = "displayName";
export let context: DropdownSelectorContext<any, any, any>;
// import loadOptions from "./beers.js";

// function getBeers(filterText) {
//   if (!filterText.length) return Promise.resolve([]);

//   filterText = filterText ? filterText.replace(" ", "_") : "";

//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.open("GET", `https://api.punkapi.com/v2/beers?beer_name=${filterText}`);
//     xhr.send();

//     xhr.onload = () => {
//       if (xhr.status >= 200 && xhr.status < 300) {
//         resolve(
//           JSON.parse(xhr.response).sort((a, b) => {
//             if (a.name > b.name) return 1;
//             if (a.name < b.name) return -1;
//           })
//         );
//       } else {
//         reject();
//       }
//     };
//   });
// }

let field: PromptField<any>;

// onMount(async () => {
//   field = normalizePromptField(context.field);
//   const currentKey = field.get(context);
//   if (currentKey) {
//     selected = await context.params.choices.byKey(currentKey, context);
//   } else {
//     selected = undefined;
//   }
//   console.log("CONTEXT: ", context);
// });

$: {
  context = context;
}

function submitHandler() {
  // const event = new Continue();
  // event.data = {};
  // event.data[(<any>field).name] = selected;
  // context.data[(<any>field).name] = selected;
  // context.process.sendAnswer(event);
}

let floatingConfig = {
  placement: "top",
  // Try removing this line below. The tooltip will
  // overflow the viewport's edge!
};
let target;
// async function examplePromise(filterText) {
//   // Put your async code here...
//   // For example call an API using filterText as your search params
//   // When your API responds resolve your Promise
//   let res = await (<Promise<any[]>>context.params.choices.find(filterText, context));
//   console.log("RES: ", res);
//   return res;
// }
async function loadOptions(filterText: any): Promise<any[]> {
  const evaluatedLoadOptions = await (<Promise<any[]>>context.params.choices.find(filterText, context));

  // let promi = new Promise((resolve) => {
  //   const observable: Observable<Profile[]> = <Observable<Profile[]>>evaluatedLoadOptions;
  //   observable.subscribe((next) => {
  //     if (!next) {
  //       console.log("KAPUTT");
  //       resolve(null);
  //     } else {
  //       console.log("DATA: ", next);
  //       // TODO: THIS IS SOMEHOW NOT RETURNING THE RIGHT DATA FORMAT I THINK
  //       resolve([...next]);
  //     }
  //   });
  // });
  console.log("PROMI", evaluatedLoadOptions);
  return evaluatedLoadOptions;
}
</script>

<div class="flex flex-row" style="height: 60vh">
  <div class="self-end w-full">
    <Select loadOptions="{loadOptions}" itemId="{itemId}" floatingConfig="{floatingConfig}" listPlacement="top">
      <div class="beer" slot="item" let:item let:index>
        <BeerItem item="{item}" />
      </div>

      <div class="beer" slot="selection" let:selection>
        <BeerItem item="{selection}" />
      </div>
    </Select>

    <ProcessNavigation on:buttonClick="{submitHandler}" context="{context}" noSticky="{true}" />
  </div>
</div>

<style>
:global(.sv-dropdown) {
  position: static !important;
  bottom: 100%;
  order: 1;

  max-height: fit-content !important;
}
:global(.sv-control) {
  order: 2;
  width: 100%;

  bottom: 1rem;
  background: white;
}
:global(.svelecte) {
  flex: 1 1 auto;
  display: flex;
  flex-flow: column;
  margin-bottom: 1.5rem;
  position: static !important;
}
:global(.sv-content > div) {
  flex-grow: 1;
}
</style>
