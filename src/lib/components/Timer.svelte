<script lang="ts">
	import { currentUser, currentState, stateEnum } from '$lib/components/pocketbase.js';
	import { pb } from '$lib/components/pocketbase';
	import type { Record } from 'pocketbase';
	import { onMount } from 'svelte';

	interface time {
		hours: number;
		minutes: number;
	}

	let remaining: time;
	let lastReview: Record;
	let timerExpired: boolean = false;

	onMount(async () => {
		// First check if we have a new user
		if (!$currentUser.lastReview) {
			console.log('transition 1');
			// Jump to new picking
			currentState.set(stateEnum.AWAITPICK);
			return;
		}
		// let queryString = 'reviewer="' + $currentUser?.id + '"';
		try {
			lastReview = await pb
				.collection('reviews')
				.getOne($currentUser.lastReview)
		} catch (error) {
			console.error(error);
		}
		console.log(lastReview);
		updateTimer();
	});

	function updateTimer() {
		if (lastReview == undefined && $currentState == stateEnum.AWAITTIMER) {
			// If the user is brand-new, force advance to pick
			console.log('transition 2');
			currentState.set(stateEnum.AWAITPICK);
		}
		const lastPostTimeDT = new Date(lastReview.created);
		let nextPostTime = lastPostTimeDT.setDate(lastPostTimeDT.getDate() + 1);
		timerExpired = nextPostTime - Date.now() < 0;
		let seconds_rem = (nextPostTime - Date.now()) / 1000;

		remaining = {
			hours: Math.trunc(seconds_rem / 3600),
			minutes: Math.trunc((seconds_rem % 3600) / 60)
		};

		if ($currentState == stateEnum.AWAITTIMER && timerExpired) {
			console.log(nextPostTime - Date.now());
			console.log(nextPostTime);
			console.log(Date.now());
			console.log(remaining);
			console.log('transition 3');
			currentState.set(stateEnum.AWAITPICK);
		}
	}

	setInterval(updateTimer, 60000); // Update timer every minute
</script>

{#if remaining != undefined}
	<div class="font-extrabold inline-flex space-x-3 dark:text-white">
		<p class="font-medium">Thank you for your review! Check back in:</p>
		<p>{remaining.hours} <span>H</span></p>
		<p>{remaining.minutes} <span>M</span></p>
	</div>
{/if}
