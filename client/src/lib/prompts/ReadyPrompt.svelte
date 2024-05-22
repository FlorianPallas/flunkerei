<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  /** @type {string} */
  export let value;

  /** @type {string} */
  export let label;
</script>

<form
  on:submit={(event) => {
    event.preventDefault();
    dispatch("submit", value === "true" ? "false" : "true");
  }}
>
  <label for="answer">{label}</label>
  <button type="submit">
    {#if value === "true"}
      Not Ready
    {:else}
      Ready
    {/if}
  </button>
</form>
