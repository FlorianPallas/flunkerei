<script>
  import Icon from "svelte-fa";
  import {
    faPaperPlane,
    faSpinner,
    faCheck,
    faInfo,
  } from "@fortawesome/free-solid-svg-icons";
  import { createEventDispatcher } from "svelte";
  import { onEnter } from "../util";
  const dispatch = createEventDispatcher();

  /** @type {string} */
  export let label = "Gib eine Antwort ein";

  /** @type {string} */
  export let value = "";
  $: tempValue = value;

  let isLoading = false;
  $: isValid = tempValue.trim().length >= 1 && tempValue.trim().length <= 60;
  $: hasChanged = tempValue !== value;

  function submit() {
    if (!isValid || !hasChanged) {
      return;
    }
    value = tempValue.trim();

    dispatch("submit", value);

    isLoading = true;
    setTimeout(() => {
      isLoading = false;
    }, 200);
  }
</script>

<div class="text-prompt">
  <p class="text-prompt__label">{label}</p>
  <div class="text-prompt__body">
    <input
      type="text"
      name="answer"
      required
      bind:value={tempValue}
      on:keydown={onEnter(() => submit())}
    />
    {#if isLoading}
      <button type="button"><Icon icon={faSpinner} spin /></button>
    {:else if isValid && hasChanged}
      <button type="button" on:click={() => submit()}
        ><Icon icon={faPaperPlane} /></button
      >
    {:else if !isValid}
      <button type="button"><Icon icon={faInfo} /></button>
    {:else}
      <button type="button"><Icon icon={faCheck} /></button>
    {/if}
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
