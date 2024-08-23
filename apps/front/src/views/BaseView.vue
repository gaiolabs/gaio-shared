<template>
    <div
        data-name="task-table-"
        class="base-view flex h-full w-full items-center justify-center"
    >
        <div class="flex gap-3">
            <g-dialog width="400px">
                <template #title>My Title</template>
                <template #content>
                    <div class="flex flex-col items-center justify-center gap-1">
                        <div class="flex gap-2">
                            <div
                                class="text-elevation-1"
                                @click="$router.push('home')"
                            >
                                {{ $t('home') }}
                            </div>
                            -
                            <div
                                class="text-elevation-1"
                                @click="$router.push('login')"
                            >
                                {{ $t('login') }}
                            </div>
                        </div>
                        <div class="m-4 w-full">
                            <n-select
                                :options="list"
                                :placeholder="$t('table')"
                            />
                        </div>
                    </div>
                    <div class="bg-paper-100 px-4 py-2 dark:bg-carbon-200">Footer</div>
                </template>
            </g-dialog>
        </div>
    </div>
</template>
<script setup lang="ts">
const list = [{ label: 'Text', value: 'Text' }]
</script>
