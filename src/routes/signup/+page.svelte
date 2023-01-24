<script lang="ts">
	import Login from '$lib/components/Login.svelte';
	import { currentUser } from '$lib/components/pocketbase.js';
</script>

<div class="grid h-screen bg-wave-bg bg-cover aspect-auto w-auto bg-bottom place-items-center dark:bg-slate-700"><Login isSignIn={true}/></div>