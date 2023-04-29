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
            const result = await locals.pb.collection('users').requestPasswordReset(data.email);
        }
        catch(error){
            return {
                error: true,
                message: "Invalid email",
                username: data.email
            }
        }
        throw redirect(303, '/')
    },
}