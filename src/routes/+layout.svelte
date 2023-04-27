<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import Navbar from './navbar.svelte';

	// To keep theme
	import { themeChange } from 'theme-change';
	onMount(() => {
		themeChange(false);
        // applyTheme("cupcake")
	});

	export let data: any;
</script>

{#if data.user}
	<Navbar user={data.user} />
{:else}
	<Navbar user={''} />
{/if}

<slot />
