<script lang="ts">
	import '../app.css';
	import Navbar from './navbar.svelte';

	export let data: any;
</script>

{#if data.user}
	<Navbar user={data.user}/>
{/if}

<slot />
