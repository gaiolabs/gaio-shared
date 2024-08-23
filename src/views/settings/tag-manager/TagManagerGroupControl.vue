<template>
    <g-dialog
        width="500px"
        @close="$emit('close')"
    >
        <template #title>{{ $t('group') }}</template>
        <template #content>
            <div class="task-sample overflow-auto">
                <div
                    v-if="localGroup"
                    class="tag-new-group"
                >
                    <div class="modal-body">
                        <div class="control">
                            <div class="control-label">
                                {{ $t('group') }}
                                <span v-if="localGroup.userId">#{{ localGroup.userId }}</span>
                            </div>
                            <n-input
                                v-model:value="localGroup.name"
                                :placeholder="$t('name')"
                            />
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <n-popconfirm
                            v-if="localGroup.userId"
                            :width="350"
                            :positive-text="$t('delete')"
                            :negative-text="$t('cancel')"
                            :title="$t('removeGroup')"
                            @positive-click="removeGroup()"
                        >
                            <template #activator>
                                <n-button text>
                                    <g-icon name="delete" />
                                </n-button>
                            </template>
                            {{ $t('removeGroup') }}
                        </n-popconfirm>
                        <div></div>
                        <n-button
                            type="primary"
                            :loading="loading"
                            :disabled="!isValid"
                            @click="save"
                        >
                            {{ $t('save') }}
                        </n-button>
                    </div>
                </div>
            </div>
        </template>
    </g-dialog>
</template>
<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { computed, onMounted, ref } from 'vue'

import useApi from '@/composables/useApi'

class TeamOptions {
    color?: string = '#1e90ff'
    icon?: string = 'bianji'
}

class Team {
    userId?: string = ''
    name?: string = ''
    options?: TeamOptions = new TeamOptions()
}

const emit = defineEmits(['close', 'save'])
const props = defineProps<{ current?: Team }>()

const localGroup = ref(new Team())
const loading = ref(false)

const save = async () => {
    loading.value = true
    await useApi().post('api/settings/tag/save-group', {
        body: {
            userData: localGroup.value
        }
    })
    emit('save')
}

const removeGroup = async () => {
    loading.value = true
    await useApi().post('api/settings/tag/delete-group', {
        body: {
            userData: localGroup.value
        }
    })
    emit('save')
}

const isValid = computed(() => {
    return localGroup.value.name && localGroup.value.name.length > 0
})

onMounted(() => {
    if (props.current && props.current.userId) {
        localGroup.value = cloneDeep(props.current)
    }
})
</script>

<style lang="scss">
.control .control-info {
    font-size: 12px !important;
    text-align: justify !important;
}
</style>
