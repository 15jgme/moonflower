<script lang="ts">
	import Select from 'svelte-select';
	import { enhance } from '$app/forms';
	import ThemeChange from '$lib/components/ThemeChange.svelte';
	import { invalidateAll } from '$app/navigation';

	import { scale } from 'svelte/transition';

	export let data: any;

	// export let form: any;
	const groupBy = (item: any) => item.group;

	let catagory_loading: boolean = false;
	let unique = {};
</script>

<body>
	<div class="items-center justify-center flex flex-col multiselect py-2">
		<div class="flex flex-col border-opacity-50">
			<div class="divider">Your catagories</div>
			<div class="py-5 card bg-base-300 rounded-box place-items-center">
				<div class="overflow-x-auto">
					<form
						method="POST"
						action="?/removeCatagories"
						class="flex"
						use:enhance={({ form, data, action, cancel, submitter }) => {
							if (!catagory_loading) {
								catagory_loading = true;
							}
							return async ({ result, update }) => {
								if (catagory_loading) {
									catagory_loading = false;
								}
								update();
							};
						}}
					>
						<table class="table w-full">
							<thead>
								<tr>
									<th>Name</th>
									<th>Description</th>
									<th><button class="btn btn-primary">Remove</button></th>
								</tr>
							</thead>
							<tbody>
								{#each data.usersCatagories as catagory}
									<tr transition:scale>
										<td>{catagory.value}</td>
										<td>{catagory.label}</td>

										<th>
											<label>
												<input type="checkbox" name={catagory.id} class="checkbox" />
											</label>
										</th>
									</tr>
								{/each}
							</tbody>
						</table>
					</form>
				</div>
				<p class="py-2">Add catagories</p>
				<div class="md:px-2 inline-flex">
					<form
						method="POST"
						action="?/addCatagories"
						class="flex"
						use:enhance={({ form, data, action, cancel, submitter }) => {
							if (!catagory_loading) {
								catagory_loading = true;
							}
							return async ({ result, update }) => {
								if (catagory_loading) {
									catagory_loading = false;
								}
								update();
								unique = {}; // Wow -> https://stackoverflow.com/questions/58153729/restart-or-re-init-component-in-svelte
								invalidateAll();
							};
						}}
					>
						{#key unique}
							<div class="w-min">
								<Select
									items={data.availableCatagories}
									multiple={true}
									{groupBy}
									name="catagories"
								/>
							</div>
						{/key}
						<div class="px-2" />
						<button class="btn btn-primary"> save </button>
					</form>
				</div>
				{#if catagory_loading}
					<div role="status" class="p-2 justify-center" transition:scale>
						<svg
							aria-hidden="true"
							class="w-8 h-8 mr-2 text-neutral animate-spin fill-primary"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
					</div>
				{/if}
			</div>

			<div class="divider">Themes</div>
			<div class="py-5 grid h-20 card bg-base-300 rounded-box place-items-center">
				<ThemeChange />
			</div>
		</div>
	</div></body
>
