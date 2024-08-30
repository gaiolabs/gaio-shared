<template>
	<div
		v-if="editor"
		class="report-tip-tap tiptap"
	>
		<div
			v-if="!edit"
			v-html="contentParse"
		/>
		<template v-else>
			<n-card
				content-style="padding:5px"
				content-class="border rounded"
			>
				<div class="flex items-center gap-1">
					<NButton
						quaternary
						size="tiny"
						:class="{ 'is-active': editor.isActive('bold') }"
						@click="editor.chain().focus().toggleBold().run()"
					>
						<g-app-icon name="icon-bold" />
					</NButton>
					<NButton
						quaternary
						size="tiny"
						:class="{ 'is-active': editor.isActive('italic') }"
						@click="editor.chain().focus().toggleItalic().run()"
					>
						<g-app-icon name="icon-italic" />
					</NButton>
					<NDivider vertical />
					<NButton
						quaternary
						size="tiny"
						:class="{ 'is-active': editor.isActive('strike') }"
						@click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
					>
						H1
					</NButton>
					<NButton
						quaternary
						size="tiny"
						:class="{ 'is-active': editor.isActive('strike') }"
						@click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
					>
						H2
					</NButton>
					<NButton
						quaternary
						size="tiny"
						:class="{ 'is-active': editor.isActive('strike') }"
						@click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
					>
						H3
					</NButton>
					<NButton
						quaternary
						size="tiny"
						:class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
						@click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
					>
						H4
					</NButton>
					<NButton
						quaternary
						size="tiny"
						:class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
						@click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
					>
						H5
					</NButton>
					<NButton
						quaternary
						size="tiny"
						:class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
						@click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
					>
						H6
					</NButton>

					<NDivider vertical />

					<NButton
						quaternary
						size="tiny"
						:class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
						@click="editor.chain().focus().setTextAlign('left').run()"
					>
						<g-app-icon name="icon-align-left" />
					</NButton>
					<NButton
						quaternary
						size="tiny"
						:class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
						@click="editor.chain().focus().setTextAlign('center').run()"
					>
						<g-app-icon name="icon-align-center" />
					</NButton>
					<NButton
						quaternary
						size="tiny"
						:class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
						@click="editor.chain().focus().setTextAlign('right').run()"
					>
						<g-app-icon name="icon-align-right" />
					</NButton>
					<NButton
						quaternary
						size="tiny"
						:class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
						@click="editor.chain().focus().setTextAlign('justify').run()"
					>
						<g-app-icon name="icon-align-justify" />
					</NButton>

					<NDivider vertical />

					<NButton
						quaternary
						size="tiny"
						:class="{ 'is-active': editor.isActive('bulletList') }"
						@click="editor.chain().focus().toggleBulletList().run()"
					>
						<g-app-icon name="icon-list-collapse" />
					</NButton>
					<NButton
						quaternary
						size="tiny"
						:class="{ 'is-active': editor.isActive('orderedList') }"
						@click="editor.chain().focus().toggleOrderedList().run()"
					>
						<g-app-icon name="icon-list-ordered" />
					</NButton>
					<NButton
						quaternary
						size="tiny"
						:class="{ 'is-active': editor.isActive('blockquote') }"
						@click="editor.chain().focus().toggleBlockquote().run()"
					>
						<g-app-icon name="icon-text-quote" />
					</NButton>

					<NDivider vertical />
					<NButton
						quaternary
						size="tiny"
						:class="{ 'is-active': editor.isActive('codeBlock') }"
						@click="editor.chain().focus().toggleCodeBlock().run()"
					>
						<g-app-icon name="icon-square-dashed-bottom-code" />
					</NButton>
					<NButton
						quaternary
						size="tiny"
						:class="{ 'is-active': editor.isActive('highlight') }"
						@click="editor.chain().focus().toggleHighlight().run()"
					>
						<g-app-icon name="icon-highlighter" />
					</NButton>
					<NButton
						quaternary
						size="tiny"
						@click="editor.chain().focus().setHorizontalRule().run()"
					>
						<g-app-icon name="icon-minus" />
					</NButton>
				</div>
			</n-card>
			<editor-content
				ref="editorRef"
				class="m-1"
				:editor="editor"
			/>
		</template>
	</div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'
import { parseTemplate } from '@gaio/shared/utils'
import Highlight from '@tiptap/extension-highlight'
import { Placeholder } from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { onBeforeUnmount, shallowRef, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
	content: {
		type: String,
		default: ''
	},
	edit: Boolean
})

const contentParse = computed(() => {
	return parseTemplate(editor.value.getHTML() || '', useAppStore().params)
})

