<script>
  import { onMount } from "svelte";
  import SelectPrompt from "../prompts/SelectPrompt.svelte";
  import Notice from "../common/Notice.svelte";
  import WasAsked from "../common/WasAsked.svelte";
  import { shuffleArray } from "../util";

  /** @type {import('socket.io-client').Socket} */
  export let socket;

  /** @type {import('shared/fibbage').FibbageVotePhase} */
  export let state;

  $: author = Object.keys(state.players)[state.round];
  $: victim = state.mappings[author];
  $: question = state.questions[state.mappings[victim]];
  $: answer = state.answers[victim];
  $: lies = state.lies;

  $: submission = state.submissions[socket.auth.name];

  /**
   * @type {Record<string, string>}
   */
  let options = {};

  onMount(() => {
    options = Object.fromEntries(
      shuffleArray([
        ...Object.entries(lies).filter(
          ([author, _]) => author !== socket.auth.name
        ),
        [victim, answer],
      ])
    );
  });
</script>

<main>
  <div class="card">
    <p><WasAsked {victim} {question} /></p>
  </div>
  {#if victim === socket.auth.name}
    <Notice
      text="Du hast die Wahrheit geschrieben, du darfst nicht mit abstimmen!"
    />
  {/if}
  <div class="answers-list">
    <SelectPrompt
      {options}
      value={submission}
      on:submit={(event) => socket.emit("submit", event.detail)}
      disabled={victim === socket.auth.name}
    />
  </div>
</main>
