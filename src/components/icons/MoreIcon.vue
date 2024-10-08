<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 18 18"
		height="18"
		width="18"
	>
		<g :fill="fill">
			<circle
				cx="9"
				cy="9"
				r=".5"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:fill="_secondaryfill"
				:stroke="_secondaryfill"
			></circle>
			<circle
				cx="9"
				cy="3.25"
				r=".5"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:fill="fill"
				:stroke="fill"
			></circle>
			<circle
				cx="9"
				cy="14.75"
				r=".5"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:fill="fill"
				:stroke="fill"
			></circle>
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
			default: 'currentColor',
		},
	},
	computed: {
		_secondaryfill: function () {
			return this.secondaryfill || this.fill
		},
	},
}
</script>
