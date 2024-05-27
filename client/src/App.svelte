<script>
  import { io } from "socket.io-client";
  import { onDestroy } from "svelte";
  import GameView from "./lib/fibbage/GameView.svelte";
  import TextPrompt from "./lib/prompts/TextPrompt.svelte";

  /** @type {import('shared/fibbage').FibbageState | undefined} */
  let state = undefined;
  let socket = io(import.meta.env.VITE_API_BASE_URL, { autoConnect: false });

  onDestroy(() => {
    socket.disconnect();
  });

  socket.on("state", (newState) => {
    state = newState;
  });

  /**
   * @param name {string}
   */
  const join = (name) => {
    if (socket.connected) {
      return;
    }
    socket.auth = { type: "player", name };
    socket.connect();
  };
</script>

{#if socket.connected}
  {#if state}
    <GameView {socket} {state} />
  {:else}
    <p>Syncing...</p>
  {/if}
{:else}
  <main>
    <TextPrompt
      label="Bitte gib deinen Namen ein"
      on:submit={(event) => join(event.detail)}
    />
  </main>
{/if}
