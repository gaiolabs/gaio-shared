<template><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" height="18" width="18"><g :fill="fill"><line x1="15.25" y1="9" x2="16.25" y2="9" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="_secondaryfill"></line><line x1="1.75" y1="9" x2="9" y2="9" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="_secondaryfill"></line><line x1="5" y1="3.75" x2="1.75" y2="3.75" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="fill"></line><line x1="16.25" y1="3.75" x2="11.25" y2="3.75" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="fill"></line><line x1="5" y1="14.25" x2="1.75" y2="14.25" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="fill"></line><line x1="16.25" y1="14.25" x2="11.25" y2="14.25" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="fill"></line><circle cx="11" cy="9" r="1.75" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="_secondaryfill"></circle><circle cx="6.75" cy="3.75" r="1.75" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="fill"></circle><circle cx="6.75" cy="14.25" r="1.75" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="fill"></circle></g></svg></template>

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