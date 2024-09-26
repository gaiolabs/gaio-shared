<template>
	<g-dialog @close="closeControl">
		<template #title>
			{{ user.userId ? `${$t('edit')} - ${user.userId}` : $t('new') }}
		</template>
		<template #content>
			<div class="user-control overflow-auto">
				<div class="control">
					<div class="flex items-center justify-between">
						<div>
							<div class="control-label">{{ $t('type') }}</div>
							<NSelect
								v-model:value="user.role"
								filterable
								:disabled="currentAdmin.userId === user.userId"
								size="small"
								default-value="user"
								:options="[
									{ label: $t('user'), value: 'user' },
									{ label: $t('developer'), value: 'dev' },
									{ label: $t('admin'), value: 'admin' }
								]"
							/>
						</div>
						<div>
							<NSwitch
								v-if="user.userId"
								v-model="user.status"
								:active-text="$t('active')"
								:inactive-text="$t('inactive')"
								active-value="active"
								inactive-value="inactive"
							>
								<template #checked>{{ $t('active') }}</template>
								<template #unchecked>{{ $t('inactive') }}</template>
							</NSwitch>
						</div>
					</div>
				</div>
				<div class="flex justify-between">
					<div class="control grow pe-1">
						<div class="control-label">{{ $t('name') }}</div>
						<NInput
							v-model:value="user.name"
							size="small"
						/>
					</div>
					<div class="control grow ps-1">
						<div class="flex">
							<div class="control-label">{{ $t('email') }}</div>
							<div v-if="isFocused === false">
								<div
									v-if="resultEmailEdit !== null && resultEmailEdit === true"
									class="text-success ms-2"
								>
									({{ $t('validEmail') }})
								</div>
								<div
									v-else
									class="text-danger ms-2"
								>
									( {{ $t('invalidEmail') }})
								</div>
							</div>
						</div>
						<NInput
							v-model:value="user.email"
							size="small"
							@keyup="checkMail()"
							@blur="checkMail()"
							@focus="checkMail()"
						/>
					</div>
				</div>

				<div class="control">
					<div class="control-label align-items-center flex justify-between">
						<div class="flex items-center gap-2">
							<div>
								{{ $t('password') }}
							</div>
							<div
								v-if="user.userId"
								class="text-[11px]"
							>
								{{ $t('changePasswordOptional') }}
							</div>
						</div>
						<div v-if="user.password">
							<NPopover
								:width="400"
								trigger="hover"
							>
								<template #trigger>
									<div class="password-base">
										<div
											class="line"
											:class="{ active: checkerCount >= 1 }"
										/>
										<div
											class="line"
											:class="{ active: checkerCount >= 2 }"
										/>
										<div
											class="line"
											:class="{ active: checkerCount >= 3 }"
										/>
										<div
											class="line"
											:class="{ active: checkerCount >= 4 }"
										/>
									</div>
								</template>
								<div>
									{{ $t('passwordLength') }}
								</div>
							</NPopover>
						</div>
					</div>
					<NInput
						v-model:value="user.password"
						type="password"
						show-password
						@keyup="passwordChecker()"
					/>
				</div>

				<div
					v-if="groups.length"
					class="control"
				>
					<div class="control-label">
						{{ $t('group') }}
					</div>
					<NSelect
						v-model:value="user.tags"
						class="w-100"
						filterable
						multiple
						collapse-tags
						:placeholder="$t('group')"
						value-field="userId"
						label-field="name"
						:options="groups"
					/>
				</div>
				<div class="control">
					<div class="control-label">
						{{ $t('language') }}
					</div>
					<NSelect
						v-model:value="user.lang"
						default-value="en-US"
						:options="[
							{ label: $t('portuguese'), value: 'pt-BR' },
							{ label: $t('spanish'), value: 'es-US' },
							{ label: $t('english'), value: 'en-US' }
						]"
					/>
				</div>
			</div>
		</template>
		<!-- FOOTER -->
		<template #footer>
			<div class="flex items-center justify-between">
				<div>
					<div v-if="backupCurrentUser.role !== 'admin' && backupCurrentUser.userId">
						<NPopconfirm
							:width="350"
							:positive-text="$t('delete')"
							:negative-text="$t('cancel')"
							@positive-click="removeUser(backupCurrentUser.userId)"
						>
							<template #trigger>
								<span>
									<NButton text>
										<IconComponent name="Delete" />
									</NButton>
								</span>
							</template>
							<div>
								{{ $t('removeUser') }}
							</div>
						</NPopconfirm>
					</div>
					<NButton
						v-if="twoFa === true"
						class="ms-2"
						@click="resetTwo2FA()"
					>
						{{ $t('resetTwoFactor') }}
					</NButton>
				</div>
				<div></div>
				<NButton
					type="primary"
					:loading="loading"
					:disabled="disableSave"
					@click="save"
				>
					{{ $t('save') }}
				</NButton>
			</div>
		</template>
	</g-dialog>
