import PocketBase from 'pocketbase'
import { writable } from 'svelte/store'

export const pb = new PocketBase("moonflowerdata.jgme.io")

export const currentUser = writable(pb.authStore.model)