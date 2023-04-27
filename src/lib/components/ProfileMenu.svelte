<script lang="ts">
	import { goto } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import { pb } from './pocketbase';

	let isExpanded = false;

	function clickHandler() {
		isExpanded = !isExpanded;
	}
</script>

<nav class="">
	<button id="search-button" on:click={clickHandler}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			class="w-10 h-10 stroke-white fit items-center justify-center"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
	</button>
	{#if isExpanded}
		<ul transition:slide class="dark:text-white flex flex-col" >
			<button on:click={()=>{pb.authStore.clear(); goto('/');}}>Logout</button>
            <a href="/settings">Settings</a>
		</ul>
	{/if}
</nav>
