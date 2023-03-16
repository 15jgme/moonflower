<script lang="ts">
	import { enhance } from "$app/forms";
	import type { Snapshot } from "@sveltejs/kit";
	import toast, { Toaster } from 'svelte-french-toast';

	let formData = {
		username: '',
	}

	export const snapshot: Snapshot = {
		capture: () => formData,
		restore: (value) => {formData = value}
	}

	export let form: any;

	function onFormChange(){
		if(form?.error)
		{
			toast.error(form?.message);
			form.error = undefined;
			form.message = undefined;
			formData.username = form.username;
		}
	}

	// Pop the toast whenever we get a formchange
	$: form, onFormChange()
</script>

<title>Login</title>

<Toaster />
<!-- <div class="grid h-screen bg-wave-bg bg-cover aspect-auto w-auto bg-bottom place-items-center dark:bg-slate-700"><Login isSignIn={true}/></div> -->

<div
	class="border max-w-sm p-4 sm:p-6 lg:p-8 py-6 shadow-md rounded-lg w-full mt-6 bg-neutral mx-auto"
>
	<h3 class="text-xl font-medium text-center">🌕Moonflower🌸</h3>
	<form
		method="POST"
		action="?/login"
		use:enhance
		class="flex flex-col items-center space-y-2 w-full"
	>
		<div class="form-control w-full max-w-xs">
			<label for="username" class="label font-medium pb-1">
				<span class="label-text">Name</span>
			</label>
			<input type="text" name="username" bind:value={formData.username} class="input input-bordered w-full max-w-xs" />
		</div>
		<div class="form-control w-full max-w-xs">
			<label for="password" class="label font-medium pb-1">
				<span class="label-text">Password</span>
			</label>
			<input type="password" name="password" class="input input-bordered w-full max-w-xs" />
		</div>
		<div class="w-full max-w-xs pt-3">
			<button class="btn btn-primary w-full max-w-xs">Login</button>
		</div>
		<a href="/signup" class="link-accent">Don't have an account?</a>
	</form>
</div>
