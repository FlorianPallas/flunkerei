<script>
  import { getRandomQuestion } from "../../questions";
  import TextPrompt from "../prompts/TextPrompt.svelte";

  /** @type {import('socket.io-client').Socket} */
  export let socket;

  /** @type {import('shared/fibbage').AskPhase} */
  export let state;

  $: question = state.submissions[socket.auth.name];
</script>

<div>
  <p>
    {Object.keys(state.submissions).length} / {Object.keys(state.players)
      .length}
  </p>
  {#if question}
    <p>Waiting for others...</p>
  {:else}
    <TextPrompt
      label="Think of a question"
      on:submit={(event) => socket.emit("submit", event.detail)}
    />
    <button on:click={() => socket.emit("submit", getRandomQuestion())}>
      Pick for me
    </button>
  {/if}
</div>
