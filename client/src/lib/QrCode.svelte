<script>
  import { qrcode } from "@libs/qrcode";

  /** @type {string} */
  export let code;

  $: url = window.APP_BASE_URL + "/?code=" + code;

  function speakRoomCode() {
    if (speechSynthesis.speaking) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      `Der Raumcode lautet: ${Array.from(code).join(", ")}`
    );
    utterance.lang = "de-DE";
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  }
</script>

<div class="card qr-code">
  <button on:click={() => speakRoomCode()}>
    {@html qrcode(url, {
      output: "svg",
      dark: "#000",
      light: "#fff",
      border: 0,
    })}
  </button>
  <code>{url}</code>
</div>

<style>
  .qr-code {
    background-color: #fff;
    display: flex;
    flex-flow: column;
    align-items: center;

    & svg {
      margin: 1em;
    }

    & code {
      font-size: 0.8em;
      color: #000;
    }

    & > button {
      background: none;
      margin: 0;
      padding: 0;
      width: 100%;
    }
  }
</style>
