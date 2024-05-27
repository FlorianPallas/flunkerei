import { readable } from "svelte/store";

/**
 * @type {import("svelte/store").Readable<{questions: string[]}>}
 */
export const content = readable({ questions: [] }, function start(set) {
  fetch(`content/${import.meta.env.VITE_LOCALE}/content.json`)
    .then((response) => response.json())
    .then((data) => set(data));
});

/**
 * @type {import("svelte/store").Readable<Record<string,string>>}
 */
export const i18n = readable({}, function start(set) {
  fetch(`content/${import.meta.env.VITE_LOCALE}/i18n.json`)
    .then((response) => response.json())
    .then((data) => set(data));
});
