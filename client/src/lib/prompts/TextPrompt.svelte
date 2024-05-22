<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  /** @type {string} */
  export let label;
</script>

<form
  on:submit={(event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    dispatch("submit", data.get("answer"));
  }}
>
  <label for="answer">{label}</label>
  <input type="text" name="answer" minlength="1" required />
  <button type="submit">Submit</button>
</form>
