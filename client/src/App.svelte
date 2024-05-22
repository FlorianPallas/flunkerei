<script>
  import { io } from "socket.io-client";
  import { onDestroy } from "svelte";
  import FibbageView from "./lib/fibbage/GameView.svelte";

  /** @type {import('shared/fibbage').FibbageState | undefined} */
  let state = undefined;
  let socket = io("http://192.168.92.173:3000/", { autoConnect: false });

  onDestroy(() => {
    socket.off("connect_error");
    socket.close();
  });

  socket.on("connect_error", (err) => {
    console.log("Connection error", err);
  });

  socket.on("state", (newState) => {
    console.log("New state:", newState);
    state = newState;
  });

  /** @param {string} name */
  const join = (name) => {
    if (socket.connected) {
      return;
    }
    console.log("Joining as", name);
    socket.auth = { type: "player", name };
    socket.connect();
  };

  /** @type {string} */
  let name = "";

  /**
   * A notice to display to the user.
   * @type {string | undefined}
   */
  let notice;
</script>

<main>
  {#if socket.connected}
    {#if state}
      <FibbageView {socket} {state} />
    {:else}
      <p>Syncing...</p>
    {/if}
  {:else}
    {#if notice}
      <p>{notice}</p>
    {/if}
    <p>Please enter you name:</p>
    <input type="text" bind:value={name} />
    <button on:click={() => join(name)}> Join </button>
  {/if}
</main>
