<script>
  import Player from "../common/Player.svelte";
  import ReadyPrompt from "../prompts/ReadyPrompt.svelte";
  import { appVersion } from "../util";

  /** @type {import('socket.io-client').Socket} */
  export let socket;

  /** @type {import('shared/fibbage').LobbyPhase} */
  export let state;

  $: submission = state.submissions[socket.auth.name];
</script>

<header class="logo">
  <h1>Flunkerei</h1>
  <code>v{appVersion}</code>
</header>
<main>
  <ul class="player-list">
    {#each Object.entries(state.players) as [name, score]}
      <li><Player {name} /></li>
    {/each}
  </ul>
</main>
<footer>
  <ReadyPrompt
    value={submission}
    {state}
    on:submit={(e) => socket.emit("submit", e.detail)}
  />
</footer>

<style>
  .logo {
    display: flex;
    align-items: baseline;

    & code {
      font-size: 0.8em;
      margin-left: 0.5em;
    }
  }

  .player-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 0 auto;
    align-items: center;
  }
</style>
