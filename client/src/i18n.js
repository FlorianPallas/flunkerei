import { readable } from "svelte/store";

export const FALLBACK = {
  namePrompt: "Enter your name",
  codePrompt: "Enter a room code",
  createRoom: "Create Room",
  joinRoom: "Join Room",
  or: "or",
  ready: {
    yes: "Ready",
    no: "Not Ready",
  },
  lobby: {
    leaveRoom: {
      label: "Leave Room",
      confirmation:
        "Are you sure you want to leave the room? You will not be able to rejoin once the game has started.",
    },
  },
  ask: {
    prompt: "Think of a question for the other players",
    pickForMe: {
      label: "Pick for me",
      confirmation:
        "Are you sure you want to let the computer pick a question for you? That's a bit boring, don't you think?",
    },
  },
};

/**
 * @type {import("svelte/store").Readable<FALLBACK>}
 */
export const i18n = readable(FALLBACK, function start(set) {
  fetch(`content/${import.meta.env.VITE_LOCALE}/i18n.json`)
    .then((response) => response.json())
    .then((data) => set(data));
});
