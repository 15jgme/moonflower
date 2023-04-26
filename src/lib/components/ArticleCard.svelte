<script lang="ts">
	import { parseAuthors } from '$lib/helpers';

	export let article: any;
	export let index: any = undefined;
</script>

<div class="card w-auto  bg-neutral text-neutral-content shadow-xl">
	<div class="card-body">
		{#if index !== undefined}
			<p>#{index + 1 ?? ''}</p>
		{/if}

		<a
			href={article?.pdf_url}
			class="card-title hover:text-secondary"
			rel="noreferrer"
			target="_blank">{article?.title}</a
		>
		<span>
			<!-- <p>🔥: {article?.avgRating}</p> -->
			<details class="py-4  text-centre">
				<summary class="font-bold hover:text-accent"
					>{`🔥: ${article?.avgRating}\t` + parseAuthors(article?.authors)}</summary
				>
				<p>{article?.summary}</p>
			</details></span
		>
	</div>
</div>
