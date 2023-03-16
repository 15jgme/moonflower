import {redirect} from `@sveltejs/kit`
import type {Actions} from './$types'
import {serializeNonPOJO} from '$lib/helpers.ts'
import { perPage } from './browseHelpers';

async function fetchArticles(locals, catagories: string[], page: number): Record[]{
    let searchQuery = ''

    if(catagories)
    {  
        for (let i = 0; i < catagories.length; i++) {
            searchQuery = searchQuery + "(catagories ~ '" + catagories[i] + "')";
            if (i < catagories.length - 1) {
                searchQuery = searchQuery + ' || ';
            }
        }
    }

    const resultList: Record[] = await locals.pb.collection('articles').getList(page, perPage, {
        filter: searchQuery,
        sort: '-created'
    });

    return serializeNonPOJO(resultList)
}

export const load: PageLoad = async ({locals}) => {

    if(locals.user){
        const data = await fetchArticles(locals,locals.user?.subscribedCats, 1)
        return {
            articles: data
        }
    } else {
        const data = await fetchArticles(locals,undefined, 1)
        return {
            articles: data
        }
    }

};

export const actions = {
    loadMore: async ({request, locals}) => {
        
		const formData = await request.formData();
		const {page, userCats} = Object.fromEntries([...formData]);

        if(userCats == 'true'){
            return {
                append: true,
                articles: await fetchArticles(locals,locals.user?.subscribedCats, page)
            }
        } else {
            return {
                append: true,
                articles: await fetchArticles(locals,undefined, page)
            }
        }
    }, 
    updateMethod: async ({request, locals}) => {
        
		const formData = await request.formData();
		const {userCats} = Object.fromEntries([...formData]);

        if(userCats == 'true'){
            return {
                append: false,
                articles: await fetchArticles(locals,locals.user?.subscribedCats, 1)
            }
        } else {
            return {
                append: false,
                articles: await fetchArticles(locals,undefined, 1)
            }
        }
    }
};

