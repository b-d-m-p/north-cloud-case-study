<script lang="ts">
	import logo from '$lib/images/north-cloud.svg';
</script>

<header
	class="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur"
>
	<div class="container flex h-14 max-w-5xl items-center justify-between">
		<div class="flex items-center">
			<div class="corner">
				<a href="https://north.cloud">
					<img src={logo} alt="North" />
				</a>
			</div>

			<div class="flex items-center gap-4">
				<button
					class="text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md p-2 md:hidden"
					aria-label="Open menu"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-6 w-6"
					>
						<line x1="4" x2="20" y1="12" y2="12" />
						<line x1="4" x2="20" y1="6" y2="6" />
						<line x1="4" x2="20" y1="18" y2="18" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</header>

<style>
</style>
