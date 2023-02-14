<script lang="ts">
	import { enhance } from '$app/forms';
	import { perPage } from './browseHelpers';

	export let data: any;
	export let form = data.articles.items;
	let articles = data.articles.items;

	function onFormChange() {
		if (form?.articles) {
			let newLoadLimitReached = false
			if(form?.articles.items.length < perPage){
				// We reached our limit
				limitReached = true
				newLoadLimitReached = true
			}

			if (form?.append) {
				articles = articles.concat(form?.articles.items);
				currentPage++;
				return;
			}
			articles = form.articles.items;
			form.articles = undefined;
			
			if(!newLoadLimitReached){limitReached = false} // reset limit on switch

			return;
		}
	}

	$: form, onFormChange();

	let currentPage = 1;
	let useUserCats = true;
	let limitReached = articles.length < perPage;

	console.log(articles.length >= perPage)
	// console.log(alert(JSON.stringify(articles, null, 4)))
</script>

<title>Browse</title>

<h1 class="text-neutral-content p-5 font-bold text-xl">Browse recent work</h1>
<div class="flex-col justify-center space-y-3 px-5">
	{#if data.user}
		<div class="flex">
			<div class="btn-group p-3 space-x-2">
				<form action="?/updateMethod" method="POST" use:enhance>
					<button
						class={!useUserCats ? 'btn btn-active btn-primary btn-disabled text-base-100' : 'btn'}
						on:click={() => {
							useUserCats = false;
						}}>Browse all</button
					>
					<input hidden name="userCats" value={useUserCats} />
				</form>
				<form action="?/updateMethod" method="POST" use:enhance>
					<button
						class={useUserCats ? 'btn btn-active btn-primary btn-disabled text-base-100' : 'btn'}
						on:click={() => {
							useUserCats = true;
						}}>My catagories only</button
					>
					<input hidden name="userCats" value={useUserCats} />
				</form>
			</div>
		</div>
	{/if}

	{#each articles as article, i}
		<div class="card w-auto  bg-neutral text-neutral-content shadow-xl">
			<div class="card-body">
				<a href={article.pdf_url} class="card-title">{article.title}</a>
				<p>🔥: {article.avgRating}</p>
			</div>
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
