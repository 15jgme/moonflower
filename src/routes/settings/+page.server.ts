import { serializeNonPOJO } from '$lib/helpers.js';

function handle_catRecord(record: Record[]): string[] {
	let catListProc: string[] = [];
	let catIDMap = {};
	let IDcatMap = {};
	record.forEach((cat) => {
		catListProc.push(cat.catagory);
		catIDMap[cat.catagory] = cat.id;
		IDcatMap[cat.id] = cat.catagory;
	});
	return { catListStr: catListProc, IDcatMap: IDcatMap, catIDMap: catIDMap };
}

export const load: PageServerLoad = async ({ locals }) => {
	const preSelected: string[] = [];
	// let userDat = await locals.pb.collection('users').getOne(locals.user.id);
	const catList = await locals.pb.collection('catagories').getFullList(200 /* batch size */, {
		sort: '-created'
	});
    
	const {catListStr, IDcatMap, catIDMap} = handle_catRecord(catList);
	const catListFetched = true;
	locals.user.subscribedCats.forEach((cat: string) => {
		// Fetch selections from server
		preSelected.push(IDcatMap[cat]);
	});
	const selected = preSelected;

	return serializeNonPOJO({
		selected: selected,
		catListStr: catListStr,
		catList: catList,
        catIDMap: catIDMap
	});
};

export const actions = {
	updateUserCat: async ({ request, locals }) => {
        const formData = await request.formData();
		const {catagories, catIDMap} = Object.fromEntries([...formData]);
        const catagoriesArr = catagories.split(',')
		if (catagoriesArr) {
			const data = {
				subscribedCats: catagoriesArr
			};
			await locals.pb.collection('users').update(locals.user.id, data);
		}
	}
};
