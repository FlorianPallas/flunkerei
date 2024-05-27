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

/**
 * Returns a random integer between the specified values, inclusive.
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random element from the given array.
 *
 * @template T the type of elements in the array
 * @param {T[]} array an array of elements
 * @returns {T} a random element from the array
 */
export function getRandomElement(array) {
  return array[getRandomInt(0, array.length - 1)];
}

export const appVersion = __APP_VERSION__;
