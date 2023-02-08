import {redirect} from `@sveltejs/kit`
import type {Actions} from './$types'

export const load: PageLoad = async ({locals}) => {
    if(locals.pb.authStore.isValid)
    {
        throw redirect(303, '/')
    }
};

export const actions = {
    login: async ({request, locals}) => {
        const formData = await request.formData()
        const data = Object.fromEntries([...formData])
    
        try{
            const {token, user} = await locals.pb.collection('users').authWithPassword(data.username, data.password);
        }
        catch(error){
            console.error(error);
            throw error;
            return {
                error: true,
                email: data.email
            }
        }

        throw redirect(303, '/')
    },
}