<script>
  import { faCrown } from "@fortawesome/free-solid-svg-icons";
  import Icon from "svelte-fa";
  import QrCode from "../QrCode.svelte";
  import Logo from "../common/Logo.svelte";
  import Player from "../common/Player.svelte";
  import ReadyPrompt from "../prompts/ReadyPrompt.svelte";
  import { createEventDispatcher } from "svelte";
  import { i18n } from "../../i18n";
  const dispatch = createEventDispatcher();

  /** @type {import("socket.io-client").Socket} */
  export let socket;

  /** @type {import('shared/state').LobbyPhase} */
  export let state;

  function onLeave() {
    if (!confirm($i18n.lobby.leaveRoom.confirmation)) {
      return;
    }
    dispatch("leave");
  }

  $: submission = state.submissions[socket.auth.name];
</script>

<header>
  <Logo />
</header>
<main>
  <QrCode code={state.code} />
  <ul class="player-list">
    {#each Object.keys(state.players) as player}
      <li>
        {#if state.host === player}
          <Icon icon={faCrown} />
        {/if}
        <Player name={player} />
      </li>
    {/each}
  </ul>
</main>
<footer>
  <div class="actions">
    <ReadyPrompt
      value={submission}
      {state}
      on:submit={(e) => socket.emit("submit", e.detail)}
    />
    <button on:click={() => onLeave()}>
      {$i18n.lobby.leaveRoom.label}
    </button>
  </div>
</footer>

<style>
  .player-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 0 auto;
    align-items: center;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 1em;
    align-items: center;
  }
</style>
