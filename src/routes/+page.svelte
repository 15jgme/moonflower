<script lang="ts">
	import Login from '$lib/components/Login.svelte';
	import { currentUser, currentState, stateEnum } from '$lib/components/pocketbase.js';
	import Timer from '$lib/components/Timer.svelte';
	import ArticlePicker from '$lib/components/ArticlePicker.svelte';
	import Reviewer from '$lib/components/Reviewer.svelte';
	import ProfileMenu from '$lib/components/ProfileMenu.svelte';
</script>

<html class="dark" lang="ts"
	><div class="bg-wave-bg bg-cover aspect-auto w-auto bg-bottom bg-local overflow-auto">
		<header><title>Moonflower, a web app to encourage daily Arxive reading </title></header>
		<body>
			{#if !$currentUser}
				<div class=" items-center h-screen justify-center flex flex-col">
					<h1
						class="font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-orange-400 to-purple-600 text-center"
					>
						🌕Moonflower🌸
					</h1>
					<p class="text-m font-medium text-gray-900  dark:text-white text-center">
						A web app to randomly pick one or more Arxive papers for you to read every day form your
						favourite catagories.
					</p>
					<div class="pt-5 md:w-30">
						<a
							href="/login"
							class=" text-white bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-orange-300"
							>Log in</a
						>
					</div>
				</div>
			{:else}
				<div class="h-screen items-center justify-center">
					<div class="flex p-2">
						<h1 class="font-extrabold text-white text-4xl text-left">🌕Moonflower🌸</h1>
						<div class="grow" />
						<div class=""><ProfileMenu /></div>
					</div>
					{#if !$currentUser.lastReview}
						<div class="text-center font-bold">
							<p class="dark:text-white">Welcome to MoonFlower</p>
							{#if $currentUser.subscribedCats[0]}
								<p class="dark:text-white">Hit the button below to pick your first paper</p>
							{/if}
						</div>
					{/if}
					{#if !$currentUser.subscribedCats[0]}
					<div class="text-center font-bold"><a href="/settings" class="dark:text-orange-400 hover:dark:text-orange-500"
						>Please select some catagories to get started</a
					></div>
						
					{/if}
					<div class="p-5 flex flex-col">
						{#if $currentState == stateEnum.AWAITTIMER}
							<div class="text-center"><Timer /></div>
						{/if}
						<div class="p-5 text-center">
							<ArticlePicker />
							<div class="p-5 ">
								<Reviewer />
							</div>
						</div>
					</div>
				</div>
			{/if}
		</body>
	</div></html
>
