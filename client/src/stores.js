import { readable } from "svelte/store";

/**
 * @type {import("svelte/store").Readable<{questions: string[]}>}
 */
export const content = readable({ questions: [] }, function start(set) {
  fetch(`content/${import.meta.env.VITE_LOCALE}/content.json`)
    .then((response) => response.json())
    .then((data) => set(data));
});
