<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<!-- <div class="grid h-screen bg-wave-bg bg-cover aspect-auto w-auto bg-bottom place-items-center dark:bg-slate-700"><Login isSignIn={true}/></div> -->

<div
	class="border max-w-sm p-4 sm:p-6 lg:p-8 py-6 shadow-md rounded-lg w-full mt-6 bg-neutral mx-auto"
>
<h3 class="text-xl font-medium text-center">🌕Moonflower🌸</h3>
	<form method="POST" action="?/register" use:enhance class="flex flex-col items-center space-y-2 w-full ">
		<div class="form-control w-full max-w-xs">
			<label for="name" class="label font-medium pb-1">
				<span class="label-text">Name</span>
			</label>
			<input type="text" name="name" class="input input-bordered w-full max-w-xs" />
		</div>
		<div class="form-control w-full max-w-xs">
			<label for="email" class="label font-medium pb-1">
				<span class="label-text">Email</span>
			</label>
			<input type="email" name="email" class="input input-bordered w-full max-w-xs" />
		</div>
		<div class="form-control w-full max-w-xs">
			<label for="password" class="label font-medium pb-1">
				<span class="label-text">Password</span>
			</label>
			<input type="password" name="password" class="input input-bordered w-full max-w-xs" />
		</div>
		<div class="form-control w-full max-w-xs">
			<label for="passwordConfirm" class="label font-medium pb-1">
				<span class="label-text">Confirm Password</span>
			</label>
			<input type="password" name="passwordConfirm" class="input input-bordered w-full max-w-sm" />
		</div>
		<div class="w-full max-w-xs pt-3">
			<button class="btn btn-primary w-full max-w-xs">Sign up</button>
		</div>
	</form>
</div>