const editorRef = shallowRef(null)
const editor = useEditor({
	extensions: [
		StarterKit,
		Placeholder.configure({
			placeholder: t('writeSomething')
		}),
		TextAlign.configure({
			types: ['heading', 'paragraph']
		}),
		Highlight
	],
	content: props.content
})

onBeforeUnmount(() => {
	if (editor) {
		editor.value.destroy()
	}
})
</script>

<style lang="scss">
.report-tip-tap {
	width: 100%;

	p.is-editor-empty:first-child::before {
		content: attr(data-placeholder);
		float: left;
		color: #adb5bd;
		pointer-events: none;
		height: 0;
	}

	:focus {
		outline: none;
	}

	blockquote,
	h1,
	h2,
	h3,
	h4,
	h5,
	ol,
	pre,
	ul {
		margin: 1rem 0;
	}

	p {
		margin: 0.1rem 0;
	}

	blockquote:first-child,
	h1:first-child,
	h2:first-child,
	h3:first-child,
	ol:first-child,
	p:first-child,
	pre:first-child,
	ul:first-child {
		margin-top: 0;
	}

	h1:first-child {
		padding-bottom: 1px;
		margin-bottom: 0.1rem;
	}

	blockquote:last-child,
	h1:last-child,
	h2:last-child,
	h3:last-child,
	ol:last-child,
	p:last-child,
	pre:last-child,
	ul:last-child {
		margin-bottom: 0;
	}

	h1,
	h2,
	h3,
	h4,
	h5 {
		line-height: 1.3;
	}

	h1 {
		font-size: 1.8rem;
	}

	h2 {
		font-size: 1.6rem;
	}

	h3 {
		font-size: 1rem;
	}

	h4 {
		font-size: 0.8rem;
	}

	h5 {
		font-size: 0.5rem;
	}

	ul[data-type='todo_list'] {
		padding-left: 0;
	}

	li[data-type='todo_item'] {
		display: flex;
		flex-direction: row;
	}

	.todo-checkbox {
		user-select: none;
		cursor: pointer;
		border-radius: 0.2em;
		background-color: transparent;
		transition: 0.4s background;
	}

	.todo-content {
		padding-left: 6px;
	}

	.todo-content > p:last-of-type {
		margin-bottom: 0;
	}

	.todo-content > ul[data-type='todo_list'] {
		margin: 0.5rem 0;
	}

	li[data-done='true'] > .todo-content > p {
		text-decoration: line-through;
	}

	li[data-done='false'] {
		text-decoration: none;
	}

	pre::before {
		content: attr(data-language);
		text-transform: uppercase;
		display: block;
		text-align: right;
		font-weight: bold;
		font-size: 0.8rem;
	}

	pre code .hljs-comment,
	pre code .hljs-quote {
		color: #999;
	}

	pre code .hljs-variable,
	pre code .hljs-template-variable,
	pre code .hljs-attribute,
	pre code .hljs-tag,
	pre code .hljs-name,
	pre code .hljs-regexp,
	pre code .hljs-link,
	pre code .hljs-selector-id,
	pre code .hljs-selector-class {
		color: #f2777a;
	}

	pre code .hljs-number,
	pre code .hljs-meta,
	pre code .hljs-built_in,
	pre code .hljs-builtin-name,
	pre code .hljs-literal,
	pre code .hljs-type,
	pre code .hljs-params {
		color: #f99157;
	}

	pre code .hljs-string,
	pre code .hljs-symbol,
	pre code .hljs-bullet {
		color: #9c9;
	}

	pre code .hljs-title,
	pre code .hljs-section {
		color: #fc6;
	}

	pre code .hljs-keyword,
	pre code .hljs-selector-tag {
		color: #69c;
	}

	pre code .hljs-emphasis {
		font-style: italic;
	}

	pre code .hljs-strong {
		font-weight: 700;
	}

	.tiptap > * + * {
		margin-top: 0.75em;
	}

	ul,
	ol {
		padding: 0 1rem;
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		line-height: 1.1;
	}

	code {
		background-color: #6161611a;
		color: #616161;
	}

	pre {
		background: #0d0d0d;
		color: #fff;
		font-family: JetBrainsMono, monospace;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
	}

	pre code {
		color: inherit;
		padding: 0;
		background: none;
		font-size: 0.8rem;
	}

	img {
		max-width: 100%;
		height: auto;
	}

	blockquote {
		padding-left: 1rem;
		border-left: 2px solid rgba(13, 13, 13, 0.1);
	}

	hr {
		border: none;
		border-top: 2px solid rgba(13, 13, 13, 0.1);
		margin: 5px 0;
	}
}
</style>
