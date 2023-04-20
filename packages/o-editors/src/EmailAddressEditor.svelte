<script lang="ts">
import { EditorContext } from "./editorContext";
import ProcessNavigation from "./ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import Error from "../../../shell/src/shared/atoms/Error.svelte";
export let context: EditorContext;

let _context: EditorContext;
$: {
  _context = context;
}

const submitHandler = () => {
  const answer = new Continue();
  answer.data = context.data;
  context.process.sendAnswer(answer);
};

function onkeydown(e: KeyboardEvent) {
  if (e.key == "Enter") {
    submitHandler();
  }
}
</script>

<div>
  <div class="form-control justify-self-center">
    {#if context.messages[context.field]}
      <Error message="{context.messages[context.field]}" />
    {/if}
    <input
      on:keydown="{onkeydown}"
      name="email"
      id="{context.field}"
      type="email"
      placeholder="{context.params.view.placeholder}"
      class="input input-lg input-bordered"
      class:input-error="{context.messages[context.field]}"
      bind:value="{_context.data[context.field]}"
      on:focus
      on:blur
      on:change="{() => (context.editorDirtyFlags[context.field] = true)}" />
  </div>

  <ProcessNavigation on:buttonClick="{submitHandler}" context="{context}" />
</div>
