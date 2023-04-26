<script lang="ts">
	import type { Record } from 'pocketbase';
	import { browser } from '$app/environment';

	interface time {
		hours: number;
		minutes: number;
	}

	let remaining: time;
	let timerExpired: boolean = false;

	export let lastReview: Record;

	function updateTimer() {
		const lastPostTimeDT = new Date(lastReview.created);
		let nextPostTime = lastPostTimeDT.setDate(lastPostTimeDT.getDate() + 1);
		timerExpired = nextPostTime - Date.now() < 0;
		let seconds_rem = (nextPostTime - Date.now()) / 1000;

		remaining = {
			hours: Math.trunc(seconds_rem / 3600),
			minutes: Math.trunc((seconds_rem % 3600) / 60)
		};
	}

	updateTimer();
	setInterval(updateTimer, 60000); // Update timer every minute
</script>

{#if remaining != undefined}
	<div class="font-extrabold inline-flex space-x-3">
		{#if timerExpired}
			<p>Your new selection is ready!</p>
			<p>Reload the page to pick your paper</p>
		{:else}
			<p class="font-medium">Thank you for your review! Check back in:</p>
			<p>{remaining.hours} <span>H</span></p>
			<p>{remaining.minutes} <span>M</span></p>
		{/if}
	</div>
{/if}
