<script>
  import Player from "./Player.svelte";
  import Question from "./Question.svelte";

  export let victim;
  export let question;
</script>

<Player name={victim} /> wurde gefragt:<br />„<Question text={question} />“
