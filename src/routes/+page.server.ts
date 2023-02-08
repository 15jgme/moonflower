import { serializeNonPOJOProm } from '$lib/helpers.js';
import { currentUser, currentState, stateEnum } from '$lib/components/pocketbase.js';
/** @type {import('./$types').PageLoad} */

async function updateState( lastReviewProm ): boolean {
	const lastReview = await lastReviewProm;
	if (lastReview == undefined) {
		// If the user is brand-new, force advance to pick
        console.log("No existing review")
		return true;
	}
	const lastPostTimeDT = new Date(lastReview.created);
	const nextPostTime = lastPostTimeDT.setDate(lastPostTimeDT.getDate() + 1);
	const timerExpired = nextPostTime - Date.now() < 0;
	const seconds_rem = (nextPostTime - Date.now()) / 1000;

	const remaining = {
		hours: Math.trunc(seconds_rem / 3600),
		minutes: Math.trunc((seconds_rem % 3600) / 60)
	};

	if (timerExpired) {
		return true;
	}

	return false;
}

export const load: PageLoad = async ({ locals }) => {
	if (locals.pb.authStore.isValid) {
		// From pocketbase we fetch the users last article and last review
		// We also determine the initial app state, whether or not we are waiting on the timer
        
		const lastReviewProm = locals.pb.collection('reviews').getOne(locals.user.lastReview);

		return {
			timerExpired: updateState(lastReviewProm),
			lastReviewRecord: serializeNonPOJOProm(lastReviewProm),
			lastArticleRecord: serializeNonPOJOProm(
				locals.pb.collection('articles').getOne(locals.user.lastPickedPost)
			),
            newUser: locals.user.lastReview == ''
		};
	}
};

export const actions = {
	fetchRandomPaper: async ({ locals }) => {
		let cats: string[] = locals.user?.subscribedCats;
		let searchQuery = '';
		for (let i = 0; i < cats.length; i++) {
			searchQuery = searchQuery + "(catagories ~ '" + cats[i] + "')";
			if (i < cats.length - 1) {
				searchQuery = searchQuery + ' || ';
			}
		}
		let result = await locals.pb
			.collection('articles')
			.getList(1, 50, { sort: '@random', filter: searchQuery });

		if (result.items[0] == undefined) {
			result = await locals.pb.collection('articles').getList(1, 50, { sort: '@random' }); // fetch anything
		}

		// Update last picked post
		const data = {
			lastPickedPost: result.items[0].id
		};
		await locals.pb.collection('users').update(locals.user?.id, data);
		currentState.set(stateEnum.AWAITVIEW); // Update state to wait for user to view on arxive
		console.log('Paper fetched');
		return {
			success: true,
			url: result.items[0].pdf_url,
			title: result.items[0].title,
			summary: result.items[0].summary
		};
	},
	addReview: async ({ request, locals }) => {
		const formData = await request.formData();
		const score = Object.fromEntries([...formData]).score;

		console.log(score);

		const data = {
			rating: score,
			reviewer: locals.user.id,
			article: locals.user.lastPickedPost
		};
		const reviewRec = await locals.pb.collection('reviews').create(data);

		// example update data
		const data2 = {
			lastReview: reviewRec.id
		};
		await locals.pb.collection('users').update(locals.user.id, data2);
	}
};
