<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 18 18"
		height="18"
		width="18"
	>
		<g :fill="fill">
			<path
				d="M11.001,11.384c-.882,1.42-2.456,2.366-4.251,2.366-2.761,0-5-2.239-5-5S3.989,3.75,6.75,3.75c.084,0,.167,.002,.25,.006"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></path>
			<line
				x1="14.25"
				y1="16.25"
				x2="10.285"
				y2="12.285"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></line>
			<polyline
				points="10.25 4.25 7.75 6.75 10.25 9.25"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></polyline>
			<path
				d="M7.75,6.75h6c1.381,0,2.5-1.119,2.5-2.5h0c0-1.381-1.119-2.5-2.5-2.5h-3"
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
