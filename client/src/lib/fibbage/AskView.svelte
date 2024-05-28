<script>
  import { getRandomElement } from "shared";
  import { content } from "../../stores";
  import TextPrompt from "../prompts/TextPrompt.svelte";

  /** @type {import("socket.io-client").Socket} */
  export let socket;

  /** @type {import('shared/state').AskPhase} */
  export let state;

  $: submission = state.submissions[socket.auth.name];

  let usedQuestionPool = false;

  function onPickForMe() {
    if (
      !confirm(
        "Möchtest du wirklich eine vorgeschriebene Frage benutzen, anstatt eine eigene zu schreiben? Das ist ein bisschen langweilig, findest du nicht?"
      )
    ) {
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
    label="Denke dir eine Frage für die anderen Spieler aus"
    value={submission}
    on:submit={onSubmit}
  />
</main>
<footer>
  <button disabled={usedQuestionPool} on:click={() => onPickForMe()}
    >Mir fällt nichts ein</button
  >
</footer>
