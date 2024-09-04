<template>
	<i
		:data-ref="name"
		:data-name="list[name]"
	>
		<Icon
			v-if="list[name]"
			:icon="list[name]"
			:color="color"
			:style="{ fontSize }"
		/>
		<Icon
			v-else
			:icon="list['home']"
			:color="color"
			data-icon="missing-icon"
			:style="{ fontSize }"
		/>
	</i>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

const {
	name = undefined,
	color = undefined,
	height = 16
} = defineProps<{ name: keyof typeof list; color?: string; height?: number }>()

const fontSize = computed(() => {
	return height ? `${height}px` : 'inherit'
})

const list = {
	tableThunder: 'fluent:table-lightning-20-regular',
	dialog: 'material-symbols:select-window-2-outline',
	desktop: 'octicon:device-desktop-24',
	mobile: 'streamline:phone-mobile-phone-android-phone-mobile-device-smartphone-iphone',
	tablet: 'carbon:tablet-landscape',
	resize: 'tabler:resize',
	fullscreen: 'mingcute:fullscreen-line',
	settings: 'carbon:settings',
	group: 'material-symbols-light:group-work-outline',
	check: 'material-symbols-light:check-box-outline-blank',
	checked: 'material-symbols-light:check-box-outline-rounded',
	checkAll: 'material-symbols-light:library-add-check-outline',
	eraser: 'fluent:square-eraser-20-regular',
	download: 'ph:download',
	addUser: 'tabler:user-plus',
	setupSettings: 'streamline:computer-chip-1',
	settingsLogs: 'icon-park-outline:sales-report',
	monit: 'mdi:monitor-eye',
	appShare: 'ant-design:appstore-outlined',
	shieldAccount: 'solar:shield-user-outline',
	sun: 'material-symbols-light:sunny-outline',
	moon: 'material-symbols:dark-mode-outline',
	email: 'carbon:email',
	user: 'carbon:user-avatar',
	editLayout: 'tabler:layout-grid-add',
	addRowUp: 'tabler:row-insert-bottom',
	insights: 'ic:outline-insights',
	addRowDown: 'tabler:row-insert-top',
	removeRow: 'tabler:row-remove',
	addColumn: 'material-symbols:variable-add-outline-rounded',
	removeColumn: 'material-symbols:variable-remove-outline-rounded',
	lineText: 'iconoir:input-field',
	lineNumber: 'fluent:keyboard-123-20-regular',
	radio: 'material-symbols-light:radio-button-checked-outline',
	inputRadio: 'material-symbols-light:radio-button-checked-outline',
	checkbox: 'ion:ios-checkbox-outline',
	inputCheckbox: 'ion:ios-checkbox-outline',
	select: 'gg:select-r',
	inputSelect: 'gg:select-r',
	date: 'material-symbols:calendar-today-outline',
	inputDate: 'material-symbols:calendar-today-outline',
	datetime: 'material-symbols:calendar-clock-outline',
	inputDatetime: 'material-symbols:calendar-clock-outline',
	time: 'material-symbols:alarm-outline',
	inputTime: 'material-symbols:alarm-outline',
	slide: 'iconoir:control-slider',
	inputSlide: 'iconoir:control-slider',
	description: 'ic:baseline-text-format',
	divider: 'ic:sharp-horizontal-rule',
	total: 'material-symbols-light:nest-thermostat-e-eu-outline',
	limitRows: 'ic:baseline-playlist-add',
	save: 'ph:floppy-disk',
	palette: 'mingcute:palette-2-line',
	label: 'material-symbols:bookmark-outline-rounded',
	legend: 'carbon:legend',
	xAxis: 'tabler:axis-x',
	yAxis: 'tabler:axis-y',
	margin: 'tabler:box-margin',
	general: 'carbon:settings-check',
	cardTitle: 'material-symbols:subtitles-outline',
	downloadFile: 'carbon:cloud-download',
	formOption: 'tabler:forms',
	rowsPerPage: 'ph:rows-light',
	filterCheck: 'tabler:filter-check',
	bar: 'carbon:chart-bar',
	line: 'ph:chart-line',
	area: 'material-symbols:area-chart-outline-rounded',
	column: 'carbon:chart-column',
	pie: 'ph:chart-pie-slice',
	donut: 'tabler:chart-donut-4',
	treemap: 'carbon:chart-treemap',
	bubble: 'carbon:chart-bubble',
	funnel: 'ant-design:funnel-plot-outlined',
	heatmap: 'oui:heatmap',
	gauge: 'ic:outline-speed',
	sunburst: 'carbon:chart-sunburst',
	crossTable: 'carbon:table-alias',
	table: 'carbon:table-split',
	cardStats: 'iconoir:stats-report',
	radar: 'carbon:chart-radar',
	scatter: 'carbon:chart-scatter',
	brush: 'fluent:paint-brush-24-regular',
	exchange: 'tabler:arrows-exchange',
	calendarOff: 'material-symbols-light:event-busy-outline',
	calendarOn: 'material-symbols-light:event-available-outline',
	cronEdit: 'material-symbols-light:edit-calendar-outline-rounded',
	clone: 'ion:duplicate-outline',
	id: 'material-symbols-light:code-blocks-outline',
	refresh: 'iconamoon:synchronize-light',
	add: 'material-symbols:new-window-rounded',
	hidden: 'formkit:hidden',
	createFlow: 'material-symbols-light:flowsheet-outline',
	createFolder: 'ph:folder-plus',
	powerAll: 'carbon:ibm-secure-infrastructure-on-vpc-for-regulated-industries',
	powerStory: 'ph:slideshow',
	powerContext: 'solar:layers-broken',
	powerView: 'ic:outline-auto-graph',
	meta: 'ion:layers-outline',
	power: 'carbon:ibm-secure-infrastructure-on-vpc-for-regulated-industries',
	powerSearch: 'solar:card-search-bold-duotone',
	eye: 'tabler:eye',
	addCheck: 'material-symbols:note-stack-add-outline',
	edit: 'material-symbols-light:edit-square-outline-rounded',
	filter: 'tabler:filter-search',
	having: 'tabler:filter-down',
	handle: 'radix-icons:drag-handle-horizontal',
	addFilter: 'tabler:filter-plus',
	sql: 'ph:file-sql-duotone',
	folder: 'ph:folder-duotone',
	sort: 'solar:square-sort-vertical-broken',
	columns: 'iconoir:view-columns-2',
	logs: 'material-symbols:report-outline-rounded',
	addAction: 'majesticons:applications-add-line',
	run: 'uil:play',
	runAll: 'uil:forward',
	runFromHere: 'uil:skip-forward-alt',
	aggregated: 'tabler:sum',
	imageSearch: 'ic:twotone-image-search',
	magic: 'solar:magic-stick-3-bold-duotone',
	folderOpened: 'ph:folder-notch-open-duotone',
	plusRound: 'ph:plus-circle-duotone',
	search: 'ph:magnifying-glass',
	command: 'ph:command-duotone',
	home: 'ph:house-duotone',
	star: 'ph:star-duotone',
	starFilled: 'ph:star-fill-duotone',
	options: 'ph:sliders-duotone',
	workflow: 'ph:share-network-duotone',
	tasks: 'carbon:cicsplex',
	taskList: 'mdi:touch-text-outline',
	params: 'ph:sliders-duotone',
	forms: 'fluent:task-list-square-rtl-24-regular',
	files: 'heroicons:archive-box',
	chat: 'ph:chat-centered-duotone',
	app: 'solar:graph-new-line-duotone',
	apps: 'solar:graph-new-line-duotone',
	treeFolder: 'lucide:folder-tree',
	trendDown: 'material-symbols:trending-down-rounded',
	trendUp: 'material-symbols:trending-up-rounded',
	database: 'ph:database-light',
	source: 'material-symbols:database-outline',
	bucket: 'material-symbols:home-storage-outline-sharp',
	dashboard: 'material-symbols-light:space-dashboard-outline',
	window: 'bi:window-stack',
	pencil: 'ph:pencil-simple-duotone',
	allApps: 'solar:layers-line-duotone',
	mysql: 'devicon-plain:mysql',
	join: 'carbon:join-inner',
	innerJoin: 'carbon:join-inner',
	leftJoin: 'carbon:join-left',
	rightJoin: 'carbon:join-right',
	fullJoin: 'carbon:join-full',
	write: 'material-symbols-light:edit-document-outline',
	timer: 'material-symbols:timer-outline',
	builder: 'material-symbols:join-outline',
	staticContent: 'ph:file-text-duotone',
	report: 'majesticons:file-report-line',
	flow: 'carbon:network-2',
	full: 'ic:round-fullscreen',
	arrowLeft: 'ic:outline-keyboard-arrow-left',
	arrowRight: 'ic:outline-keyboard-arrow-right',
	arrowUp: 'ic:outline-keyboard-arrow-up',
	arrowDown: 'ic:outline-keyboard-arrow-down',
	grid: 'circum:grid-4-1',
	list: 'ic:sharp-menu',
	verticalMore: 'ic:sharp-more-vert',
	more: 'ic:sharp-more-horiz',
	unfold: 'ic:sharp-unfold-more',
	close: 'material-symbols:close-rounded',
	panelFull: 'lucide:chevron-up-square',
	panelBottom: 'gg:chevron-down-r',
	typeText: 'ic:twotone-text-fields',
	typeInteger: 'ph:hash-bold',
	typeDate: 'material-symbols-light:calendar-month',
	typeDatetime: 'tabler:calendar-clock',
	typeDecimal: 'material-symbols:decimal-increase-rounded',
	typeArray: 'material-symbols:data-array-rounded',
	typeJson: 'mdi:code-json',
	computed: 'ph:terminal-window-light',
	globalComputed: 'tabler:world-code',
	task: 'solar:share-circle-line-duotone',
	delete: 'ph:trash-simple-duotone',
	deleteTag: 'mynaui:delete',
	pin: 'material-symbols:push-pin-outline',
	unpin: 'material-symbols:push-pin-off-outline',
	plus: 'tabler:plus',
	clock: 'lucide:clock',
	info: 'mynaui:info-square',
	summarize: 'material-symbols:calculate-outline',
	link: 'tdesign:link',
	formatValue: 'material-symbols:decimal-increase',
	style: 'ic:outline-style',
	fontStyle: 'material-symbols:font-download-outline-rounded',
	dynamic: 'material-symbols:dynamic-feed',
	share: 'ph:share-network',
	panelRight: 'fluent:panel-right-32-filled',
	panelLeft: 'fluent:panel-left-32-filled'
}
</script>

<style scoped>
i {
	all: unset;
	display: inline-block;
	vertical-align: text-top;
	line-height: v-bind(fontSize) !important;

	svg {
		line-height: 1em;
	}
}
</style>
