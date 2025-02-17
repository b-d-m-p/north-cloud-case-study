<script lang="ts">
	import { Activity, Calendar, Download, DollarSign, Percent } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	import { scaleLinear } from 'd3-scale';
	import { onMount } from 'svelte';

	// Define types for our data structures
	type SavingsTrend = {
		month: string;
		savings: number;
	};

	type SavingCategory = {
		service: string;
		savings: number;
	};

	type DetailedSaving = {
		date: string;
		service: string;
		amount: number;
	};

	let data = $state({
		overview: {
			totalSavings: 0,
			currentMonthSavings: 0,
			percentageChange: 0
		},
		savingsTrends: [] as SavingsTrend[],
		savingsByCategory: [] as SavingCategory[],
		detailedSavings: [] as DetailedSaving[]
	});

	let monthlyAverage = $derived(
		data.savingsTrends.reduce((acc, curr) => acc + curr.savings, 0) / data.savingsTrends.length
	);

	// Chart variables
	const padding = { top: 20, right: 15, bottom: 20, left: 45 };
	let width = $state(500);
	let height = $state(350);
	const yTicks = [0, 50, 100, 150, 200, 250, 300];

	let xScale = $derived(
		scaleLinear()
			.domain([0, data.savingsTrends.length])
			.range([padding.left, width - padding.right])
	);

	let yScale = $derived(
		scaleLinear()
			.domain([0, Math.max.apply(null, yTicks)])
			.range([height - padding.bottom, padding.top])
	);

	let innerWidth = $derived(width - (padding.left + padding.right));
	let barWidth = $derived(innerWidth / data.savingsTrends.length);

	function formatMobile(tick: string) {
		return tick.substring(0, 3);
	}

	async function fetchData() {
		try {
			const response = await fetch('/api', {
				headers: {
					Authorization: import.meta.env.VITE_API_KEY
				}
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
			}

			const jsonData = await response.json();
			data = jsonData;
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	onMount(() => {
		fetchData();
	});
</script>

<div class="flex-1 space-y-4 p-8 pt-6">
	<div class="flex items-center justify-between space-y-2">
		<h2 class="font-redhat text-3xl tracking-tight">AWS Cloud Savings</h2>
		<div class="flex items-center space-x-2"></div>
	</div>

	<div class="h-0.5 rounded-full bg-gradient-to-r from-[#8C3FFF] to-[#00FFCB] shadow-sm"></div>

	<!-- Overview Cards -->
	<div class="dark bg-zenith rounded-lg p-4">
		<h2 class="text-lg text-white uppercase">Overview</h2>
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card.Root class="bg-bruma-800">
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium ">Monthly Average</Card.Title>
					<Activity class="text-muted-foreground h-4 w-4" />
				</Card.Header>
				<Card.Content>
					<div class="font-redhat text-2xl">${monthlyAverage.toFixed(2)}</div>
				</Card.Content>
			</Card.Root>

			<Card.Root class="bg-bruma-800">
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium ">Savings This Month</Card.Title>
					<Calendar class="text-muted-foreground h-4 w-4" />
				</Card.Header>
				<Card.Content>
					<div class="font-redhat text-2xl">+${data.overview.currentMonthSavings}</div>
				</Card.Content>
			</Card.Root>

			<Card.Root class="bg-bruma-800">
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium ">Percentage Change</Card.Title>
					<Percent class="text-muted-foreground h-4 w-4" />
				</Card.Header>
				<Card.Content>
					<div class="font-redhat text-2xl">{data.overview.percentageChange}%</div>
				</Card.Content>
			</Card.Root>

			<Card.Root class="bg-nebula border-nebula">
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium ">Total Savings</Card.Title>
					<DollarSign class="h-4 w-4 text-white " />
				</Card.Header>
				<Card.Content>
					<div class="font-redhat text-2xl">${data.overview.totalSavings}</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>

	<!-- Charts Section -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
		<Card.Root class="col-span-4">
			<Card.Header>
				<Card.Title>Monthly Saving Trends</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
					<svg>
						<!-- y axis -->
						<g class="axis y-axis">
							{#each yTicks as tick}
								<g class="text-xs" transform="translate(0, {yScale(tick)})">
									<text
										stroke="none"
										font-size="12"
										orientation="left"
										width="60"
										height="310"
										x="57"
										y="-4"
										fill="#888888"
										text-anchor="end"
									>
										<tspan x="36" dy="0.355em">${tick}</tspan>
									</text>
								</g>
							{/each}
						</g>

						<!-- x axis -->
						<g class="axis x-axis">
							{#each data.savingsTrends as point, i}
								<g class="text-xs" transform="translate({xScale(i)},{height})">
									<text
										stroke="none"
										font-size="12"
										orientation="bottom"
										width="531"
										height="30"
										x={barWidth / 2}
										y="-15"
										fill="#888888"
										text-anchor="middle"
									>
										<tspan x={barWidth / 2} dy="0.71em">
											{width > 380 ? point.month : formatMobile(point.month)}
										</tspan>
									</text>
								</g>
							{/each}
						</g>

						<!-- bars -->
						<g>
							{#each data.savingsTrends as point, i}
								<defs>
									<linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
										<stop offset="0%" style="stop-color:var(--color-start);stop-opacity:1" />
										<stop offset="100%" style="stop-color:var(--color-end);stop-opacity:1" />
									</linearGradient>
								</defs>

								<rect
									class="gradient-rect"
									x={xScale(i) + 2}
									y={yScale(point.savings)}
									width={barWidth - 8}
									height={yScale(0) - yScale(point.savings)}
									fill="currentColor"
									rx="4"
									ry="4"
								/>
							{/each}
						</g>
					</svg>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="col-span-3">
			<Card.Header>
				<Card.Title>Savings by AWS Service</Card.Title>
			</Card.Header>
			<Card.Content>
				<Table.Root>
					<Table.Body>
						{#each data.savingsByCategory as saving}
							<Table.Row>
								<Table.Cell class="font-medium">{saving.service}</Table.Cell>
								<Table.Cell class="font-redhat text-right">${saving.savings}</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Detailed Savings Table -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Detailed Savings</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="relative w-full overflow-auto rounded-lg border border-black/10">
				<table class="bg-light w-full caption-bottom rounded-lg text-sm">
					<thead>
						<tr class="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
							<th class="h-12 px-4 text-left align-middle font-medium">Date</th>
							<th class="h-12 px-4 text-left align-middle font-medium">Service</th>
							<th class="h-12 px-4 text-right align-middle font-medium">Savings Amount</th>
						</tr>
					</thead>
					<tbody>
						{#each data.detailedSavings as saving}
							<tr
								class="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
							>
								<td class="p-4 align-middle">{saving.date}</td>
								<td class="p-4 align-middle">{saving.service}</td>
								<td class="p-4 text-right">${saving.amount}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</Card.Content>
	</Card.Root>
</div>

<style>
	:global(body) {
		font-family: 'Satoshi', sans-serif;
	}

	:global(.red-hat) {
		font-family: 'Red Hat Mono,', sans-serif;
	}

	.chart {
		width: 100%;
		margin: 0 auto;
	}

	svg {
		position: relative;
		width: 100%;
		height: 350px;
	}

	rect {
		max-width: 51px;
	}

	.gradient-rect {
		fill: url(#barGradient);
	}

	#barGradient {
		--color-start: var(--color-nebula);
		--color-end: var(--color-nebula-100);
	}
</style>
