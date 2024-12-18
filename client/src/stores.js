import { readable } from "svelte/store";

/**
 * @type {import("svelte/store").Readable<{questions: string[]}>}
 */
export const content = readable({ questions: [] }, function start(set) {
  console.log("x", window);
  fetch(`content/${window.APP_LOCALE}/content.json`)
    .then((response) => response.json())
    .then((data) => set(data));
});
