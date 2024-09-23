<template><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" height="18" width="18"><g :fill="fill"><line x1="9" y1="1.25" x2="9" y2="2.25" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="_secondaryfill"></line><line x1="14.48" y1="3.52" x2="13.773" y2="4.227" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="_secondaryfill"></line><line x1="16.75" y1="9" x2="15.75" y2="9" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="_secondaryfill"></line><line x1="14.48" y1="14.48" x2="13.773" y2="13.773" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="_secondaryfill"></line><line x1="9" y1="16.75" x2="9" y2="15.75" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="_secondaryfill"></line><line x1="3.52" y1="14.48" x2="4.227" y2="13.773" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="_secondaryfill"></line><line x1="1.25" y1="9" x2="2.25" y2="9" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="_secondaryfill"></line><line x1="3.52" y1="3.52" x2="4.227" y2="4.227" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="_secondaryfill"></line><circle cx="9" cy="9" r="4.25" fill="none" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokewidth" :stroke="fill"></circle></g></svg></template>

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