import PocketBase from 'pocketbase';

import { writable } from 'svelte/store';

export const pb = new PocketBase('https://moonflowerdata.jgme.io/');


export const currentUser = writable(pb.authStore.model);
pb.authStore.onChange((auth) => {currentUser.set(pb.authStore.model);});

export const stateEnum = Object.freeze({
    AWAITTIMER: 0,
    AWAITPICK: 1,
    AWAITVIEW: 2,
    AWAITREVIEW: 3,
})


export const currentState = writable(stateEnum.AWAITTIMER)
