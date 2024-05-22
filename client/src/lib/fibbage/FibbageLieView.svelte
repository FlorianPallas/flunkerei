<script>
  import TextPrompt from "../prompts/TextPrompt.svelte";

  /** @type {import('socket.io-client').Socket} */
  export let socket;

  /** @type {import('shared/fibbage').FibbageLiePhase} */
  export let state;

  $: author = Object.keys(state.players)[state.round];
  $: victim = state.mappings[author];
  $: question = state.questions[state.mappings[victim]];

  $: submission = state.submissions[socket.auth.name];
</script>

<div>
  <p>
    {Object.keys(state.submissions).length} / {Object.keys(state.players)
      .length - 1}
  </p>
  {#if submission}
    <p>Waiting for others...</p>
  {:else}
    <p>{victim} was asked {question}</p>
    {#if victim === socket.auth.name}
      <p>You cannot lie for your own answer</p>
    {:else}
      <TextPrompt
        label="Think of a fitting lie"
        on:submit={(event) => socket.emit("submit", event.detail)}
      />
    {/if}
  {/if}
</div>
