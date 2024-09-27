<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="18"
		height="18"
		viewBox="0 0 18 18"
		shape-rendering="geometricPrecision"
		text-rendering="geometricPrecision"
		image-rendering="optimizeQuality"
		clip-rule="evenodd"
	>
		<g
			fill-rule="evenodd"
			stroke-linejoin="round"
			stroke-linecap="round"
			:fill="fill"
		>
			<defs :fill="fill"></defs>
			<g
				id="nccp1727445455627-4825404_Layer_x0020_1"
				:fill="fill"
			>
				<path
					class="fil0"
					d="M0 0H18V18H0z"
					fill="none"
				></path>
				<path
					class="fil0 str0"
					d="M14.906 1.125l-11.812 0c-1.243,0 -2.25,1.008 -2.25,2.25l0 7.875c0,1.242 1.007,2.25 2.25,2.25l2.25 -0.001 0 3.376 4.219 -3.376 5.343 0c1.244,0 2.25,-1.008 2.25,-2.25l0 -7.874c0,-1.242 -1.007,-2.25 -2.25,-2.25l0 0z"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-miterlimit="2.61313"
					fill="none"
					:stroke-width="strokewidth"
					:stroke="fill"
				></path>
				<g id="nccp1727445455627-4825404__1871473584">
					<path
						class="fil1 str0"
						d="M7.733 5.672c0.179,-0.686 0.739,-1.041 1.366,-1.009 0.618,0.032 1.194,0.373 1.168,1.162 -0.038,1.122 -1.296,0.917 -1.356,2.25"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-miterlimit="2.61313"
						fill="none"
						fill-rule="nonzero"
						:stroke-width="strokewidth"
						:stroke="_secondaryfill"
					></path>
					<path
						class="fil1 str0"
						d="M8.886 9.782L8.911 9.782"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-miterlimit="2.61313"
						fill="none"
						fill-rule="nonzero"
						:stroke-width="strokewidth"
						:stroke="_secondaryfill"
					></path>
				</g>
			</g>
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
