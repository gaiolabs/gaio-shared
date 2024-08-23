<template>
    <g-dialog
        :width="'350px'"
        @close="$emit('close')"
    >
        <template #title>
            {{ $t('icon') }}
        </template>
        <template #content>
            <div class="h-[400px] max-w-[400px]">
                <n-input
                    v-model:value="searchTerm"
                    placeholder="Search"
                    class="mb-2"
                />
                <div class="app-control-icon flex flex-wrap gap-2">
                    <template
                        v-for="item in iconListFiltered"
                        :key="item.value"
                    >
                        <g-app-icon
                            v-if="item.value"
                            :name="item.value"
                            :size="24"
                            @click="select"
                        />
                    </template>
                </div>
            </div>
        </template>
    </g-dialog>
</template>

<script setup lang="ts">
import { shuffle, take } from 'lodash-es'
import { computed, ref } from 'vue'
import { iconList } from './AppControlIconList'
import useHelper from '@/composables/useHelper'

const emit = defineEmits(['close', 'choose'])

const { filterBy } = useHelper()

const select = (name: string) => {
    emit('choose', name)
    emit('close')
}

const searchTerm = ref('')
const sortedList = shuffle(iconList)

const iconListFiltered = computed(() => {
    return take(
        filterBy(
            sortedList.map((o) => ({ value: o })),
            'value',
            searchTerm.value
        ),
        100
    )
})
</script>
