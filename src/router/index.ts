import { createRouter, createWebHistory } from 'vue-router'

const baseUrl = import.meta.env.BASE_URL

const router = createRouter({
	history: createWebHistory(baseUrl),
	routes: [
		{
			path: '/',
			name: 'base',
			redirect: '/apps',
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('../views/auth/LoginView.vue'),
		},
		// {
		// 	path: '/auth/problems',
		// 	name: 'login-old',
		// 	component: () => import('../views/auth/LoginViewOld.vue'),
		// },
		{
			path: '/home',
			name: 'home',
			component: () => import('../views/home/HomeView.vue'),
		},
		{
			path: '/apps',
			name: 'apps',
			component: () => import('../views/apps/AppsView.vue'),
		},
		{
			path: '/studio',
			name: 'studio',
			component: () => import('../views/studio/StudioView.vue'),
		},

		{
			path: '/preview',
			name: 'preview',
			component: () => import('../views/dash/DashView.vue'),
		},
		{
			path: '/dashboard',
			name: 'dashboard',
			component: () => import('../views/dash/DashView.vue'),
		},
		{
			path: '/users',
			name: 'users',
			component: () => import('../views/settings/user-manager/UserManager.vue'),
		},
		{
			path: '/settings',
			redirect: '/settings/tags',
			children: [
				{
					path: 'tags',
					name: 'tags',
					component: () => import('../views/settings/tag-manager/TagManager.vue'),
				},
				{
					path: 'setup',
					name: 'setup',
					component: () => import('../views/settings/setup-manager/SetupManager.vue'),
				},
				{
					path: 'monit',
					name: 'monit',
					component: () => import('../views/settings/MonitManager.vue'),
				},
				{
					path: 'users',
					name: 'users',
					component: () => import('../views/settings/user-manager/UserManager.vue'),
				},
				{
					path: 'sources',
					name: 'sources',
					component: () => import('../views/settings/source-manager/SourceManager.vue'),
				},
				{
					path: 'bucket',
					name: 'bucket',
					component: () => import('../views/settings/repo-manager/RepoManager.vue'),
				},
				{
					path: 'app',
					name: 'app',
					component: () => import('../views/settings/app-share/AppShare.vue'),
				},
				{
					path: 'logs',
					name: 'logs',
					component: () => import('../views/settings/LogManager.vue'),
				},
			],
		},
		{
			path: '/test',
			name: 'teste',
			component: () => import('../views/TestView.vue'),
		},
	],
})

export default router
