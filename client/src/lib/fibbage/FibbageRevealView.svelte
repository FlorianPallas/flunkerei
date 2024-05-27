<script>
  import ReadyPrompt from "../prompts/ReadyPrompt.svelte";
  import Player from "../common/Player.svelte";
  import Question from "../common/Question.svelte";
  import { onMount } from "svelte";
  import { flip } from "svelte/animate";
  import WasAsked from "../common/WasAsked.svelte";
  import { fade, fly, scale } from "svelte/transition";

  /** @type {import('socket.io-client').Socket} */
  export let socket;

  /** @type {import('shared/fibbage').FibbageRevealPhase} */
  export let state;

  /**
   * Gets the list of player names who voted for the lie of the given author.
   *
   * @param lieAuthor {string} the name of the author of the lie to get votes for
   * @returns {string[]} the list of player names who voted for the lie
   */
  function getVotes(lieAuthor) {
    return Object.entries(state.votes)
      .filter(([, choice]) => choice === lieAuthor)
      .map(([name]) => name);
  }

  $: author = Object.keys(state.players)[state.round];
  $: victim = state.mappings[author];
  $: question = state.questions[state.mappings[victim]];

  /**
   * A curated list of answer that includes lies and the truth
   * It is sorted by the number of votes each lie has
   */
  $: answers = [
    ...Object.entries(state.lies)
      .map(([author, text]) => ({
        author,
        text,
        votes: getVotes(author),
      }))
      .filter((answer) => answer.votes.length > 0 || answer.author === victim)
      .sort((a, b) => a.votes.length - b.votes.length), // sort ascending by number of votes
    { author: victim, text: state.answers[victim], votes: getVotes(victim) },
  ];

  let answersIndex = 0;
  $: displayedAnswers = answers.filter((_, i) => i < answersIndex).reverse();

  let showVotes = false;
  let showType = false;

  onMount(() => {
    const handle = setInterval(() => {
      if (answersIndex >= answers.length) {
        clearInterval(handle);
        return;
      }
      answersIndex++;
      showVotes = false;
      showType = false;

      setTimeout(() => {
        showVotes = true;
        setTimeout(() => {
          showType = true;
        }, 500);
      }, 500);
    }, 3000);
    return () => clearInterval(handle);
  });

  $: submission = state.submissions[socket.auth.name];
</script>

<main>
  <div class="card">
    <p><WasAsked {victim} {question} /></p>
  </div>
  <div class="answers-list">
    {#each displayedAnswers as a, i (a.author)}
      <li
        transition:fade={{ duration: 250 }}
        animate:flip={{ duration: 250 }}
        class="card lie-card"
      >
        <p class="lie-card__text">{a.text}</p>
        <ul class="lie-card__votes" class:hidden={!showVotes && i === 0}>
          {#each a.votes as vote}
            <li>{vote}</li>
          {/each}
        </ul>
        <p class="lie-card__author" class:hidden={!showType && i === 0}>
          {#if a.author === victim}
            Die Wahrheit
          {:else}
            Lüge von <Player name={a.author} />
          {/if}
        </p>
      </li>
    {/each}
  </div>
  <ReadyPrompt
    value={submission}
    {state}
    on:submit={(event) => socket.emit("submit", event.detail)}
  />
</main>
