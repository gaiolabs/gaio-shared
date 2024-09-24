<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 18 18"
		height="18"
		width="18"
	>
		<g :fill="fill">
			<rect
				x="2"
				y="11"
				width="5"
				height="3.5"
				rx="1"
				ry="1"
				transform="translate(-8.25 17.25) rotate(-90)"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></rect>
			<rect
				x="9.5"
				y="9.5"
				width="5"
				height="6.5"
				rx="1"
				ry="1"
				transform="translate(-.75 24.75) rotate(-90)"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></rect>
			<rect
				x="11"
				y="3.5"
				width="5"
				height="3.5"
				rx="1"
				ry="1"
				transform="translate(18.75 -8.25) rotate(90)"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></rect>
			<rect
				x="3.5"
				y="2"
				width="5"
				height="6.5"
				rx="1"
				ry="1"
				transform="translate(11.25 -.75) rotate(90)"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></rect>
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
