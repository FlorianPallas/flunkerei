<script>
  import { onMount } from "svelte";
  import SelectPrompt from "../prompts/SelectPrompt.svelte";

  /** @type {import('socket.io-client').Socket} */
  export let socket;

  /** @type {import('shared/fibbage').FibbageVotePhase} */
  export let state;

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      // Pick a random index from 0 to i
      const j = Math.floor(Math.random() * (i + 1));
      // Swap elements array[i] and array[j]
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

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
          (author, _) => author !== socket.auth.name
        ),
        [victim, answer],
      ])
    );
  });
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
      <p>You cannot vote for your own answer</p>
      <ul>
        {#each Object.values(lies) as text}
          <li>{text}</li>
        {/each}
      </ul>
    {:else}
      <SelectPrompt
        text="Pick what you think is the truth"
        {options}
        on:submit={(event) => socket.emit("submit", event.detail)}
      />
    {/if}
  {/if}
</div>
