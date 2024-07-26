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

/**
 * Assigns questions to players at random, making
 * sure each player does not get their own question
 *
 * @param {Record<string,string>} questions
 * @returns
 */
export function generateQuestionMappings(questions) {
  const authors = Object.keys(questions);
  const victims = Object.keys(questions);

  if (authors.length < 2) {
    throw new Error("At least two players are required");
  }

  /** @type {Record<string,string>} */
  const mappings = {};

  // pick random author
  for (let x = 0; x < 100 && authors.length > 0; x++) {
    let i = getRandomInt(0, authors.length - 1);
    let j = getRandomInt(0, victims.length - 1);

    let author = authors[i];
    let victim = victims[j];

    // never assign the question to self
    if (author === victim) {
      continue;
    }

    // make sure there is no stalemate situation where
    // two players are assigned each other and the remaining
    // player is assigned to themselves
    if (authors.length === 2 && mappings[victim] === author) {
      continue;
    }

    mappings[author] = victim;
    authors.splice(i, 1);
    victims.splice(j, 1);
  }

  return mappings;
}

export const appVersion = __APP_VERSION__;
