<template><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18">
		<title>{{ title }}</title>
		<g :fill="fill">
			<path
				d="M2.088,10.132c-.45-.683-.45-1.582,0-2.265,1.018-1.543,3.262-4.118,6.912-4.118s5.895,2.574,6.912,4.118c.45,.683,.45,1.582,0,2.265-1.018,1.543-3.262,4.118-6.912,4.118s-5.895-2.574-6.912-4.118Z"
				fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :stroke="fill"></path>
			<circle cx="9" cy="9" r="2.75" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
				:stroke="_secondaryfill"></circle>
		</g>
	</svg></template>
<script>
export default {
	props: {
		title: {
			type: String,
			default: "eye"
		},
		fill: {
			type: String,
			default: "currentColor"
		},
		secondaryfill: {
			type: String
		}
	},
	computed: {
		_secondaryfill: function () {
			return this.secondaryfill || this.fill
		}
	}
}
</script>