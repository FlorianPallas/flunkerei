<script>
  import { getRandomElement } from "shared";
  import { content } from "../../stores";
  import TextPrompt from "../prompts/TextPrompt.svelte";
  import { i18n } from "../../i18n";

  /** @type {import("socket.io-client").Socket} */
  export let socket;

  /** @type {import('shared/state').AskPhase} */
  export let state;

  $: submission = state.submissions[socket.auth.name];

  let usedQuestionPool = false;

  function onPickForMe() {
    if (!confirm($i18n.ask.pickForMe.confirmation)) {
      return;
    }
    usedQuestionPool = true;
    socket.emit("submit", getRandomElement($content.questions));
  }

  /**
   * @param event {CustomEvent<string>}
   */
  function onSubmit(event) {
    socket.emit("submit", event.detail);
  }
</script>

<main>
  <TextPrompt
    label={$i18n.ask.prompt}
    value={submission}
    on:submit={onSubmit}
  />
</main>
<footer>
  <button disabled={usedQuestionPool} on:click={() => onPickForMe()}>
    {$i18n.ask.pickForMe.label}
  </button>
</footer>
