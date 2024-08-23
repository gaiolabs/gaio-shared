<template>
    <div class="home-account min-h-[246px] min-w-[300px] pt-1">
        <n-tabs
            type="segment"
            animated
            size="small"
        >
            <n-tab-pane
                name="account"
                :tab="$t('account')"
            >
                <home-account-profile />
            </n-tab-pane>
            <n-tab-pane
                name="password"
                :tab="$t('password')"
            >
                <home-account-password />
            </n-tab-pane>
        </n-tabs>
    </div>
</template>
<script setup lang="ts">
import HomeAccountPassword from '@/views/home/HomeAccountPassword.vue'
import HomeAccountProfile from '@/views/home/HomeAccountProfile.vue'
</script>
