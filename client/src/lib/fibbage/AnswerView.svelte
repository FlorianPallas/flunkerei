<script>
  import TextPrompt from "../prompts/TextPrompt.svelte";

  /** @type {import('socket.io-client').Socket} */
  export let socket;

  /** @type {import('shared/fibbage').AnswerPhase} */
  export let state;

  $: question = state.questions[state.mappings[socket.auth.name]];
  $: submission = state.submissions[socket.auth.name];
</script>

<div>
  <p>
    {Object.keys(state.submissions).length} / {Object.keys(state.players)
      .length}
  </p>
  {#if submission}
    <p>Waiting for others...</p>
  {:else}
    <p>{question}</p>
    <TextPrompt
      label="Answer the question honestly"
      on:submit={(event) => socket.emit("submit", event.detail)}
    />
  {/if}
</div>
