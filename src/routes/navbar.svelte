<div class="navbar bg-base-100">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost normal-case text-xl">🌕Moonflower🌸</a>
	</div>
	<div class="flex-none">
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<div class="dropdown dropdown-end">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label tabindex="0" class="btn btn-ghost btn-circle">
				<div class="indicator">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
						/>
					</svg>
				</div>
			</label>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<ul
				tabindex="0"
				class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
			>
				<li>
					<!-- svelte-ignore a11y-missing-attribute -->
					<a class="justify-between">
						Profile
						<!-- <span class="badge">New</span> -->
					</a>
				</li>
				<li><a href="/settings">Settings</a></li>
				<li><a href="/logout">Logout</a></li>
			</ul>
		</div>
	</div>
</div>
