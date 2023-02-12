<script lang="ts">
	import { currentUser, currentState, stateEnum } from '$lib/components/pocketbase.js';
	import { pb } from '$lib/components/pocketbase';
	import type { Record } from 'pocketbase';

	interface article {
		url: string;
		title: string;
		summary: string;
	}

	let chosenArticle: Promise<article>;
	let pickedYet: boolean = false;

	async function fetchRandomArticle(trueSelection: boolean): Promise<article> {
		let cats: string[] = $currentUser?.subscribedCats;
		let searchQuery = '';
		for (let i = 0; i < cats.length; i++) {
			searchQuery = searchQuery + "(catagories ~ '" + cats[i] + "')";
			if (i < cats.length - 1) {
				searchQuery = searchQuery + ' || ';
			}
		}
		let result = await pb
			.collection('articles')
			.getList(1, 50, { sort: '@random', filter: searchQuery });

		if (result.items[0] == undefined) {
			result = await pb.collection('articles').getList(1, 50, { sort: '@random' }); // fetch anything
		}

		let art: article = {
			url: result.items[0].pdf_url,
			title: result.items[0].title,
			summary: result.items[0].summary
		};

		if (trueSelection) {
			// Update last picked post
			const data = {
				lastPickedPost: result.items[0].id
			};
			await pb.collection('users').update($currentUser?.id, data);
			currentState.set(stateEnum.AWAITVIEW); // Update state to wait for user to view on arXiv
		}
		return art;
	}

	async function fetchLastPaper(): Promise<article> {
		const record = await pb.collection('articles').getOne($currentUser.lastPickedPost, { '$autoCancel': false });
		let art: article = {
			url: record.pdf_url,
			title: record.title,
			summary: record.summary
		};
		return art;
	}
</script>

<div>
	{#if $currentState >= stateEnum.AWAITPICK}

		{#await fetchRandomArticle(false)}
			<button
				class="p-4 text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-orange-800 w-auto md:w-36 text-center"
				disabled
				><svg class="animate-spin h-5 w-5 mr-3 fill-white" viewBox="0 0 24 24">
					<path
						d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
						class="spinner_P7sC"
					/>
				</svg>
				<p>Processing</p>
			</button>
		{:then art}
			{#if !pickedYet}
				<button
					class=" text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-orange-800"
					on:click={() => {
						fetchRandomArticle(true);
						pickedYet = true;
					}}
				>
					<p>Pick your paper</p>
				</button>
			{:else}
				<div class="bg-slate-700">
					<a
						on:click={() => {
							if ($currentState == stateEnum.AWAITVIEW) {
								currentState.set(stateEnum.AWAITREVIEW);
								console.log(stateEnum.AWAITREVIEW);
							}
						}}
						href={art.url}
						target="”_blank”"
						class="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-orange-800 w-auto md:w-11"
						>Read on arXiv</a
					>
					<details class="py-4 dark:text-white text-left">
						<summary class="font-extrabold">{art.title}</summary>
						<p>{art.summary}</p>
					</details>
				</div>
			{/if}
		{/await}
	{:else if $currentState == stateEnum.AWAITTIMER}
		{#await fetchLastPaper()}
			<button
				class="p-4 text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-orange-800 w-auto md:w-36 text-center"
				disabled
				><svg class="animate-spin h-5 w-5 mr-3 fill-white" viewBox="0 0 24 24">
					<path
						d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
						class="spinner_P7sC"
					/>
				</svg>
				<p>Processing</p>
			</button>
		{:then art}
			<div class="items-center">
				<p class="dark:text-white py-3 font-extrabold">Your last picked paper</p>
				<a
					href={art.url}
					target="”_blank”"
					class="p-4 dark:text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-orange-800 w-auto md:w-36"
					>Read on arXiv</a
				>
				<details class="dark:text-white p-4 text-left">
					<summary class="font-extrabold">{art.title}</summary>
					<p>{art.summary}</p>
				</details>
			</div>
		{/await}
	{/if}
</div>
