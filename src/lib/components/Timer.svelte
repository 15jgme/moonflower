<script lang="ts">
	import { Record } from 'pocketbase';
	import { invalidate } from '$app/navigation';
	import { browser } from "$app/environment";

	interface time {
		hours: number;
		minutes: number;
	}

	let remaining: time;
	let timerExpired: boolean = false;

	export let lastReview: Record;
	export let appState: number;

	function updateTimer() {
		console.log("test")
		const lastPostTimeDT = new Date(lastReview.created);
		let nextPostTime = lastPostTimeDT.setDate(lastPostTimeDT.getDate() + 1);
		timerExpired = nextPostTime - Date.now() < 0;
		let seconds_rem = (nextPostTime - Date.now()) / 1000;

		console.log(timerExpired)
		console.log(appState)
		console.log(browser)

		if(timerExpired && appState == 0 && browser){
			// If our timer runs out reload the page
			console.log("Reload page")
			// appState = 1;
		}

		remaining = {
			hours: Math.trunc(seconds_rem / 3600),
			minutes: Math.trunc((seconds_rem % 3600) / 60)
		};
	}


	updateTimer();
	setInterval(updateTimer, 60000); // Update timer every minute
</script>

{#if remaining != undefined}
	<div class="font-extrabold inline-flex space-x-3 dark:text-white">
		<p class="font-medium">Thank you for your review! Check back in:</p>
		<p>{remaining.hours} <span>H</span></p>
		<p>{remaining.minutes} <span>M</span></p>
	</div>
{/if}
