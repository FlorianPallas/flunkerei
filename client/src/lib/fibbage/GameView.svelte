<script>
  import AnswerView from "./AnswerView.svelte";
  import AskView from "./AskView.svelte";
  import FibbageLieView from "./FibbageLieView.svelte";
  import FibbageVoteView from "./FibbageVoteView.svelte";
  import FibbageRevealView from "./FibbageRevealView.svelte";
  import LobbyView from "./LobbyView.svelte";

  /** @type {import('socket.io-client').Socket} */
  export let socket;

  /** @type {import('shared/fibbage').FibbageState} */
  export let state;
</script>

{#if state.type === "lobby"}
  <LobbyView {socket} {state} />
{:else if state.type === "ask"}
  <AskView {socket} {state} />
{:else if state.type === "answer"}
  <AnswerView {socket} {state} />
{:else if state.type === "fibbage.lie"}
  <FibbageLieView {socket} {state} />
{:else if state.type === "fibbage.vote"}
  <FibbageVoteView {socket} {state} />
{:else if state.type === "fibbage.reveal"}
  <FibbageRevealView {socket} {state} />
{:else}
  <p>Unknown state type</p>
{/if}
