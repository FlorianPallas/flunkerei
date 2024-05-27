<script>
  import Icon from "svelte-fa";
  import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

  /** @type {string} */
  export let text;
</script>

<div class="card card--notice">
  <Icon icon={faInfoCircle} />
  <p>{text}</p>
</div>
