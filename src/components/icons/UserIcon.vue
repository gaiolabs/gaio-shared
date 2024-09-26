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
				cy="7.75"
				r="2"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></circle>
			<path
				d="M5.154,15.147c.479-1.673,2.019-2.897,3.846-2.897s3.367,1.224,3.846,2.897"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></path>
			<circle
				cx="9"
				cy="9"
				r="7.25"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
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
