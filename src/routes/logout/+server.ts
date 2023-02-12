import {redirect} from `@sveltejs/kit`
import type {Actions} from './$types'
import { invalidate } from '$app/navigation';

export const POST = ({locals}) => {
    console.log("foo")
    if(locals.pb.authStore.isValid){
        console.log("bar")
        locals.pb.authStore.clear()
        locals.user = undefined
        throw redirect(303, '/')   
    } else {
        throw redirect(303, '/login') 
    }
};