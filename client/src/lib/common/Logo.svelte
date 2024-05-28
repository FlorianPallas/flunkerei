<script>
  import { appVersion } from "../util";
</script>

<div class="logo">
  <h1>Flunkerei</h1>
  <code>v{appVersion}</code>
</div>

<style>
  .logo {
    display: flex;
    align-items: baseline;

    & code {
      font-size: 0.8em;
      margin-left: 0.5em;
    }
  }
</style>
