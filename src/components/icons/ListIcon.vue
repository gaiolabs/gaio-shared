<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 18 18"
		height="18"
		width="18"
	>
		<g :fill="fill">
			<circle
				cx="3.75"
				cy="9"
				r="1.5"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></circle>
			<line
				x1="8.25"
				y1="9"
				x2="15.75"
				y2="9"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></line>
			<circle
				cx="3.75"
				cy="3.75"
				r="1.5"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></circle>
			<line
				x1="8.25"
				y1="3.75"
				x2="15.75"
				y2="3.75"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></line>
			<circle
				cx="3.75"
				cy="14.25"
				r="1.5"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></circle>
			<line
				x1="8.25"
				y1="14.25"
				x2="15.75"
				y2="14.25"
				fill="none"
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
