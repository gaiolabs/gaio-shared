<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 18 18"
		height="18"
		width="18"
	>
		<g :fill="fill">
			<path
				d="M12.25 3.25l-1.5 0a2 2 0 0 0-2 2l0 7.5a2 2 0 0 0 2 2l1.5 0"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></path>
			<path
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M5.25 9l7 0"
				:stroke-width="strokewidth"
				:stroke="_secondaryfill"
			></path>
			<path
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M1.75 9.75l0-1.5q0-1 1-1l1.5 0q1 0 1 1l0 1.5q0 1-1 1l-1.5 0q-1 0-1-1z"
				:stroke-width="strokewidth"
				:stroke="fill"
			></path>
			<path
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12.25 15.5l0-1.5q0-1 1-1l1.5 0q1 0 1 1l0 1.5q0 1-1 1l-1.5 0q-1 0-1-1z"
				:stroke-width="strokewidth"
				:stroke="fill"
			></path>
			<path
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12.25 9.75l0-1.5q0-1 1-1l1.5 0q1 0 1 1l0 1.5q0 1-1 1l-1.5 0q-1 0-1-1z"
				:stroke-width="strokewidth"
				:stroke="fill"
			></path>
			<path
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12.25 4l0-1.5q0-1 1-1l1.5 0q1 0 1 1l0 1.5q0 1-1 1l-1.5 0q-1 0-1-1z"
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
