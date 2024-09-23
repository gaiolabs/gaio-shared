<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 18 18"
		height="18"
		width="18"
	>
		<g :fill="fill">
			<path
				d="M14.75,12.25v-1.5c0-1.105-.895-2-2-2H5.25c-1.105,0-2,.895-2,2v1.5"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></path>
			<line
				x1="9"
				y1="5.25"
				x2="9"
				y2="12.25"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></line>
			<rect
				x="7.25"
				y="1.75"
				width="3.5"
				height="3.5"
				rx="1"
				ry="1"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></rect>
			<rect
				x="1.5"
				y="12.25"
				width="3.5"
				height="3.5"
				rx="1"
				ry="1"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></rect>
			<rect
				x="7.25"
				y="12.25"
				width="3.5"
				height="3.5"
				rx="1"
				ry="1"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></rect>
			<rect
				x="13"
				y="12.25"
				width="3.5"
				height="3.5"
				rx="1"
				ry="1"
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
