<script lang="ts">
	import Timer from '$lib/components/Timer.svelte';
	import Navbar from './navbar.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	export let data: any;

	enum stateList {
		AWAITTIMER = 0,
		AWAITPICK,
		AWAITVIEW,
		AWAITREVIEW
	}

	let currentState: stateList = stateList.AWAITTIMER;

	if (currentState == stateList.AWAITTIMER && data.timerExpired) {
		currentState = stateList.AWAITPICK;
	} else if (currentState == stateList.AWAITTIMER && data.newUser) {
		currentState = stateList.AWAITPICK;
	}

	enum reviewScore {
		GOOD = 3,
		MEDIUM = 2,
		POOR = 1
	}

	function toEmoji(score: number): string {
		switch (score) {
			case reviewScore.GOOD:
				return '🔥';
				break;
			case reviewScore.MEDIUM:
				return '💧';
				break;
			case reviewScore.POOR:
				return '❄️';
				break;
			default:
				return '';
				break;
		}
	}

	/*
		Note: new users will have users.lastReview falsy. This will be our definition! 
	*/
	console.log(data);
	export let form: any;
</script>

<html class="dark" lang="ts"
	><div class="bg-wave-bg bg-cover aspect-auto w-auto bg-bottom bg-local overflow-auto">
		<header><title>Moonflower, a web app to encourage daily Arxive reading </title></header>
		<body>
			{#if !data.user}
				<div class=" items-center h-screen justify-center flex flex-col">
					<h1
						class="font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-orange-400 to-purple-600 text-center"
					>
						🌕Moonflower🌸
					</h1>
					<p class="text-m font-medium text-gray-900  dark:text-white text-center">
						A web app to randomly pick one or more Arxive papers for you to read every day form your
						favourite catagories.
					</p>
					<div class="pt-5 md:w-30">
						<a href="/login" class="btn btn-primary">Log in</a>
					</div>
				</div>
			{:else}
				<div class="h-screen items-center justify-center">
					<Navbar />
					<!-- Check for new user -->
					{#if !data.user.lastReview}
						<div class="text-center font-bold">
							<p class="dark:text-white">Welcome to MoonFlower</p>
							{#if data.user.subscribedCats[0]}
								<p class="dark:text-white">Hit the button below to pick your first paper</p>
							{/if}
						</div>
					{/if}
					{#if !data.user.subscribedCats[0]}
						<div class="text-center font-bold">
							<a href="/settings" class="dark:text-orange-400 hover:dark:text-orange-500"
								>Please select some catagories to get started</a
							>
						</div>
					{/if}
					<div class="p-5 flex flex-col">
						{#if currentState == stateList.AWAITTIMER}
							<div class="text-center"><Timer lastReview={data.lastReviewRecord} /></div>
						{/if}
						<div class="p-5 text-center">
							<div>
								{#if currentState == stateList.AWAITPICK}
									<form method="POST" action="?/fetchRandomPaper" use:enhance>
										<button
											class="btn btn-primary w-full max-w-xs"
											on:click={() =>
												setTimeout(() => {
													currentState = stateList.AWAITVIEW;
												}, 50)}
										>
											<p>Pick your paper</p>
										</button>
									</form>
								{:else if currentState >= stateList.AWAITVIEW}
									<p />
									<div class="bg-slate-700">
										<a
											on:click={() => {
												if (currentState == stateList.AWAITVIEW) {
													currentState = stateList.AWAITREVIEW;
													console.log(stateList.AWAITREVIEW);
												}
											}}
											href={form?.url}
											target="”_blank”"
											class="btn btn-primary">Read on ArXive</a
										>
										<details class="py-4 dark:text-white text-left">
											<summary class="font-extrabold">{form?.title}</summary>
											<p>{form?.summary}</p>
										</details>
									</div>
								{:else if currentState == stateList.AWAITTIMER}
									<div class="items-center">
										<p class="dark:text-white py-3 font-extrabold">Your last picked paper</p>
										<a
											href={data.lastArticleRecord.pdf_url}
											target="”_blank”"
											class="btn btn-primary">Read on ArXive</a
										>
										<details class="dark:text-white p-4 text-left">
											<summary class="font-extrabold">{data.lastArticleRecord.title}</summary>
											<p>{data.lastArticleRecord.summary}</p>
										</details>
									</div>
								{/if}
							</div>
							<div class="p-5 ">
								<div class="pb-10">
									{#if currentState > stateList.AWAITVIEW}
										<h1 class="font-extrabold text-center dark:text-white">Enter your review</h1>
										<div class="flex-inline space-x-2 py-2 justify-center">
											<form action="?/addReview" method="POST" use:enhance>
												<div>
													<input type="hidden" name="score" hidden value={1} />
													<button
														on:click={() =>
															setTimeout(() => {
																invalidateAll();
																currentState = stateList.AWAITTIMER;
															}, 50)}
														class="btn btn-secodary"
													>
														<p>❄️</p>
														<p>Okay</p>
													</button>
												</div>
											</form>
											<form action="?/addReview" method="POST" use:enhance>
												<div>
													<input type="hidden" name="score" hidden value={2} />
													<button
														on:click={() =>
															setTimeout(() => {
																invalidateAll();
																currentState = stateList.AWAITTIMER;
															}, 50)}
														class="btn btn-secodary"
													>
														<p>💧</p>
														<p>Good</p>
													</button>
												</div>
											</form>
											<form action="?/addReview" method="POST" use:enhance>
												<div>
													<input type="hidden" name="score" hidden value={3} />
													<button
														on:click={() =>
															setTimeout(() => {
																invalidateAll();
																currentState = stateList.AWAITTIMER;
															}, 50)}
														class="btn btn-secodary"
													>
														<p>🔥</p>
														<p>Great!</p>
													</button>
												</div>
											</form>
											<form action="?/addReview" method="POST" use:enhance>
												<div class="rating">
													<input
														type="radio"
														name="score"
														class="mask mask-star-2 bg-secondary"
														value="1"
													/>
													<input
														type="radio"
														name="score"
														class="mask mask-star-2 bg-secondary"
														value="2"
														checked
													/>
													<input
														type="radio"
														name="score"
														class="mask mask-star-2 bg-secondary"
														value="3"
													/>
													<input
														type="radio"
														name="score"
														class="mask mask-star-2 bg-secondary"
														value="4"
													/>
													<input
														type="radio"
														name="score"
														class="mask mask-star-2 bg-secondary"
														value="5"
													/>
												</div>
												<button class="btn btn-secodary">Submit</button>
											</form>
										</div>
									{:else if currentState == stateList.AWAITTIMER}
										<h1 class="font-extrabold text-center dark:text-white">Your last review</h1>
										<div class="flex space-x-2 py-2 justify-center">
											<button
												class=" text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-500 dark:hover:bg-gray-600 dark:focus:ring-orange-800"
												disabled
											>
												<p>{toEmoji(data.lastReviewRecord.rating)}</p>
											</button>
										</div>
									{/if}
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</body>
	</div></html
>
