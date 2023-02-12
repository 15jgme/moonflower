<script lang="ts">
	import { enhance } from '$app/forms';
	import CatagorySelector from '$lib/components/CatagorySelector.svelte';
	import MultiSelect from 'svelte-multiselect';

	let catIDMap: { [id: string]: string } = {};
	let IDcatMap: { [id: string]: string } = {};

	// let catList: Promise<any>;
	let catListLoadProm = Promise<string[]>;
	let catListFetched: boolean = false;
	let catListStr: string[] = [];

	export let data: any;
	let selected = data.selected;

	function CatArr2ID(catArr: string[]): string[]
	{
		let catIDList: string[] = []
		catArr.forEach((cat: string) => {
				catIDList.push(data.catIDMap[cat]);
		})
		return catIDList
	}
	// console.log(data);
	export let form: any;
</script>

<html class="dark" lang="ts"
	><header><title>Settings</title></header>
	<body>
		<div class="bg-wave-bg h-screen bg-cover aspect-auto w-auto bg-bottom bg-local overflow-auto">
			<div class="">
				<div class="items-center justify-center flex flex-col multiselect">
					<p class="text-white">⭐ Favourite catagories</p>
					<div class="dark:bg-slate-800 hover:dark:bg-slate-900 w-2/3 md:w-auto multiselect">
						<form method="POST" action="?/updateUserCat" class="flex" use:enhance>
							<MultiSelect
								bind:selected
								options={data.catListStr}
								breakpoint={800}
								autoScroll={true}
								--sms-options-bg="#334155"
								--sms-text-color="white"
							/>
							<input type="hidden" name="catagories" value={CatArr2ID(selected)} />
							<button class="btn-primary btn"
								><svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									class="bi bi-save"
									viewBox="0 0 16 16"
								>
									<path
										d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"
									/>
								</svg>
								<p class="pl-2">save</p>
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</body></html
>
