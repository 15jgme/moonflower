<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { Snapshot } from '@sveltejs/kit';
	import toast, { Toaster } from 'svelte-french-toast';
	import { scale } from 'svelte/transition';

	let loading: boolean = false;

	let formData = {
		username: ''
	};

	export const snapshot: Snapshot = {
		capture: () => formData,
		restore: (value) => {
			formData = value;
		}
	};

	let user_sent_reset: boolean = false;

</script>

<title>Login</title>

<Toaster />
<!-- <div class="grid h-screen bg-wave-bg bg-cover aspect-auto w-auto bg-bottom place-items-center dark:bg-slate-700"><Login isSignIn={true}/></div> -->

<div
	class="border max-w-sm p-4 sm:p-6 lg:p-8 py-6 shadow-md rounded-lg w-full mt-6 bg-neutral mx-auto"
>
<h3 class="text-xl font-medium text-base-100 text-center">🌕Moonflower🌸</h3>
	<form
		method="POST"
		action="?/login"
		use:enhance={({ form, data, action, cancel, submitter }) => {
			if (!loading) {
				loading = true;
			}
			return async ({ result, update }) => {
				if (loading) {
					loading = false;
				}
				if (result?.data?.error) {
					toast.error(result.data.message);
				}
				update();
				invalidateAll();
				user_sent_reset = true;
			};
		}}
		class="flex flex-col items-center space-y-2 w-full"
	>
		<div class="form-control w-full max-w-xs">
			<label for="username" class="label font-medium pb-1">
				<span class="label-text text-base-100">Email</span>
			</label>
			<input
				type="email"
				name="email"
				bind:value={formData.email}
				class="input input-bordered w-full max-w-xs"
			/>
		</div>
		<div class="w-full max-w-xs pt-3">
			<button class="btn btn-primary w-full max-w-xs">Send reset email</button>
		</div>
		<a href="/login" class="link-accent">Log in</a>
	</form>
	{#if user_sent_reset}
		<p class="font-medium text-base-100 text-center">
			Reset email sent! Please check your junk folder
		</p>
	{/if}
	
	{#if loading}
		<div role="status" class="items-center justify-center flex flex-col py-1" transition:scale>
			<svg
				aria-hidden="true"
				class="w-8 h-8 mr-2 text-neutral animate-spin fill-primary"
				viewBox="0 0 100 101"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
					fill="currentColor"
				/>
				<path
					d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
					fill="currentFill"
				/>
			</svg>
		</div>
	{/if}
</div>
