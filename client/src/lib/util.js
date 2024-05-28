import { getRandomInt } from "shared";

/**
 * Constructs a keyboard event handler that calls the specified callback when the Enter key is pressed.
 *
 * @example <input on:keydown={onEnter(() => submit())} />
 * @returns {import("svelte/elements").KeyboardEventHandler<HTMLInputElement>} the svelte keyboard event handler
 * @param {() => any} callback
 */
export function onEnter(callback) {
  return function (event) {
    if (event.key === "Enter") {
      callback();
    }
  };
}

/**
 * Shuffles the given array without mutating the original array.
 *
 * @template T
 * @param {T[]} array
 */
export function shuffleArray(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i);
    // Swap elements at i and j
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const appVersion = __APP_VERSION__;
