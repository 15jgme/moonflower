<script lang="ts">
	import CatagorySelector from '$lib/components/CatagorySelector.svelte';
	import ProfileMenu from '$lib/components/ProfileMenu.svelte';
</script>

<html class="dark" lang="ts"
	><header><title>Settings page for moonflower</title></header>
	<body>
		<div class="bg-wave-bg h-screen bg-cover aspect-auto w-auto bg-bottom bg-local overflow-auto">
			<div class="flex p-2">
				<a href="/"><h1 class="font-extrabold text-white text-4xl items-left">🌕Moonflower🌸</h1></a>
				<div class="grow" />
				<div class=""><ProfileMenu /></div>
			</div>
			<CatagorySelector />
		</div>
	</body></html
>
