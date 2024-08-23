<template>
    <div class="m-3 flex flex-wrap gap-2">
        <div
            v-for="field of usePowerStore().filteredContextField"
            :key="field.id"
        >
            <v-tag
                :field="field"
                @click="addTag(field)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { FieldType } from '@gaio/types'

import { usePowerStore } from '@/stores'

const addTag = (field: FieldType) => {
    if (!usePowerStore().tags) {
        usePowerStore().tags = []
    }

    usePowerStore().tags.push({
        ...field,
        variant: usePowerStore().searchTerm
    })

    usePowerStore().currentPanel = 'report'
}
</script>
