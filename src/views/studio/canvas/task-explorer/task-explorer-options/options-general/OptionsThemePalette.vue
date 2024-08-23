<template>
    <div
        :key="localKey"
        class="explorer-settings-global-chart-colors"
    >
        <div class="clearfix control">
            <n-page-header
                :subtitle="$t('palette')"
                @back="$emit('close')"
            />
        </div>
        <div>
            <div
                v-for="(theme, themeIndex) in localTheme"
                :key="themeIndex"
                :style="{ background: theme.backgroundColor }"
                class="theme-color-bar"
                @click="$emit('save', theme)"
            >
                <span
                    v-if="!theme.default"
                    class="color-block color-remove"
                    style="width: 20px; height: 20px; min-width: 20px; max-width: 20px"
                >
                    <g-icon
                        name="delete"
                        @click="removePalette(themeIndex)"
                    />
                </span>
                <span
                    v-for="(color, colorIndex) in theme.colors"
                    :key="colorIndex"
                    class="color-block"
                    :style="{ background: color }"
                />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'

import { useAppStore } from '@/stores'

import { optionsThemePalette } from './OptionsThemePalette'

defineEmits(['close', 'save'])

const localKey = ref('any')

const removePalette = (index) => {
    const options = useAppStore().app.options || {}

    if (!options['palette']) {
        options['palette'] = []
    }

    options['palette'].splice(index, 1)

    // http.post('/app/update-options', {
    //     appId: this.$store.state.app.app.appId,
    //     options: options
    // }).then(() => (this.localKey = generateId(6)))
}

const options = computed(() => {
    return useAppStore().app.options || { palette: [] }
})

const localTheme = computed(() => {
    const palette = options.value.palette || []

    return [
        ...(palette.map((pal) => {
            return {
                ...pal,
                default: false
            }
        }) || []),
        ...optionsThemePalette.map((th) => {
            return {
                default: true,
                ...th
            }
        })
    ]
})
</script>

<style lang="scss">
.theme-color-bar {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    width: auto;
    height: 32px;
    overflow: hidden;
    border: 1px solid #eee;
    padding: 5px;
    border-radius: 4px;
    margin: 5px 0 8px;
    cursor: pointer;
    box-sizing: border-box;

    &.selected {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        border-color: #c12e34;
        border-width: 2px;
    }

    .color-block {
        width: 20px;
        height: 20px;
        margin-left: 2px;
        margin-right: 2px;
        flex: 1;
        border-radius: 3px;
        margin-bottom: 10px;
    }

    .color-remove {
        padding: 0;
        display: flex;
        align-items: center;
    }
}
</style>
