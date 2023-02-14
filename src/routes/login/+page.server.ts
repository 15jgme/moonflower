import {redirect} from `@sveltejs/kit`
import type {Actions} from './$types'
import { browser } from '$app/environment'

export const load: PageLoad = async ({locals}) => {
    if(locals.pb.authStore.isValid)
    {
        throw redirect(302, '/')
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
            return {
                error: true,
                message: "Incorrect username or password",
                username: data.username
            }
        }
        throw redirect(303, '/')
    },
}