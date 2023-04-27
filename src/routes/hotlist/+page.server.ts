import {redirect} from `@sveltejs/kit`
import type {Actions} from './$types'
import {serializeNonPOJO} from '$lib/helpers.ts'

export const load: PageLoad = async ({locals}) => {

    const resultList: Record[] = await locals.pb.collection('articles').getList(1, 10, {
        filter: 'created >= "2022-01-01 00:00:00"',
        sort: '-avgRating'
    });
    return {
        articles: serializeNonPOJO(resultList)
    }

};

