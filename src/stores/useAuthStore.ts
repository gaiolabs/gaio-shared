import type { UserOptionsType, UserType } from '@gaio/types'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import useApi from '@/composables/useApi'

export const useAuthStore = defineStore(
    'auth',
    () => {
        const token = ref<string>('')
        const user = ref<UserType>()

        // set token state
        // const setToken = (newToken: Token) => {
        //     if (newToken) {
        //         token.value = newToken
        //     }
        // }
        //
        // // set user state
        // const setUser = (newUser: UserType) => {
        //     user.value = newUser
        // }

        // sign up function
        // const signUp = (data: UserType) => {
        // return new Promise(async (resolve, reject) => {
        //     try {
        //         await fetch('/api/auth/register', {
        //             method: 'POST',
        //             body: data
        //         });
        //         resolve(true);
        //     } catch (error) {
        //         reject(error);
        //     }
        // });
        // }

        // refresh token function
        // const refreshToken = () => {
        //     return new Promise(async (resolve, reject) => {
        //         try {
        //             const data = fetch('/api/auth/refresh')
        //
        //             const { access_token } = data as any
        //             setToken(access_token)
        //
        //             resolve(true)
        //         } catch (error) {
        //             reject(error)
        //         }
        //     })
        // }
        // refresh time token function
        // const reRefreshAccessToken = async () => {
        // if (!token.value) return;
        //
        // const jwt = decode(token.value);
        //
        // // refreshing the token 1 minute before it expires
        // let remainingTime = jwt.exp * 1000 - Date.now() - 60000;
        //
        // // if remaining time is less than 0, do nothing
        // while (remainingTime > 0) {
        //     await new Promise((resolve) => setTimeout(resolve, remainingTime));
        //
        //     // try to update the token
        //     try {
        //         await refreshToken();
        //         break;
        //     } catch (error: any) {
        //         console.error(`Error updating token: ${error.message}`);
        //
        //         // try to update again after 30 seconds
        //         await new Promise((resolve) => setTimeout(resolve, 30000));
        //     }
        //
        //     // recalculates time remaining after token refresh attempt
        //     const newJwt: JwtDecode = decode(token.value);
        //     remainingTime = newJwt.exp * 1000 - Date.now() - 60000;
        // }
        // }

        // get user with custom useFetchApi composable
        // const getUser = () => {
        //     return new Promise(async (resolve, reject) => {
        //         try {
        //             const data = await fetch('/api/auth/user')
        //
        //             const { user } = data as any
        //
        //             setUser(user)
        //
        //             resolve(true)
        //         } catch (error) {
        //             reject(error)
        //         }
        //     })
        // }
        // init auth set access token
        const initAuth = () => {
            // return new Promise(async (resolve, reject) => {
            //     setIsLoading(true);
            //     try {
            //         await refreshToken();
            //         await getUser();
            //
            //         reRefreshAccessToken();
            //         resolve(true);
            //     } catch (error) {
            //         reject(error);
            //     } finally {
            //         setIsLoading(false);
            //     }
            // });
        }

        const logout = () => {
            // return new Promise(async (resolve, reject) => {
            //     setIsLoading(true);
            //     try {
            //         await fetch('/api/auth/logout/', {
            //             method: 'POST'
            //         });
            //
            //         setToken(null as any);
            //         setUser(null as any);
            //         resolve(true);
            //     } catch (error) {
            //         reject(error);
            //     } finally {
            //         setIsLoading(false);
            //     }
            // });
        }

        const updateUserOptions = async (definedOptions: UserOptionsType = {}) => {
            user.value.options = {
                ...user.value.options,
                ...definedOptions
            }
            return await useApi().post('api/user/update-options', {
                body: {
                    options: user.value.options
                }
            })
        }

        const updateUserMetadata = async (userData: UserType) => {
            return await useApi()
                .post('api/user/update-metadata', {
                    body: {
                        userData: {
                            userId: user.value.userId,
                            name: userData.name,
                            email: userData.email,
                            lang: userData.lang
                        }
                    }
                })
                .then(() => {
                    user.value = {
                        ...user.value,
                        name: userData.name,
                        email: userData.email,
                        lang: userData.lang
                    }
                })
        }

        const toggleFavoriteApp = (appId: string) => {
            const options = user.value.options
            if (options.favorApps.includes(appId)) {
                options.favorApps = options.favorApps.filter((app) => app !== appId)
            } else {
                options.favorApps.push(appId)
            }
            updateUserOptions(options)
        }

        const addAppToRecent = (appId: string) => {
            const options = user.value.options
            options.recentApps.unshift(appId)
            options.recentApps.splice(4)
            updateUserOptions(options)
        }

        const defaultNumberFormat = computed(() => {
            if (user.value && user.value.lang) {
                if (user.value.lang.includes('pt')) {
                    return 'dotComma'
                }
            }
            return 'commaDot'
        })

        return {
            user,
            token,
            defaultNumberFormat,
            logout,
            initAuth,
            addAppToRecent,
            toggleFavoriteApp,
            updateUserOptions,
            updateUserMetadata
        }
    },
    {
        persist: true
    }
)
