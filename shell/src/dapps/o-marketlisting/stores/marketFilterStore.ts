import {writable} from "svelte/store";

export const marketFilterStore = writable<number[]>([]);