export const commandKCommon = (t: Function) => [
    {
        label: t('home'),
        type: 'router',
        icon: 'home',
        path: '/home'
    },
    {
        label: t('apps'),
        type: 'router',
        icon: 'apps',
        path: '/apps'
    },
    {
        label: t('myAccount'),
        type: 'menu',
        icon: 'user'
    },
    {
        label: t('tagPermissions'),
        type: 'router',
        path: '/settings/tags',
        icon: 'shieldAccount'
    },
    {
        label: t('users'),
        type: 'router',
        path: '/settings/users',
        icon: 'user'
    },
    {
        label: t('setup'),
        type: 'router',
        path: '/settings/setup',
        icon: 'setupSettings'
    },
    {
        label: t('appShare'),
        type: 'router',
        icon: 'appShare',
        path: '/settings/app'
    },
    {
        label: t('monit'),
        type: 'router',
        icon: 'monit',
        path: '/settings/monit'
    },
    {
        label: t('sources'),
        type: 'router',
        icon: 'source',
        path: '/settings/sources'
    },
    {
        label: t('bucket'),
        type: 'router',
        icon: 'bucket',
        path: '/settings/bucket'
    },
    {
        label: t('logs'),
        icon: 'settingsLogs',
        path: '/settings/logs',
        showLabel: false
    }
]
