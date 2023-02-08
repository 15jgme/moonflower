import { serializeNonPOJO } from "$lib/helpers.js";

export const load: PageLoad = async ({locals}) => {
    if(locals.user){
        return {
            user: serializeNonPOJO(locals.user)
        }
    }
};