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
  <p>{victim} was asked {question}</p>
  <ul>
    {#each Object.entries(lies) as [lieAuthor, text]}
      <li>
        {text}, votes: {Object.entries(state.votes)
          .filter(([name, choice]) => choice === lieAuthor)
          .map(([name, choice]) => name)
          .join(", ")}
        , by: {lieAuthor}
      </li>
    {/each}
    <li>
      {answer} was the truth - votes: {Object.entries(state.votes)
        .filter(([name, choice]) => choice === victim)
        .map(([name, choice]) => name)
        .join(", ")}
    </li>
  </ul>
  <p>
    {Object.values(state.submissions).filter((s) => s === "true").length} / {Object.keys(
      state.players
    ).length}
  </p>
  <ReadyPrompt
    label="Ready to continue?"
    value={submission}
    on:submit={(event) => socket.emit("submit", event.detail)}
  />
</div>
