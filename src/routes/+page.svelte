<script lang="ts">
	import Timer from '$lib/components/Timer.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import toast, { Toaster } from 'svelte-french-toast';
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

	/*
		Note: new users will have users.lastReview falsy. This will be our definition! 
	*/
	export let form: any;

	function onFormChange() {
		if (form?.paperFromCatagoriesUnavailable) {
			toast(
				"Whoops, we couldn't find a new paper from your favorite catagories today. Instead we fetched something random for you to read!",
				{
					icon: '💥'
				}
			);
			form.paperFromCatagoriesUnavailable = undefined;
		}
	}

	// Pop the toast whenever we get a formchange
	$: form, onFormChange();
</script>

<Toaster />

<html class="dark" lang="ts">
	<div class="bg-wave-bg bg-cover aspect-auto w-auto bg-bottom bg-local overflow-auto">
		<header><title>Moonflower, a web app to encourage daily Arxive reading </title></header>
		<body>
			{#if !data.user}
				<div class=" items-center h-screen justify-center flex flex-col">
					<h1 class="font-extrabold text-4xl">🌕Moonflower🌸</h1>
					<p class="text-m font-medium text-gray-900  dark:text-white text-center">
						A web app to randomly pick one or more Arxive papers for you to read every day from your
						favourite catagories.
					</p>
					<div class="pt-5 md:w-30">
						<a href="/login" class="btn btn-primary">Log in</a>
					</div>
				</div>
			{:else}
				<div class="h-screen items-center justify-center">
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
												}, 100)}
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
												<button
													class="btn btn-secodary"
													on:click={() =>
														setTimeout(() => {
															invalidateAll();
															currentState = stateList.AWAITTIMER;
														}, 500)}>Submit</button
												>
											</form>
										</div>
									{:else if currentState == stateList.AWAITTIMER}
										<h1 class="font-extrabold text-center dark:text-white">Your last review</h1>
										<div class="flex space-x-2 py-2 justify-center">
											<button
												class=" text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-500 dark:hover:bg-gray-600 dark:focus:ring-orange-800"
												disabled
											>
												<p>{data.lastReviewRecord.rating}/5</p>
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
