<script lang="ts">

	type Props = {
		id?: string;
		value?: number;
		label?: string;
		max?: number;
		min?: number;
		className?: string;
		zeroCountClassName?: string;
		negativeCountClassName?: string;
		positiveCountClassName?: string;
		onChange?: (count: number) => void;
	};

	let {
		id,
		value = $bindable(0),
		label = 'Add',
		min = 0,
		max = 10,
		className = '',
		zeroCountClassName = '',
		negativeCountClassName = '',
		positiveCountClassName = '',
		onChange
	}: Props = $props();


	function handleClick(val: number) {
		value += val;
		if (value > max) value = max;
		if (value < min) value = min;
		onChange && onChange(value);
	}

	function handleInput() {
		if (value > max) value = max;
		if (value < min) value = min;
		onChange && onChange(value);
	}

	$effect(() => {
		value = value;
	});
</script>

{#if value == 0}
	<button
		{id}
		type="button"
		class=" w-20 min-w-20 py-1 flex justify-center text-primary border-primary font-blod border rounded dark:border-base-400 dark:bg-base-600 dark:text-base-300 {className} {zeroCountClassName}"
		onclick={() => handleClick(1)}
	>
		{label}
	</button>
{:else}
	<div
		{id}
		class="w-20 min-w-20 flex items-center justify-between bg-primary text-white font-blod border rounded dark:border-base-400 dark:bg-base-600 {value >=
		0
			? positiveCountClassName
			: negativeCountClassName}"
	>
		<div>
			<button
				type="button"
				class="px-2 py-1"
				onclick={() => handleClick(-1)}
				disabled={value == min}
			>
				-
			</button>
		</div>
		<div>
			<input
				class="w-8 text-center appearance-none !ring-0 outline-0 border-none p-0 m-0 bg-transparent"
				name="value"
				type="number"
				step="1"
				{max}
				{min}
				oninput={handleInput}
				bind:value={value}
			/>
		</div>
		<div>
			<button
				type="button"
				class="px-2 py-1"
				onclick={() => handleClick(1)}
				disabled={value == max}
			>
				+
			</button>
		</div>
	</div>
{/if}
