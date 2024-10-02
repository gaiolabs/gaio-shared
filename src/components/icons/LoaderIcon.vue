<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 18 18"
		height="18"
		width="18"
	>
		<g :fill="fill">
			<line
				x1="9"
				y1="1.75"
				x2="9"
				y2="4.25"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></line>
			<line
				x1="14.127"
				y1="3.873"
				x2="12.359"
				y2="5.641"
				fill="none"
				opacity=".88"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></line>
			<line
				x1="16.25"
				y1="9"
				x2="13.75"
				y2="9"
				fill="none"
				opacity=".75"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></line>
			<line
				x1="14.127"
				y1="14.127"
				x2="12.359"
				y2="12.359"
				fill="none"
				opacity=".63"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></line>
			<line
				x1="9"
				y1="16.25"
				x2="9"
				y2="13.75"
				fill="none"
				opacity=".5"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></line>
			<line
				x1="3.873"
				y1="14.127"
				x2="5.641"
				y2="12.359"
				fill="none"
				opacity=".38"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></line>
			<line
				x1="1.75"
				y1="9"
				x2="4.25"
				y2="9"
				fill="none"
				opacity=".25"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></line>
			<line
				x1="3.873"
				y1="3.873"
				x2="5.641"
				y2="5.641"
				fill="none"
				opacity=".13"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></line>
		</g>
	</svg>
</template>

<script>
export default {
	props: {
		strokewidth: {
			type: [Number, String],
			default: 1,
		},
		fill: {
			type: String,
			default: 'currentColor',
		},
		secondaryfill: {
			type: String,
			default: '#fff',
		},
	},
	computed: {
		_secondaryfill: function () {
			return this.secondaryfill || this.fill
		},
	},
}
</script>

<style scoped>
svg {
	animation: spin 1s steps(8) infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
