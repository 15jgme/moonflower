import {redirect} from `@sveltejs/kit`
import type {Actions} from './$types'

export const load: PageLoad = async ({locals}) => {
    if(locals.pb.authStore.isValid){
        locals.pb.authStore.clear()
        throw redirect(303, '/')
    } else {
        throw redirect(303, '/login') 
    }
};