import { redirect } from '@sveltejs/kit';
import * as EmailValidator from 'email-validator';

export const load: PageLoad = ({ locals }) => {
	if (locals.pb.authStore.isValid) {
		// throw redirect(303, '/')
	}
};

/**
 * Creates a `POST /login` server-side endpoint
 *
 * @type {import('./$types').RequestHandler}
 */
export const actions = {
	register: async ({ locals, request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries([...formData]);

		if (!EmailValidator.validate(data.email)) {
			// Email is invalid
			return {
				error: true,
				message: 'Invalid email',
				name: data?.username,
				email: data?.email
			};
		} else if (data?.username.toString().includes('@') || data?.username.toString().includes(' ')) {
			// Username is invalid
			return {
				error: true,
				message: 'Username cannot contain spaces or special characters',
				username: data.username,
				email: data.email
			};
		} else if (data?.password != data?.passwordConfirm) {
			// Passwords don't match
			return {
				error: true,
				message: "Password doesn't match password confirm",
				username: data.username,
				email: data.email
			};
		} else if ([...data?.password].length < 8) {
			// Passwords don't match
			return {
				error: true,
				message: "Passwords must be no less than 8 characters",
				username: data.username,
				email: data.email
			};
		}

		try {
			const newUser = await locals.pb.collection('users').create(data)
		} catch (err) {
			console.log('Error:', err);
			return {
				error: true,
				message: err?.data.message.toString(),
				username: data.username,
				email: data.email
			};
		}

		throw redirect(303, '/login');
	}
};
