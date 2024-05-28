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
