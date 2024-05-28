<script>
  import TextPrompt from "../prompts/TextPrompt.svelte";
  import Notice from "../common/Notice.svelte";
  import WasAsked from "../common/WasAsked.svelte";

  /** @type {import("socket.io-client").Socket} */
  export let socket;

  /** @type {import('../state').FibbageLiePhase} */
  export let state;

  $: author = Object.keys(state.players)[state.round];
  $: victim = state.mappings[author];
  $: question = state.questions[state.mappings[victim]];

  $: submission = state.submissions[socket.auth.name];
</script>

<main>
  <div class="card">
    <p><WasAsked {victim} {question} /></p>
  </div>
  {#if victim !== socket.auth.name}
    <TextPrompt
      label="Denke dir eine Lüge aus die glaubwürdig klingt"
      value={submission}
      on:submit={(event) => socket.emit("submit", event.detail)}
    />
  {:else}
    <Notice
      text="Du bist das Opfer dieser Runde, du musst dir keine Lüge ausdenken!"
    />
  {/if}
</main>
