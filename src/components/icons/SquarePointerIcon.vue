<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 18 18"
		height="18"
		width="18"
	>
		<g :fill="fill">
			<path
				d="m15.25,8.9592v-4.2092c0-1.1045-.8954-2-2-2H4.75c-1.1046,0-2,.8955-2,2v8.5c0,1.1045.8954,2,2,2h4.2094"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="fill"
			></path>
			<path
				d="m10.184,9.77l6.854,2.504c.289.106.28.517-.012.611l-3.137,1.004-1.004,3.137c-.094.293-.505.301-.611.012l-2.504-6.854c-.094-.258.156-.508.414-.414Z"
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