</template>

<script setup lang="ts">
import useApi from '@/composables/useApi'
import { useAuthStore } from '@/stores'
import type { UserType } from '@gaio/shared/types'
import { cloneDeep } from 'lodash-es'
import { useMessage } from 'naive-ui'
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toast = useMessage()
const emit = defineEmits(['close', 'save'])
const props = defineProps<{
	current: UserType
	groups: UserType[]
}>()

const disableSave = computed(() => {
	return !newUserTypeAllFields.value || !resultEmailEdit.value
})

const user = ref<UserType>({
	role: 'user',
	name: '',
	options: {
		appList: [],
		favorApps: [],
		recentApps: [],
		tableViewPageSize: 20,
		tableFrequencyPageSize: 50,
		appViewType: 'grid',
		userThemeMode: undefined
	},
	userId: undefined,
	tags: [],
	email: '',
	password: undefined,
	status: 'active'
})

const resultEmailEdit = ref(false)
const backupCurrentUser = ref<UserType>()
const loading = ref(false)
const isFocused = ref(true)
const twoFa = ref(false)

const resetTwo2FA = () => {
	useApi()
		.post('api/user/reset-two-factor', {
			body: { userId: user.value.userId }
		})
		.then(() => {
			toast.success(t('updated'))
		})
}

const checker = ref({
	hasAmount: undefined,
	hasNumber: undefined,
	hasUppercase: undefined,
	hasSpecialChar: undefined
})

const checkerCount = computed(() => {
	return Object.values(checker.value).filter((item) => item).length
})

const checkerCountHasThree = computed(() => {
	return checkerCount.value >= 3
})

const passwordChecker = () => {
	const format = /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/

	checker.value.hasAmount = user.value.password.length >= 8
	checker.value.hasNumber = /\d/.test(user.value.password)
	checker.value.hasUppercase = /[A-Z]/.test(user.value.password)
	checker.value.hasSpecialChar = format.test(user.value.password)
}

const removeUser = (userId: string) => {
	loading.value = true
	useApi()
		.post(
			'api/user/delete-user/' +
				{
					body: {
						userId
					}
				}
		)
		.then(() => {
			loading.value = false
			toast.success('updated')
			emit('save')
		})
		.catch(() => (loading.value = false))
}

const closeControl = () => emit('close')

const checkMail = () => {
	resultEmailEdit.value = validateMail(user.value.email)

	if (resultEmailEdit.value === true && resultEmailEdit.value !== null && user.value.email !== '') {
		isFocused.value = false
	}
}

const validateMail = (email: string) => {
	let re = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
	return re.test(email)
}

const save = () => {
	loading.value = true
	useApi()
		.post('api/user/save-user', { body: { userData: user.value } })
		.then(() => {
			loading.value = false
			toast.success(t('updated'))
			emit('save')
		})
		.catch((err) => {
			loading.value = false

			let data
			if (err.response && err.response.data) {
				data = err.response
			} else {
				data = err
			}

			if (data.code === 'userExists') {
				toast.error('userExists')
			}
		})
}

const newUserTypeAllFields = computed(() => {
	if (!user.value.userId) {
		return !!(user.value.email && user.value.password && user.value.name && checkerCountHasThree.value)
	}

	if (user.value.password) {
		return !!(user.value.email && user.value.name && checkerCountHasThree.value)
	}

	return !!(user.value.email && user.value.name)
})

const currentAdmin = computed(() => {
	return useAuthStore().user
})

onBeforeMount(() => {
	if (props.current && props.current.userId) {
		user.value = Object.assign(
			{},
			{
				...props.current,
				password: ''
			}
		)
		backupCurrentUser.value = cloneDeep(user.value)
	} else {
		backupCurrentUser.value = {}
	}
	checkMail()
})
</script>

<style lang="scss">
.control .control-info {
	font-size: 12px !important;
	text-align: justify !important;
}

.password-base {
	margin: 4px 1px;
	display: flex;
	gap: 3px;

	.line {
		width: 20px;
		height: 3px;
		background: #ccc;

		&.active {
			background: #54a147;
		}
	}
}
</style>
