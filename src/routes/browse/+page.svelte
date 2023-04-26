<script lang="ts">
	import { dev } from '$app/environment';
	import { enhance } from '$app/forms';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import { perPage } from './browseHelpers';
	import { scale } from 'svelte/transition';

	export let data: any;
	export let form = data.articles.items;
	let articles = data.articles.items;

	function onFormChange() {
		if (form?.articles) {
			let newLoadLimitReached = false;
			if (form?.articles.items.length < perPage) {
				// We reached our limit
				limitReached = true;
				newLoadLimitReached = true;
			}

			if (form?.append) {
				articles = articles.concat(form?.articles.items);
				currentPage++;
				form.articles = undefined;
				return;
			}
			articles = form.articles.items;
			form.articles = undefined;

			if (!newLoadLimitReached) {
				limitReached = false;
			} // reset limit on switch

			return;
		}
	}

	$: form, onFormChange();

	let currentPage = 1;
	let useUserCats = true;
	let limitReached = articles.length < perPage;
</script>

<title>Browse</title>

<h1 class="p-5 font-bold text-xl">Browse recent work</h1>
<div class="flex-col justify-center space-y-3 px-5">
	{#if data.user}
		<div class="flex">
			<form action="?/updateMethod" method="POST" use:enhance>
				<div class="btn-group p-3 space-x-2">
					<button
						class={!useUserCats ? 'btn btn-active btn-primary btn-disabled text-base-100' : 'btn'}
						on:click={() => {
							useUserCats = false;
							form.articles = undefined;
						}}>Browse all</button
					>
					<input hidden name="userCats" value={useUserCats} />

					<button
						class={useUserCats ? 'btn btn-active btn-primary btn-disabled text-base-100' : 'btn'}
						on:click={() => {
							useUserCats = true;
							form.articles = undefined;
						}}>My catagories only</button
					>
					<input hidden name="userCats" value={useUserCats} />
				</div>
			</form>
		</div>
	{/if}

	{#each articles as article, i}
		<div transition:scale>
			<ArticleCard {article} />
		</div>
	{/each}
	{#if !limitReached}
		<form method="POST" action="?/loadMore" use:enhance>
			<button class="btn btn-primary">Load more</button>
			<input hidden value={currentPage + 1} name="page" />
			<input hidden value={useUserCats} name="userCats" />
		</form>
	{/if}
</div>
