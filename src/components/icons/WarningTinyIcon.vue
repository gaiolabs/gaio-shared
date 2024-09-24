<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 12 12"
		height="12"
		width="12"
	>
		<g :fill="fill">
			<circle
				cx="6"
				cy="10.125"
				r=".875"
				stroke-width="0"
				:fill="_secondaryfill"
			></circle>
			<line
				x1="6"
				y1="4.75"
				x2="6"
				y2="7.75"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.1"
				:stroke="_secondaryfill"
			></line>
			<path
				d="m8.625,10.25h1.164c1.123,0,1.826-1.216,1.265-2.189L7.265,1.484c-.562-.975-1.969-.975-2.53,0L.946,8.061c-.561.973.142,2.189,1.265,2.189h1.164"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.1"
				:stroke="fill"
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
