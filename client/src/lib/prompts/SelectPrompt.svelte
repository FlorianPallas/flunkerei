<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  /** @type {Record<string, string>} */
  export let options;

  /** @type {string} */
  export let value;

  /** @type {boolean} */
  export let disabled = false;

  /**
   * Handles the selection of an option.
   *
   * @param key {string} the key of the selected option
   */
  function onSelect(key) {
    if (disabled) {
      return;
    }
    dispatch("submit", key);
  }
</script>

<div class="select-prompt">
  {#each Object.entries(options) as [key, text]}
    <button
      type="button"
      on:click={() => onSelect(key)}
      class:active={value === key}
      {disabled}
    >
      {text}
    </button>
  {/each}
</div>

<style>
  .select-prompt {
    display: flex;
    flex-direction: column;
    gap: 0.5em;

    & button {
      text-transform: uppercase;
    }
  }
</style>
