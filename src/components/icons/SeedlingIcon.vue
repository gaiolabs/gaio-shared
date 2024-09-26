<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 18 18"
		height="18"
		width="18"
	>
		<g :fill="fill">
			<path
				d="M9,8.25h-1.25c-2.761,0-5-2.239-5-5h0c0-.276,0-.5,0-.5h2.25c2.209,0,4,1.791,4,4v1.5Z"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></path>
			<line
				x1="9"
				y1="15.25"
				x2="9"
				y2="10"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></line>
			<path
				d="M11.5,10.092c2.156-.555,3.75-2.513,3.75-4.842h0c0-.276,0-.5,0-.5h-2.25c-2.209,0-4,1.791-4,4v1.5"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></path>
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
