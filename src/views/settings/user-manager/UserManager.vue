<template>
    <settings-view>
        <template #title>
            <div>
                <g-icon name="user" :height="22" />
                {{ $t('users') }}
            </div>
        </template>
        <div :key="localKey" class="user-manager">
            <template v-if="loading">
                <n-space vertical>
                    <n-skeleton :height="30" class="rounded" />
                    <n-skeleton :height="90" class="rounded" />
                </n-space>
            </template>
            <template v-else>
                <div class="g-bg-1 mb-3 flex items-center justify-between rounded p-2 shadow">
                    <div class="flex grow items-center justify-start gap-2">
                        <template v-if="numberOfUsers <= userLimit">
                            <n-button type="primary" @click="addUser()">
                                <template #icon>
                                    <g-icon name="addUser" />
                                </template>
                            </n-button>
                            <n-divider vertical />
                        </template>
                        <n-input v-model:value="searchTerm" :placeholder="$t('filter')" clearable
                            style="max-width: 300px" />
                        <n-divider vertical />
                        <n-tooltip>
                            <template #trigger>
                                <n-button color="#333" style="color: #fff" @click="filterRole = 'admin'">
                                    A
                                </n-button>
                            </template>
                            {{ $t('admin') }}
                        </n-tooltip>
                        <n-tooltip>
                            <template #trigger>
                                <n-button color="#1976d2" style="color: #fff" @click="filterRole = 'dev'">
                                    D
                                </n-button>
                            </template>
                            {{ $t('developer') }}
                        </n-tooltip>
                        <n-tooltip>
                            <template #trigger>
                                <n-button color="#e91e63" style="color: #fff" @click="filterRole = 'user'">
                                    U
                                </n-button>
                            </template>
                            {{ $t('user') }}
                        </n-tooltip>
                        <n-tooltip>
                            <template #trigger>
                                <n-button color="#ccc" style="color: #222" @click="filterRole = ''">
                                    C
                                </n-button>
                            </template>
                            {{ $t('clear') }}
                        </n-tooltip>
                    </div>
                    <div class="flex items-center justify-between gap-2">
                        <n-select v-model:value="filterGroup" class="w-[150px]" filterable
                            :placeholder="$t('filterByGroup')" value-field="userId" label-field="name"
                            :options="groups" />
                        <n-divider vertical />
                        <n-select v-if="hasSelected" v-model:value="bulkGroup" class="w-[210px]" filterable multiple
                            collapse-tags value-field="userId" label-field="name" :options="groups"
                            :placeholder="$t('teams')" />
                        <n-divider v-if="hasSelected" vertical />
                        <template v-if="hasSelected">
                            <n-popconfirm :width="350" :positive-text="$t('delete')" :negative-text="$t('cancel')"
                                @positive-click="removeAllSelected()">
                                <template #activator>
                                    <span>
                                        <n-button type="error">
                                            {{ $t('deleteSelected') }}
                                        </n-button>
                                    </span>
                                </template>
                                <div>
                                    {{ $t('deleteSelectedMessage') }}
                                </div>
                            </n-popconfirm>
                        </template>
                        <n-input-number v-model:value="size" :step="5" style="margin-left: 5px; min-width: 90px" />
                        <n-tooltip :persistent="false">
                            <template #trigger>
                                <n-button tertiary @click="downloadUsers()">
                                    <template #icon>
                                        <g-icon name="download" />
                                    </template>
                                </n-button>
                            </template>
                            {{ $t('download') }}
                        </n-tooltip>
                    </div>
                </div>
                <g-alert v-if="numberOfUsers >= userLimit" type="error" class="mb-2" :title="$t('maxUserReached')" />
                <div v-if="filterApplied" class="g-bg-1 rounded p-2 shadow">
                    <n-table>
                        <thead>
                            <tr>
                                <th style="width: 40px" class="!text-center">
                                    <n-checkbox v-model:checked="selectAll" @update:checked="onSelectAll()" />
                                </th>
                                <th style="width: 45px">{{ $t('type') }}</th>
                                <th style="width: 70px">ID</th>
                                <th>{{ $t('name') }}</th>
                                <th>{{ $t('email') }}</th>
                                <th style="width: 220px">{{ $t('group') }}</th>
                                <th style="width: 62px">
                                    {{ $t('status') }}
                                </th>
                                <th style="width: 40px"></th>
                            </tr>
                        </thead>
                        <tbody :key="searchTerm">
                            <tr v-for="user of myUsers" :key="user.userId">
                                <td class="text-center" style="width: 40px">
                                    <n-checkbox v-model="user['selected']" />
                                </td>
                                <td :key="user.role" class="text-center">
                                    <n-tooltip v-if="user.role === 'admin'" :persistent="false" :show-after="1500">
                                        <template #trigger>
                                            <n-button size="tiny" color="#333" style="color: #fff"
                                                @click="changeRole(user)">
                                                A
                                            </n-button>
                                        </template>
                                        {{ t('admin') }}
                                    </n-tooltip>
                                    <n-tooltip v-else-if="user.role === 'dev'" :persistent="false">
                                        <template #trigger>
                                            <n-button size="tiny" color="#1976d2" style="color: #fff"
                                                @click="changeRole(user)">
                                                D
                                            </n-button>
                                        </template>
                                        {{ t('developer') }}
                                    </n-tooltip>
                                    <n-tooltip v-else :persistent="false" :show-after="1500">
                                        <template #trigger>
                                            <n-button size="tiny" color="#e91e63" style="color: #fff"
                                                @click="changeRole(user)">
                                                U
                                            </n-button>
                                        </template>
                                        {{ t('user') }}
                                    </n-tooltip>
                                </td>
                                <td>{{ user.userId }}</td>
                                <td>
                                    <n-button text type="primary" @click="selectAndEditUser(user)">
                                        {{ user.name }}
                                    </n-button>
                                </td>
                                <td>{{ user.email }}</td>
                                <td>
                                    <n-select :key="user.userId"
                                        v-model:value="users[users.findIndex((o) => o.userId === user.userId)].tags"
                                        filterable multiple collapse-tags :options="groups" value-field="userId"
                                        label-field="name" @update:value="
                                            saveSingleUser(users[users.findIndex((o) => o.userId === user.userId)])
                                            " />
                                </td>
                                <td class="text-center">
                                    <n-switch
                                        v-model:value="users[users.findIndex((o) => o.userId === user.userId)].status"
                                        checked-value="active" unchecked-value="inactive" @update:value="
                                            globalChangeUser(users[users.findIndex((o) => o.userId === user.userId)])
                                            ">
                                        <template #checked>{{ $t('active') }}</template>
                                        <template #unchecked>{{ $t('inactive') }}</template>
                                    </n-switch>
                                </td>
                                <td class="text-center">
                                    <n-popconfirm :width="350" :positive-text="$t('delete')"
                                        :negative-text="$t('cancel')" @positive-click="removeUser(user.userId)">
                                        <template #activator>
                                            <n-button :disabled="currentUser.userId === user.userId" text>
                                                <g-icon name="delete" />
                                            </n-button>
                                        </template>
                                        <div>
                                            {{ `${$t('delete')}: \n #${user.userId} - ${user.name}` }}
                                        </div>
                                    </n-popconfirm>
                                </td>
                            </tr>
                        </tbody>
                    </n-table>
                    <div v-if="filterBy(users, ['userId', 'name', 'email'], searchTerm).length > size"
                        class="d-flex justify-content-center w-100">
                        <n-pagination v-model:page="page" size="small"
                            :page-count="filterBy(users, ['userId', 'name', 'email'], searchTerm).length"
                            :page-size="size" @update:page="listUsers()" />
                    </div>
                </div>
                <g-alert v-else :title="$t('noResult')" />
                <user-control v-if="showEditUser" :current="current" :groups="groups" @close="closeEditUser"
                    @save="saveAndRefresh" />
            </template>
        </div>
    </settings-view>
