<script>
  import ReadyPrompt from "../prompts/ReadyPrompt.svelte";

  /** @type {import('socket.io-client').Socket} */
  export let socket;

  /** @type {import('shared/fibbage').FibbageRevealPhase} */
  export let state;

  $: author = Object.keys(state.players)[state.round];
  $: victim = state.mappings[author];
  $: question = state.questions[state.mappings[victim]];
  $: answer = state.answers[victim];
  $: lies = state.lies;

  $: submission = state.submissions[socket.auth.name];
</script>

<div>
  <p>{victim} was asked {question} by {author}</p>
  <ul>
    {#each Object.entries(lies) as [lieAuthor, text]}
      <li>
        {text} - votes: {Object.values(state.votes)
          .filter((a) => a === lieAuthor)
          .join(", ")}
      </li>
    {/each}
    <li>
      {answer} was the truth - votes: ({Object.values(state.votes[victim]).join(
        ", "
      )})
    </li>
  </ul>
  <p>
    {Object.keys(state.submissions).length} / {Object.keys(state.players)
      .length}
  </p>
  <ReadyPrompt
    label="Ready to continue?"
    value={submission}
    on:submit={(event) => socket.emit("submit", event.detail)}
  />
</div>
