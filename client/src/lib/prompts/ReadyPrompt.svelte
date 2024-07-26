<script>
  import { createEventDispatcher } from "svelte";
  import { i18n } from "../../i18n";
  const dispatch = createEventDispatcher();

  /** @type {string} */
  export let value;

  /** @type {import('shared/state').FibbageState} */
  export let state;
</script>

<form
  on:submit={(event) => {
    event.preventDefault();
    dispatch("submit", value === "ready" ? "not-ready" : "ready");
  }}
>
  <button type="submit">
    {#if value === "ready"}
      {$i18n.ready.yes}
    {:else}
      {$i18n.ready.no}
    {/if}
    ({Object.values(state.submissions).filter((value) => value === "ready")
      .length}/{Object.keys(state.players).length})
  </button>
</form>
