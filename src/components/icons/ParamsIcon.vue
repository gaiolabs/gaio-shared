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
				cy="11"
				r="1.75"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></circle>
			<line
				x1="9"
				y1="15.25"
				x2="9"
				y2="16.25"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></line>
			<line
				x1="9"
				y1="1.75"
				x2="9"
				y2="9"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></line>
			<circle
				cx="14.25"
				cy="6.75"
				r="1.75"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></circle>
			<line
				x1="14.25"
				y1="5"
				x2="14.25"
				y2="1.75"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></line>
			<line
				x1="14.25"
				y1="16.25"
				x2="14.25"
				y2="11.25"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></line>
			<circle
				cx="3.75"
				cy="6.75"
				r="1.75"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></circle>
			<line
				x1="3.75"
				y1="5"
				x2="3.75"
				y2="1.75"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></line>
			<line
				x1="3.75"
				y1="16.25"
				x2="3.75"
				y2="11.25"
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
