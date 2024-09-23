<template><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" height="18" width="18"><g :fill="fill"><line x1="4.724" y1="5.75" x2="13.276" y2="5.75" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="_secondaryfill"></line><path d="M5.25,1.75h7.5l.598,4.543c.346,2.626-1.699,4.957-4.348,4.957h0c-2.649,0-4.693-2.331-4.348-4.957l.598-4.543Z" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="fill"></path><line x1="5.75" y1="16.25" x2="12.25" y2="16.25" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="fill"></line><line x1="9" y1="11.25" x2="9" y2="16.25" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="fill"></line></g></svg></template>

<script>
export default {
	props: {
		strokewidth: {
			type: [Number, String],
			default: 1
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