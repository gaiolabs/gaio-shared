import { VueI18n } from 'vue-i18n'

import type { mixin } from '@/mixin'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $t: VueI18n['t']

        $filterBy: typeof mixin.methods.$filterBy
        $alpha: typeof mixin.methods.$alpha
        // if you also use $i18n property:
        $i18n: VueI18n
    }
}
