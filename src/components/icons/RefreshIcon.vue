<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 18 18"
		height="18"
		width="18"
	>
		<g :fill="fill">
			<polyline
				points="5.25 9.5 3 7.25 .75 9.5"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></polyline>
			<path
				d="M13.762,13.048c-1.146,1.347-2.855,2.202-4.762,2.202-3.452,0-6.25-2.798-6.25-6.25,0-.597,.084-1.175,.24-1.722"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></path>
			<polyline
				points="12.75 8.5 15 10.75 17.25 8.5"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></polyline>
			<path
				d="M4.238,4.952c1.146-1.347,2.855-2.202,4.762-2.202,3.452,0,6.25,2.798,6.25,6.25,0,.579-.079,1.14-.226,1.672"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
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
