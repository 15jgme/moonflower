<script lang="ts">
	import MultiSelect from 'svelte-multiselect';
	import { currentUser } from '$lib/components/pocketbase.js';
	import { pb } from '$lib/components/pocketbase';
	import type { Record } from 'pocketbase';
	import { onMount } from 'svelte';

	let catIDMap: { [id: string]: string } = {};
    let IDcatMap: { [id: string]: string } = {};
	let selected: any;

	// let catList: Promise<any>;
	let catListLoadProm = Promise<string[]>;
	let catListFetched: boolean = false;
	let catListStr: string[] = [];

	onMount(async () => {
		let preSelected: string[] = [];
		// let userDat = await pb.collection('users').getOne($currentUser?.id);
		let catList = await pb.collection('catagories').getFullList(200 /* batch size */, {
			sort: '-created'
		});
		catListStr = handle_catRecord(catList);
		catListFetched = true;
        $currentUser?.subscribedCats.forEach((cat: string) => {
			// Fetch selections from server
			preSelected.push(IDcatMap[cat]);
		});
		selected = preSelected;
	});

	function handle_catRecord(record: Record[]): string[] {
		let catListProc: string[] = [];
		catIDMap = {};
        IDcatMap = {};
		record.forEach((cat) => {
			catListProc.push(cat.catagory);
			catIDMap[cat.catagory] = cat.id;
            IDcatMap[cat.id] = cat.catagory;
		});
		return catListProc;
	}

	async function updateUserCat() {
		if (catListFetched) {
			let catIDList: string[] = [];
			selected?.forEach((cat: string) => {
				catIDList.push(catIDMap[cat]);
			});
			const data = {
				subscribedCats: catIDList
			};
			await pb.collection('users').update($currentUser?.id, data);
		}
	}

	$: selected, updateUserCat();
</script>

<div class="">
	<div class="items-center justify-center flex flex-col multiselect">
		<p class="text-white">⭐ Favourite catagories</p>
		{#if catListFetched}
			<div class="dark:bg-slate-800 hover:dark:bg-slate-900 w-2/3 md:w-auto multiselect">
				<MultiSelect
					bind:selected
					options={catListStr}
					breakpoint={800}
					autoScroll={true}
					--sms-options-bg="#334155"
					--sms-text-color="white"
					
				/>
			</div>
		{:else}
			<button
				class="flex text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-orange-800"
				disabled
				><svg class="animate-spin h-5 w-5 mr-3 fill-white" viewBox="0 0 24 24">
					<path
						d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
						class="spinner_P7sC"
					/>
				</svg>
				<p>Processing</p>
			</button>
		{/if}
	</div>
</div>
