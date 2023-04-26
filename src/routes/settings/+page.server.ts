import { serializeNonPOJO } from '$lib/helpers.ts';
import { json } from '@sveltejs/kit';

interface Catagory {
	value: string,
	label: string,
	group: string,
	id: string,
}


export const load: PageServerLoad = async ({ locals }) => {
	let usersCatagories: Catagory[] = [] // Catagories the user has selected
	let availableCatagories: Catagory[] = [] // Catagories the user has not selected
	let allCatagories: Catagory[] = [] // All catagories
	// allCatagories is the union of usersCatagories and availableCatagories

	const catList = await locals.pb.collection('catagories').getFullList(200 /* batch size */, {
		sort: '-created'
	});

	catList.forEach((catagory_raw: any) => {
		allCatagories.push({ value: catagory_raw.catagory, label: catagory_raw.description, group: catagory_raw.field, id: catagory_raw.id })
	});
	
	locals.user.subscribedCats.forEach((cat: string) => {
		// Fetch selections from server
		let catagory_from_id: Catagory | undefined = allCatagories.find(i => i.id === cat); // Get additional catagory info by ID from main list
		if (catagory_from_id !== undefined) {
			usersCatagories.push(catagory_from_id);
		}

	});
	// End of new logic

	// New logic, find catagories that are not in the user catagories list
	availableCatagories = allCatagories.filter(item => usersCatagories.indexOf(item) < 0);
	// End of new logic

	return serializeNonPOJO({
		catList: catList,
		usersCatagories: usersCatagories,
		availableCatagories: availableCatagories,
		allCatagories: allCatagories,
	});
};

export const actions = {
	addCatagories: async ({ request, locals }) => {
		const formData = await request.formData();
		const { catagories } = Object.fromEntries([...formData]);

		let user_catagories_to_patch = locals.user.subscribedCats;
		let catagories_parsed = JSON.parse(catagories)
		catagories_parsed.forEach(catagory => {
			user_catagories_to_patch.push(catagory.id)
		});
		console.log(user_catagories_to_patch)
		await locals.pb.collection('users').update(locals.user.id, {
			subscribedCats: user_catagories_to_patch
		});

	},
	removeCatagories: async ({ request, locals }) => {
		const formData = await request.formData()
		console.log(formData)
		const usersCatagories_raw = Object.fromEntries([...formData]);
		let ids_to_remove = Object.keys(usersCatagories_raw)

		let new_subscribedCats = locals.user.subscribedCats.filter( ( el ) => !ids_to_remove.includes( el ) );
		// console.log(new_subscribedCats)

		if (usersCatagories_raw) {
			const data = {
				subscribedCats: new_subscribedCats
			};
			await locals.pb.collection('users').update(locals.user.id, data);
		}
	}
};
