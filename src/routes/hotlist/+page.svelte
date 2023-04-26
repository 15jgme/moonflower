<script lang="ts">
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import { scale } from 'svelte/transition';

	export let data: any;
</script>

<title>Hot list</title>

<h1 class="p-5 font-bold text-xl">Hottest papers of this week!</h1>

<div class="flex-col justify-center space-y-3 px-5">
	{#each data.articles.items as article, i}
		{#if article.numberOfRatings > 0}
			<div transition:scale>
				<ArticleCard {article} index={i} />
			</div>
		{/if}
	{/each}
</div>
