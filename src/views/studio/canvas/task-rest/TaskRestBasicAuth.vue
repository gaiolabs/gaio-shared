<template>
    <div v-if="localTask" class="task-rest-basic-auth flex size-full flex-col p-4">
        <div class="control">
            <label class="control-label" for="username">
                Username
            </label>
            <n-input id="username" v-model:value="localTask.basicUsername" type="text" placeholder="" />
        </div>
        <div class="control">
            <label class="control-label" for="password">
                Password
            </label>
            <n-input id="password" v-model="localTask.basicPassword" type="password" placeholder="" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { RestTaskType } from '@gaio/shared/types'

const { localTask } = withDefaults(defineProps<{ localTask: RestTaskType }>(), { localTask: null })
</script>
