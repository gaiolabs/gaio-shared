<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 18 18"
		height="18"
		width="18"
	>
		<g :fill="fill">
			<path
				d="M1.75,4.25H7.336c.265,0,.52,.105,.707,.293l5.793,5.793c.781,.781,.781,2.047,0,2.828l-3.172,3.172c-.781,.781-2.047,.781-2.828,0L2.043,10.543c-.188-.188-.293-.442-.293-.707V4.25Z"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></path>
			<path
				d="M3.25,1.75v-.5h5.586c.265,0,.52,.105,.707,.293l5.793,5.793c.432,.432,.625,1.012,.579,1.577"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></path>
			<circle
				cx="5.25"
				cy="7.75"
				r="1.25"
				stroke="none"
				:fill="_secondaryfill"
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
