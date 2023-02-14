import {redirect} from `@sveltejs/kit`
import type {Actions} from './$types'
import {serializeNonPOJO} from '$lib/helpers.js'

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

    console.log(searchQuery)
  
    const resultList: Record[] = await locals.pb.collection('articles').getList(page, 20, {
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
        // console.log(data)
        return {
            articles: data
        }
    }

};

export const actions = {
    loadMore: async ({request, locals}) => {
        
		const formData = await request.formData();
		const {page, userCats} = Object.fromEntries([...formData]);
        console.log(locals.user?.subscribedCats)

        if(userCats){
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
        console.log(userCats)

        if(userCats == 'true'){
            console.log("foo")
            return {
                append: false,
                articles: await fetchArticles(locals,locals.user?.subscribedCats, 1)
            }
        } else {
            console.log("bar")
            return {
                append: false,
                articles: await fetchArticles(locals,undefined, 1)
            }
        }
    }
};

