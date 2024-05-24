<script>
  import ReadyPrompt from "../prompts/ReadyPrompt.svelte";

  /** @type {import('socket.io-client').Socket} */
  export let socket;

  /** @type {import('shared/fibbage').LobbyPhase} */
  export let state;

  $: submission = state.submissions[socket.auth.name];
</script>

<div>
  <ul>
    {#each Object.entries(state.players) as [name, score]}
      <li>{name}</li>
    {/each}
  </ul>
  <p>
    {Object.values(state.submissions).filter((s) => s === "true").length} / {Object.keys(
      state.players
    ).length}
  </p>
  <ReadyPrompt
    label="Are you ready to start?"
    value={submission}
    on:submit={(e) => socket.emit("submit", e.detail)}
  />
</div>
