<script lang="ts">
	import Timer from '$lib/components/Timer.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import toast, { Toaster } from 'svelte-french-toast';
	import { parseAuthors } from '$lib/helpers';
	import { scale } from 'svelte/transition';
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
					icon: '💥',
					duration: 6000
				}
			);
			form.paperFromCatagoriesUnavailable = undefined;
		}
	}

	// Pop the toast whenever we get a formchange
	$: form, onFormChange();
</script>

<Toaster />

<html lang="ts">
	<div class="">
		<header><title>Moonflower, a web app to encourage daily arXiv reading </title></header>
		<body>
			{#if !data.user}
				<div class="hero h-[calc(100vh-67px)] bg-base-200">
					<div class="hero-content text-center">
						<div class="max-w-md">
							<h1 class="font-extrabold text-4xl">🌕Moonflower🌸</h1>
							<p class="text-m font-medium text-center">
								A web app to randomly pick one or more arXiv papers for you to read every day from
								your favourite catagories.
							</p>
							<div class="inline-flex">
								<div class="pt-5 px-3 md:w-30">
									<a href="/login" class="btn btn-primary">Log in</a>
								</div>
								<div class="pt-5 px-3 md:w-30">
									<a href="/browse" class="btn btn-primary">Browse</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<div class="h-screen items-center justify-center py-3">
					<!-- Check for new user -->
					{#if !data.user.lastReview}
						<div class="text-center font-bold">
							<p class="">Welcome to MoonFlower</p>
							{#if data.user.subscribedCats[0]}
								<p class="">Hit the button below to pick your first paper</p>
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
								{#if currentState == stateList.AWAITPICK && data.user.subscribedCats[0]}
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
									<div class="pt-5 md:w-30">
										<a href="/browse" class="btn btn-neutral w-full max-w-xs ">
											<span class="inline"
												><p>Browse</p>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="1.5"
													stroke="currentColor"
													class="w-6 h-6 inline"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
													/>
												</svg>
											</span>
										</a>
									</div>
								{:else if currentState >= stateList.AWAITVIEW}
									<p />
									<div class="bg-base-100">
										<a
											on:click={() => {
												if (currentState == stateList.AWAITVIEW) {
													currentState = stateList.AWAITREVIEW;
												}
											}}
											href={form?.url}
											target="”_blank”"
											class="btn btn-primary">Read on arXiv</a
										>
										{#if form?.title}
											<details class="py-4 text-centre" transition:scale>
												<summary class="font-extrabold"
													>{form?.title + '\n by ' + parseAuthors(form?.authors)}</summary
												>
												<p>{form?.summary}</p>
											</details>
										{:else}
											<div
												role="status"
												class="items-center justify-center flex flex-col"
												transition:scale
											>
												<svg
													aria-hidden="true"
													class="w-8 h-8 mr-2 text-neutral animate-spin fill-primary"
													viewBox="0 0 100 101"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
														fill="currentColor"
													/>
													<path
														d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
														fill="currentFill"
													/>
												</svg>
											</div>
										{/if}
									</div>
								{:else if currentState == stateList.AWAITTIMER}
									<div class="items-center">
										<p class="py-3 font-extrabold">Your last picked paper</p>
										<a
											href={data.lastArticleRecord.pdf_url}
											target="”_blank”"
											class="btn btn-primary">Read on arXiv</a
										>

										<details class="p-4 text-centre">
											<summary class="font-extrabold"
												>{data.lastArticleRecord.title +
													'\n by ' +
													parseAuthors(data.lastArticleRecord.authors)}</summary
											>
											<p>{data.lastArticleRecord.summary}</p>
										</details>
									</div>
								{/if}
							</div>
							<div class="p-5 ">
								<div class="pb-10">
									{#if currentState > stateList.AWAITVIEW}
										<h1 class="font-extrabold text-center ">Enter your review</h1>
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
												<br />
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
										<h1 class="font-extrabold text-center ">Your last review</h1>
										<div class="flex space-x-2 py-2 justify-center">
											<button class=" btn btn-secodary" disabled>
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
