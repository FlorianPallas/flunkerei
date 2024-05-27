<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  /** @type {string} */
  export let value;

  /** @type {import('shared/fibbage').FibbageState} */
  export let state;
</script>

<form
  on:submit={(event) => {
    event.preventDefault();
    dispatch("submit", value === "true" ? "false" : "true");
  }}
>
  <button type="submit">
    {#if value === "true"}
      Nicht Bereit
    {:else}
      Bereit
    {/if}
    ({Object.values(state.submissions).filter((s) => s === "true")
      .length}/{Object.keys(state.players).length})
  </button>
</form>
