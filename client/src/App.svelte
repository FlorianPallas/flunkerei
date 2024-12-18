<script>
  import GameView from "./lib/fibbage/GameView.svelte";
  import { onMount } from "svelte";
  import SimpleTextPrompt from "./lib/prompts/SimpleTextPrompt.svelte";
  import Logo from "./lib/common/Logo.svelte";
  import { io } from "socket.io-client";
  import { generateQuestionMappings } from "./lib/util";
  import { i18n } from "./i18n";

  onMount(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      console.log("Found code in search", code);
      codeValue = code;
    }
    window.history.replaceState({}, "", window.location.pathname);

    const session = {
      name: window.sessionStorage.getItem("name") ?? undefined,
      code: window.sessionStorage.getItem("code") ?? undefined,
    };

    if (session.code && session.name) {
      console.log("found old session in storage, rejoining");
      nameValue = session.name;
      codeValue = session.code;
      join(session.name, session.code);
    }
  });

  /**
   * @typedef {import('socket.io-client').Socket<import("shared/socket").OutgoingEvents, import("shared/socket").IncomingEvents>} Socket
   */

  /** @type {Socket} */
  const socket = io(window.APP_API_BASE_URL, { autoConnect: false });

  /** @type {import('shared/state').FibbageState | undefined} */
  let clientState;

  /** @type {import('shared/state').FibbageState | undefined} */
  let serverState;

  /**
   * @param name {string}
   * @param code {string | undefined}
   */
  function join(name, code = undefined) {
    if (socket.connected) {
      return;
    }

    socket.auth = { name, code };
    socket.connect();

    function sync() {
      socket.emit("state", serverState);
    }

    socket.on("state", (value) => {
      window.sessionStorage.setItem("name", name);
      window.sessionStorage.setItem("code", value.code);
      clientState = value;
    });

    socket.on("hello", (code) => {
      console.log("received hello");
      serverState = {
        type: "lobby",
        code,
        host: name,
        players: {},
        scores: {},
        submissions: {},
      };
      socket.auth = { name, code };
      sync();
    });

    socket.on("submit", (name, value) => {
      if (!serverState) {
        return;
      }

      serverState.submissions[name] = value;
      handleTransition();
    });

    socket.on("host-switch", () => {
      console.log("taking over as host");
      if (!clientState) {
        throw new Error("cannot take over as host without client state");
      }

      // take over the host role
      serverState = clientState;
      serverState.host = name;
      sync();
    });

    socket.on("join", (name) => {
      if (!serverState) {
        return;
      }

      console.log("client connected", name);
      if (serverState.type !== "lobby") {
        console.log("marking player as active again, game in progress");
        serverState.players[name].state = "active";
      } else {
        console.log("adding player to game");
        serverState.players[name] = { state: "active" };
        serverState.scores[name] = 0;
      }
      sync();
    });

    socket.on("leave", (name) => {
      if (!serverState) {
        return;
      }

      console.log("client disconnected", name);
      if (serverState.type !== "lobby") {
        console.log("marking player as inactive, game in progress");
        serverState.players[name].state = "inactive";
      } else {
        console.log("removing player from game");
        delete serverState.players[name];
        delete serverState.scores[name];

        // reset ready state for all players, so a game does not start
        // immediately if a player leaves that wasn't ready before
        serverState.submissions = {};
      }
      sync();
    });

    function handleTransition() {
      if (!serverState) {
        return;
      }

      switch (serverState.type) {
        case "lobby": {
          if (
            Object.values(serverState.submissions).filter(
              (value) => value === "ready"
            ).length === Object.keys(serverState.players).length &&
            Object.keys(serverState.players).length > 1
          ) {
            console.log("transitioning to ask phase");

            serverState = {
              type: "ask",
              code: serverState.code,
              host: serverState.host,

              players: serverState.players,
              scores: serverState.scores,

              submissions: {}, // reset submissions
            };
          }

          break;
        }
        case "ask": {
          if (
            Object.keys(serverState.submissions).length ===
            Object.keys(serverState.players).length
          ) {
            console.log("transitioning to answer phase");

            serverState = {
              type: "answer",
              code: serverState.code,
              host: serverState.host,

              players: serverState.players,
              scores: serverState.scores,
              questions: serverState.submissions,
              mappings: generateQuestionMappings(serverState.submissions),

              submissions: {}, // reset submissions
            };
          }
          break;
        }
        case "answer": {
          if (
            Object.keys(serverState.submissions).length ===
            Object.keys(serverState.players).length
          ) {
            console.log("transitioning to lie phase");

            serverState = {
              type: "fibbage.lie",
              code: serverState.code,
              host: serverState.host,
              round: 0,

              players: serverState.players,
              scores: serverState.scores,
              questions: serverState.questions,
              mappings: serverState.mappings,
              answers: serverState.submissions,

              submissions: {}, // reset submissions
            };
          }
          break;
        }
        case "fibbage.lie": {
          if (
            Object.keys(serverState.submissions).length ===
            Object.keys(serverState.players).length - 1 // one less because the victim can't submit a lie
          ) {
            console.log("transitioning to vote phase");

            serverState = {
              type: "fibbage.vote",
              code: serverState.code,
              host: serverState.host,
              round: serverState.round,

              players: serverState.players,
              scores: serverState.scores,
              questions: serverState.questions,
              mappings: serverState.mappings,
              answers: serverState.answers,
              lies: serverState.submissions,

              submissions: {}, // reset submissions
            };
          }
          break;
        }
        case "fibbage.vote": {
          if (
            Object.keys(serverState.submissions).length ===
            Object.keys(serverState.players).length - 1 // one less because the victim can't cast a vote
          ) {
            console.log("transitioning to reveal phase");

            serverState = {
              type: "fibbage.reveal",
              code: serverState.code,
              host: serverState.host,
              round: serverState.round,

              players: serverState.players,
              scores: serverState.scores,
              questions: serverState.questions,
              mappings: serverState.mappings,
              answers: serverState.answers,
              lies: serverState.lies,
              votes: serverState.submissions,

              submissions: {}, // reset submissions
            };
          }
          break;
        }
        case "fibbage.reveal": {
          if (
            Object.values(serverState.submissions).filter(
              (value) => value === "ready"
            ).length === Object.keys(serverState.players).length
          ) {
            serverState.round++;

            // end of the game
            if (serverState.round === Object.keys(serverState.players).length) {
              console.log("transitioning to lobby phase");

              serverState = {
                type: "lobby",
                code: serverState.code,
                host: serverState.host,
                // only keep active players for the next round
                players: Object.fromEntries(
                  Object.entries(serverState.players).filter(
                    ([_, data]) => data.state === "active"
                  )
                ),
                scores: serverState.scores,

                submissions: {}, // reset submissions
              };
              break;
            }

            console.log("transitioning to next lie round");
            serverState = {
              type: "fibbage.lie",
              code: serverState.code,
              host: serverState.host,
              round: serverState.round,

              players: serverState.players,
              scores: serverState.scores,
              questions: serverState.questions,
              mappings: serverState.mappings,
              answers: serverState.answers,

              submissions: {}, // reset submissions
            };
          }

          break;
        }
        default:
          break;
      }

      sync();
    }
  }

  let codeValue = "";
  let nameValue = "";
  let hostNameValue = "";
</script>

{#if clientState}
  <GameView
    {socket}
    state={clientState}
    on:leave={() => {
      socket.disconnect();
      clientState = undefined;
      serverState = undefined;
      window.sessionStorage.removeItem("name");
      window.sessionStorage.removeItem("code");
    }}
  />
{:else}
  <header>
    <Logo />
  </header>
  <main>
    <SimpleTextPrompt
      label={$i18n.namePrompt}
      bind:value={hostNameValue}
      on:submit={() => join(hostNameValue)}
    />
    <button on:click={() => join(hostNameValue)}>{$i18n.createRoom}</button>
    <p>- {$i18n.or} -</p>
    <SimpleTextPrompt
      label={$i18n.codePrompt}
      bind:value={codeValue}
      on:submit={() => join(nameValue, codeValue)}
    />
    <SimpleTextPrompt
      label={$i18n.namePrompt}
      bind:value={nameValue}
      on:submit={() => join(nameValue, codeValue)}
    />
    <button on:click={() => join(nameValue, codeValue)}>
      {$i18n.joinRoom}
    </button>
  </main>
{/if}

<style>
  main {
    display: flex;
    align-items: center;
    gap: 1em;

    & > button {
      width: 100%;
    }
  }
</style>
