<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  /** @type {string} */
  export let text;
  /** @type {Record<string, string>} */
  export let options;
</script>

<form
  on:submit={(event) => {
    event.preventDefault();
  }}
>
  <div class="vote-box">
    <p>{text}</p>
    {#each Object.entries(options) as [value, label]}
      <button type="button" on:click={() => dispatch("submit", value)}>
        {label}</button
      >
    {/each}
  </div>
</form>
