import { defineStore } from 'pinia'
import { ref } from 'vue'

type LicenseType = {
    userLimit: number
}

export const useConfigStore = defineStore('config', () => {
    const license = ref<LicenseType>({
        userLimit: 0
    })
    return { license }
})
