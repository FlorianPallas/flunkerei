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
    const data = new FormData(event.currentTarget);
    dispatch("submit", data.get("answer"));
  }}
>
  <fieldset>
    <legend>{text}</legend>
    <div>
      {#each Object.entries(options) as [value, label]}
        <input type="radio" id={value} name="answer" {value} />
        <label for={value}>{label}</label>
      {/each}
    </div>
    <div>
      <button type="submit">Submit</button>
    </div>
  </fieldset>
</form>
