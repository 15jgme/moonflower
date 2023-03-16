import { serializeNonPOJOProm } from '$lib/helpers.ts';
/** @type {import('./$types').PageLoad} */

async function updateState(lastReviewProm): boolean {
	const lastReview = await lastReviewProm;
	if (lastReview == undefined) {
		// If the user is brand-new, force advance to pick
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
		let paperFromCatagoriesUnavailable = undefined
		let cats: string[] = locals.user?.subscribedCats;
		const oneDayAgo = new Date(Date.now() - 86400000);
		let onDayAgo_str = oneDayAgo.getFullYear().toString()+"-"+((oneDayAgo.getMonth()+1).toString().length==2?(oneDayAgo.getMonth()+1).toString():"0"+(oneDayAgo.getMonth()+1).toString())+"-"+(oneDayAgo.getDate().toString().length==2?oneDayAgo.getDate().toString():"0"+oneDayAgo.getDate().toString())+" "+(oneDayAgo.getHours().toString().length==2?oneDayAgo.getHours().toString():"0"+oneDayAgo.getHours().toString())+":"+((parseInt(oneDayAgo.getMinutes()/5)*5).toString().length==2?(parseInt(oneDayAgo.getMinutes()/5)*5).toString():"0"+(parseInt(oneDayAgo.getMinutes()/5)*5).toString())+":00";

		let searchQuery = `created <= "${onDayAgo_str}" && `;
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
			paperFromCatagoriesUnavailable = true
		}

		// Update last picked post
		const data = {
			lastPickedPost: result.items[0].id
		};
		await locals.pb.collection('users').update(locals.user?.id, data);
		return {
			paperFromCatagoriesUnavailable: paperFromCatagoriesUnavailable,
			success: true,
			url: result.items[0].pdf_url,
			title: result.items[0].title,
			summary: result.items[0].summary,
			authors: result.items[0].authors
		};
	},
	addReview: async ({ request, locals }) => {
		const formData = await request.formData();
		const score = Object.fromEntries([...formData]).score;

		async function updateProfile() {
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
			return locals.pb.collection('users').update(locals.user.id, data2);
		}

		async function updateArticle() {
			// Update article stats
			const reviewArticle = await locals.pb
				.collection('articles')
				.getOne(locals.user.lastPickedPost);
			const data = {
				cumulativeRating: reviewArticle.cumulativeRating + score,
				numberOfRatings: reviewArticle.numberOfRatings + 1,
				avgRating: reviewArticle.avgRating + score / (reviewArticle.numberOfRatings + 1)
			};
			return locals.pb.collection('articles').update(locals.user.lastPickedPost, data);
		}

		Promise.all([updateProfile(), updateArticle()]).then((value) => {console.log(value)})
	}
};
