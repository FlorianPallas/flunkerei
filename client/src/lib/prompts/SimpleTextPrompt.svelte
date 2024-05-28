<script>
  import { createEventDispatcher } from "svelte";
  import { onEnter } from "../util";
  const dispatch = createEventDispatcher();

  /** @type {string} */
  export let label = "Gib eine Antwort ein";

  /** @type {string} */
  export let value = "";
</script>

<div class="text-prompt">
  <p class="text-prompt__label">{label}</p>
  <div class="text-prompt__body">
    <input
      type="text"
      name="answer"
      required
      bind:value
      on:keydown={onEnter(() => dispatch("submit"))}
    />
  </div>
</div>

<style>
  .text-prompt {
    width: 100%;
  }

  .text-prompt__label {
    width: 100%;
    text-align: center;
    font-size: 0.8em;
    margin-bottom: 0.5em;
  }

  .text-prompt__body {
    position: relative;
    background-color: #fff;
    border: 1px solid transparent;
    border-radius: 0.25em;

    & input {
      width: 100%;
      background: none;
      padding-right: 2.5em;
    }

    & button {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      background: none;
      color: #000;
      padding: 0.5em;
      padding-right: 1em;
    }
  }
</style>
