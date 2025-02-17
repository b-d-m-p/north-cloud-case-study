<script lang="ts">
	import { Activity, Calendar, Download, DollarSign, Percent } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	// import DatePickerWithRange from "$lib/components/date-picker-with-range.svelte";
	import {
		LineChart,
		Line,
		XAxis,
		YAxis,
		CartesianGrid,
		Tooltip,
		Legend,
		ResponsiveContainer,
		BarChart,
		Bar
	} from 'recharts';
	import { onMount } from 'svelte';

	let data = $state({
		overview: {
			totalSavings: 0,
			currentMonthSavings: 0,
			percentageChange: 0
		},
		savingsTrends: [],
		savingsByCategory: [],
		detailedSavings: []
	});

	let monthlyAverage = $derived(
		data.savingsTrends.reduce((acc, curr) => acc + curr.savings, 0) / data.savingsTrends.length
	);

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
			data = jsonData; // Update the state with the fetched data
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	// Load data when component mounts
	onMount(() => {
		fetchData();
	});
</script>

<div class="flex-1 space-y-4 p-8 pt-6">
	<div class="flex items-center justify-between space-y-2">
		<h2 class="font-redhat text-3xl tracking-tight">AWS Cloud Savings</h2>
		<div class="flex items-center space-x-2">
			<!-- <DatePickerWithRange /> -->
			<!-- <Button size="sm">
				<Download class="mr-2 h-4 w-4" />
				Download Report
			</Button> -->
		</div>
	</div>

	<div class="h-0.5 rounded-full bg-gradient-to-r from-[#8C3FFF] to-[#00FFCB] shadow-sm"></div>

	<!-- Overview Cards -->
	<div class="dark bg-zenith grid gap-4 rounded-lg p-4 md:grid-cols-2 lg:grid-cols-4">
		<Card.Root class="bg-bruma-800">
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium ">Monthly Average</Card.Title>
				<Activity class="text-muted-foreground h-4 w-4" />
			</Card.Header>
			<Card.Content>
				<div class="font-redhat text-2xl">${monthlyAverage.toFixed(2)}</div>
				<p class="text-muted-foreground text-xs">+20.1 from last month</p>
			</Card.Content>
		</Card.Root>

		<Card.Root class="bg-bruma-800">
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium ">Savings This Month</Card.Title>
				<Calendar class="text-muted-foreground h-4 w-4" />
			</Card.Header>
			<Card.Content>
				<div class="font-redhat text-2xl">+${data.overview.currentMonthSavings}</div>
				<p class="text-muted-foreground text-xs">+180.1% from last month</p>
			</Card.Content>
		</Card.Root>

		<Card.Root class="bg-bruma-800">
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium ">Percentage Change</Card.Title>
				<Percent class="text-muted-foreground h-4 w-4" />
			</Card.Header>
			<Card.Content>
				<div class="font-redhat text-2xl">{data.overview.percentageChange}%</div>
				<p class="text-muted-foreground text-xs">+19% from last month</p>
			</Card.Content>
		</Card.Root>

		<Card.Root class="bg-nebula border-nebula">
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium ">Total Savings</Card.Title>
				<DollarSign class="h-4 w-4 text-white " />
			</Card.Header>
			<Card.Content>
				<div class="font-redhat text-2xl">${data.overview.totalSavings}</div>
				<p class="text-xs text-white">+201 since last hour</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Charts Section -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
		<Card.Root class="col-span-4">
			<Card.Header>
				<Card.Title>Monthly Saving Trends</Card.Title>
			</Card.Header>
			<Card.Content>
				<!-- <ResponsiveContainer width="100%" height={350}>
					<LineChart data={data.savingsTrends}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="month" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Line type="monotone" dataKey="savings" stroke="#8884d8" />
					</LineChart>
				</ResponsiveContainer> -->
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
							<th class="h-12 px-4 text-right align-middle font-medium"> Savings Amount</th>
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
</style>
