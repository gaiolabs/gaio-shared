<template>
    <div class="sidebar-form-more">
        <div class="flex items-center justify-between">
            <n-dropdown
                trigger="hover"
                :options="options"
                @select="handleSelect"
            >
                <n-button
                    text
                    size="tiny"
                >
                    <template #icon>
                        <g-icon name="more" />
                    </template>
                </n-button>
            </n-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import useDefault from '@/composables/useDefault'
import { useAppStore } from '@/stores'

const emit = defineEmits(['choose', 'edit'])
const props = defineProps<{
    formId: string
}>()

const { t } = useI18n()

const options = [
    { label: t('edit'), key: 'edit' },
    { label: t('useForm'), key: 'useForm' },
    { label: t('duplicate'), key: 'duplicate' },
    { label: t('delete'), key: 'delete' }
]

const handleSelect = (ev) => {
    const form = useAppStore().forms.find((form) => form.formId === props.formId)
    if (ev === 'useForm') {
        useAppStore().task = useDefault({
            type: 'form',
            base: {
                ...useAppStore().appInfo,
                formId: form.formId
            }
        })
        emit('choose', { reportType: 'form' })
    } else {
        emit('edit', form)
    }
}
</script>
