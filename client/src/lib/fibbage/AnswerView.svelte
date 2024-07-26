<script>
  import Question from "../common/Question.svelte";
  import TextPrompt from "../prompts/TextPrompt.svelte";

  /** @type {import("socket.io-client").Socket} */
  export let socket;

  /** @type {import('shared/state').AnswerPhase} */
  export let state;

  $: question = state.questions[state.mappings[socket.auth.name]];
  $: submission = state.submissions[socket.auth.name];
</script>

<main>
  <div class="card">
    <p><Question text={question} /></p>
  </div>
  <TextPrompt
    label="Beantworte die Frage wahrheitsgemäß"
    value={submission}
    on:submit={(event) => socket.emit("submit", event.detail)}
  />
</main>
