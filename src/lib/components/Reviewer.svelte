<script lang="ts">
	import { currentUser, currentState, stateEnum } from '$lib/components/pocketbase.js';
	import { pb } from '$lib/components/pocketbase';
	import type { Record } from 'pocketbase';

	enum reviewScore {
		GOOD = 3,
		MEDIUM = 2,
		POOR = 1
	}

	async function addReview(score: number) {
		const data = {
			rating: score,
			reviewer: $currentUser?.id,
			article: $currentUser?.lastPickedPost
		};
		const reviewRec = await pb.collection('reviews').create(data);
		if ($currentState == stateEnum.AWAITREVIEW) {
			currentState.set(stateEnum.AWAITTIMER);
		}

		// example update data
		const data2 = {
			lastReview: reviewRec.id
		};
		await pb.collection('users').update($currentUser?.id, data2);
	}

	async function fetchLastReview(): Promise<String> {
		const record = await pb.collection('reviews').getOne($currentUser.lastReview);
        const rating = record.rating;
		switch (rating) {
		    case reviewScore.GOOD:
                return "🔥"
		        break;
            case reviewScore.MEDIUM:
                return "💧"
		        break;
            case reviewScore.POOR:
                return "❄️"
		        break;
		    default:
                return ""
		        break;
		}
	}
</script>

<div class="pb-10">
	{#if $currentState > stateEnum.AWAITVIEW}
		<h1 class="font-extrabold text-center dark:text-white">Enter your review</h1>
		<div class="flex space-x-2 py-2 justify-center">
			<button
				class=" text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-500 dark:hover:bg-gray-600 dark:focus:ring-orange-800"
				on:click={() => {
					addReview(reviewScore.POOR);
				}}
			>
				<p>❄️</p>
				<p>Okay</p>
			</button>
			<button
				class="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-500 dark:hover:bg-gray-600 dark:focus:ring-orange-800"
				on:click={() => {
					addReview(reviewScore.MEDIUM);
				}}
			>
				<p>💧</p>
				<p>Good</p>
			</button>
			<button
				class="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-500 dark:hover:bg-gray-600 dark:focus:ring-orange-800"
				on:click={() => {
					addReview(reviewScore.GOOD);
				}}
			>
				<p>🔥</p>
				<p>Great</p>
			</button>
		</div>
	{:else if $currentState == stateEnum.AWAITTIMER}
		{#await fetchLastReview() then lastReview}
			<h1 class="font-extrabold text-center dark:text-white">Your last review</h1>
			<div class="flex space-x-2 py-2 justify-center">
				<button
					class=" text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-500 dark:hover:bg-gray-600 dark:focus:ring-orange-800"
                    disabled
				>
					<p>{lastReview}</p>
				</button>
			</div>
		{/await}
	{/if}
</div>
