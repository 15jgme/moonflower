<script lang="ts">
	import { currentUser, pb } from './pocketbase.js';
	import '../../app.css';

	let username: string;
	let password: string;
	let email: string;

	let loginStatus: Promise<any>;
	let loginMessage: string;

	async function login() {
		let user = await pb.collection('users').authWithPassword(username, password);
		return $currentUser?.name;
	}

	function handleLogin() {
		if (isSignIn) {
			loginStatus = signUp();
		} else {
			loginStatus = login();
		}
	}

	async function signUp() {
		try {
			const data = { username: username, password: password, passwordConfirm: password };
			const createdUser = await pb.collection('users').create(data);
			console.log(createdUser);

			await login();
			return createdUser;
		} catch (error) {
			return console.error();
		}
	}

	function signOut() {
		pb.authStore.clear();
	}

	export let isSignIn = true;
	if (isSignIn) {
		loginMessage = 'Signup for an account';
	} else {
		loginMessage = 'Login to your account';
	}
	signOut(); // signout if we reach this page
</script>

<div
	class="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700"
>
	<form on:submit|preventDefault class="space-y-6">
		<h3 class="text-xl font-medium text-gray-900 dark:text-white text-center">🌕Moonflower🌸</h3>
		<div>
			<label for="email" class="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
				>Username</label
			>
			<input
				bind:value={username}
				type="username"
				name="username"
				id="username"
				class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
				placeholder="Jane Smith"
				required
			/>
		</div>
		{#if isSignIn}
			<div>
				<label for="email" class="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
					>Your email</label
				>
				<input
					bind:value={email}
					type="email"
					name="email"
					id="email"
					placeholder="name@company.com"
					class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
					required
				/>
			</div>
		{/if}
		<div>
			<label for="password" class="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
				>Your password</label
			>
			<input
				bind:value={password}
				type="password"
				name="password"
				id="password"
				placeholder="••••••••"
				class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
				required
			/>
		</div>
		<div class="flex items-start">
			<div class="flex items-start scale-0">
				<div class="flex items-center h-5">
					<input
						id="remember"
						aria-describedby="remember"
						type="checkbox"
						class="bg-gray-50 border border-gray-300 focus:ring-3 focus:ring-orange-300 h-4 w-4 rounded dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-orange-600 dark:ring-offset-gray-800"
						required
					/>
				</div>
				<div class="text-sm ml-3">
					<label for="remember" class="font-medium text-gray-900 dark:text-gray-300"
						>Remember me</label
					>
				</div>
			</div>
			<a
				href="/lostpassword/"
				class="text-sm text-orange-700 hover:underline ml-auto dark:text-orange-500"
				>Lost Password?</a
			>
		</div>
		<div>
			{#await loginStatus}
				<button
					class="w-full flex text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-orange-800"
					disabled
					><svg class="animate-spin h-5 w-5 mr-3 fill-white" viewBox="0 0 24 24">
						<path
							d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
							class="spinner_P7sC"
						/>
					</svg>
					<p>Processing</p>
				</button>
			{:then}
				{#if $currentUser}
					<a
						href="/"
						class="w-full text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-orange-800"
						>Launch Moonflower</a
					>
				{:else}
					<button
						on:click={handleLogin}
						class="w-full text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-orange-800"
						>{loginMessage}</button
					>{/if}
			{:catch error}
				<button
					on:click={handleLogin}
					class="w-full text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-orange-800"
					><div>
						<p>{error.message}</p>
						<p>Try again.</p>
					</div></button
				>
			{/await}
		</div>
		{#if !isSignIn}
			<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
				Not registered? <a
					href="/signup/"
					class="text-orange-700 hover:underline dark:text-orange-500">Create account</a
				>
			</div>
		{/if}
	</form>
</div>