</template>

<script setup lang="ts">
import type { UserType } from '@gaio/shared/types'
import { cloneDeep } from 'lodash-es'
import { useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import useApi from '@/composables/useApi'
import useHelper from '@/composables/useHelper'
import { useAuthStore, useConfigStore } from '@/stores'
import SettingsView from '@/views/settings/SettingsView.vue'
import UserControl from '@/views/settings/user-manager/UserControl.vue'

const toast = useMessage()
const { filterBy } = useHelper()
const { t } = useI18n()

const loading = ref(true)
const current = ref({})
const showEditUser = ref(false)
const groups = ref([])
const numberOfUsers = ref(0)
const users = ref([])
const selectAll = ref(false)
const searchTerm = ref('')
const size = ref(10)
const page = ref(1)
const bulkGroup = ref([])
const localKey = ref('users')
const filterRole = ref('')
const filterGroup = ref('')

const saveAndRefresh = () => {
    showEditUser.value = false
    closeEditUser()
    listUsers()
}

const license = computed(() => {
    return useConfigStore().license
})

const userLimit = computed(() => {
    return (
        license.value ?
            license.value.userLimit <= 0 ?
                10000 * 100
                : license.value.userLimit || 1
            : 1
    )
})

const downloadUsers = () => {
    const items = cloneDeep(users.value).map((u) => {
        if (u.tags) {
            u.tags = u.tags
                .map((t) => {
                    const findGroup = groups.value.find((g) => g.userId === Number(t))
                    if (findGroup) {
                        return findGroup.name
                    }
                    return ''
                })
                .filter((t) => t !== '')
                .toString()
        }
        delete u.options
        delete u.selected

        return u
    })
    const csvContent = 'data:text/csv;charset=utf-8,'

    const replacer = (key, value) => (value === null ? '' : value) // specify how you want to handle null values here
    const header = Object.keys(items[0])
    const csv = [
        header.join(','), // header row first
        ...items.map((row) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n')

    const encodedUri = encodeURI(csvContent + csv)
    window.open(encodedUri)
}

const clearFilter = () => {
    filterRole.value = ''
    filterGroup.value = ''
    bulkGroup.value = []
    searchTerm.value = ''
}

const filterApplied = computed(() => {
    return (
        filterBy(users.value, ['userId', 'name', 'email'], searchTerm.value)
            .filter((u) => {
                return filterRole.value ? u.role === filterRole.value : true
            })
            .filter((u) => {
                return filterGroup.value ? (u.tags || []).includes(filterGroup.value) : true
            }).length > 0
    )
})

const currentUser = computed(() => {
    return useAuthStore().user
})

const changeRole = (user: UserType) => {
    if (currentUser.value.userId !== user.userId) {
        users.value.forEach((u) => {
            if (u.userId === user.userId) {
                switch (u.role) {
                    case 'admin':
                        u.role = 'dev'
                        break
                    case 'dev':
                        u.role = 'user'
                        break
                    case 'user':
                        u.role = 'admin'
                        break
                    default:
                        u.role = 'user'
                }
                saveSingleUser(u)
            }
        })
    } else {
        toast.info(t('adminCantUpdateHimself'))
    }
}

const selectAndEditUser = (user: UserType) => {
    current.value = user
    showEditUser.value = true
}

const closeEditUser = () => {
    current.value = {}
    showEditUser.value = false
}

const myUsers = computed(() => {
    return filterBy(users.value, ['userId', 'name', 'email'], searchTerm.value)
        .filter((u) => {
            return filterRole.value ? u.role === filterRole.value : true
        })
        .filter((u) => {
            return filterGroup.value ? (u.tags || []).includes(filterGroup.value) : true
        })
        .slice(size.value * (page.value - 1), size.value * page.value) as UserType[]
})

const addUser = () => {
    current.value = {}
    showEditUser.value = true
}

const removeUser = (userId: string) => {
    loading.value = true
    useApi()
        .post('api/user/delete-user', {
            body: {
                userId
            }
        })
        .then(() => listUsers())
}

const removeAllSelected = () => {
    loading.value = true
    const localUsers = users.value.filter((u) => u.selected)
    for (const user of localUsers) {
        removeUser(user.userId)
    }
    users.value = users.value.filter((u) => !u.selected)
    loading.value = false
    clearFilter()
}

const onSelectAll = () => {
    users.value = users.value.map((u) => {
        u.selected = selectAll.value
        return u
    })
}

const hasSelected = computed(() => {
    return users.value.some((u) => u.selected)
})

const listUsers = () => {
    loading.value = true
    useApi()
        .get('api/user/list')
        .then((res) => {
            prepareUserData(res)
            page.value = 1
            loading.value = false
        })
}

const prepareUserData = (list) => {
    if (list && list.users) {
        numberOfUsers.value = list.users.length
        groups.value = list.groups
        users.value = list.users.map((u) => {
            u.options = u.options || {}
            u.tags = u.tags || []
            u.selected = false
            return u
        })
    }
}

const saveUsers = (users: UserType[]) => {
    useApi()
        .post('api/user/bulk-save-user', {
            body: {
                users
            }
        })
        .then(() => {
            toast.success(t('updated'))
        })
}

const saveSingleUser = (user) => {
    saveUsers([user])
}

const globalChangeUser = (user) => {
    if (currentUser.value.userId !== user.userId) {
        saveSingleUser(user)
    } else {
        user.status = 'active'
        toast.info(t('adminCantUpdateHimself'))
    }
    return user
}

onMounted(() => listUsers())
</script>

<style lang="scss">
.user-manager {
    .user-role {
        cursor: pointer;
        border-radius: 4px;
        display: inline-block;
        margin-right: 4px;
        width: 22px;
        color: #fff;
        text-align: center;
        font-weight: bold;
        font-size: 12px;
        height: 20px;
        padding-top: 2px;
    }
}
</style>
