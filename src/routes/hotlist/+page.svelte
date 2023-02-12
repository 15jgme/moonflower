<script lang="ts">
	export let data: any;
</script>

<title>Hot list</title>

<h1 class="text-neutral-content p-5 font-bold text-xl">Hottest papers of this week!</h1>

<div class="flex-col justify-center space-y-3 px-5">
	{#each data.articles.items as article, i}
		{#if article.numberOfRatings > 0}
			<div class="card w-auto  bg-neutral text-neutral-content shadow-xl">
				<div class="card-body">
					<p>#{i + 1}</p>
					<a href={article.pdf_url} class="card-title">{article.title}</a>
					<p>🔥: {article.avgRating}</p>
				</div>
			</div>
		{/if}
	{/each}
</div>
