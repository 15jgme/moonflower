import {redirect} from "@sveltejs/kit"

export const load: PageLoad = ({locals}) => {
    if(locals.pb.authStore.isValid)
    {
        // throw redirect(303, '/')
    }
};

/**
 * Creates a `POST /login` server-side endpoint
 *
 * @type {import('./$types').RequestHandler}
 */
export const actions = {
    register: async({locals, request}) => {
        const formData = await request.formData()
        const data = Object.fromEntries([...formData])

        try {
            const newUser = await locals.pb.collection('users').create(data)
        } catch(err) {
            console.log('Error:', err)
            return {
                error: true,
                message: err.toString()
            }
        }

        throw redirect(303, '/login')
    }
};