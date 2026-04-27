// @/config/routes.ts
/**
 * TẬP TRUNG TẤT CẢ ĐƯỜNG DẪN CỦA ỨNG DỤNG VÀO ĐÂY
 * Sử dụng để điều hướng: router.push(APP_ROUTES.AUTH.LOGIN)
 */

export const APP_ROUTES = {
    // 1. PUBLIC ROUTES (Ai cũng vào được)
    PUBLIC: {
        HOME: '/',
        SALE: '/sale',
        RENT: '/rent',
        // Sử dụng function cho các route động (Dynamic Routes)
        POST_DETAIL: (id: string | number) => `/posts/${id}`,
        USER_PROFILE: (userId: string | number) => `/u/${userId}`,
    },

    // 2. AUTH ROUTES (Xác thực)
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        FORGOT_PASSWORD: '/auth/forgot-password',
    },

    // 3. USER ROUTES (Yêu cầu đăng nhập, tất cả nằm trong /user)
    USER: {
        DASH_BOARD: '/user',
        PROFILE: '/user/profile',
        CHANGE_PASSWORD: '/user/change-password',
        MY_POSTS: '/user/posts',
        CREATE_POST: '/user/posts/create',
        EDIT_POST: (id: string | number) => `/user/posts/${id}/edit`,
        NOTIFICATIONS: '/user/notifications',
        PAYMENTS: '/user/payments',
        PAYMENT_RESULT: '/user/payments/result',
        VIPS: '/user/vips',

        SAVED_POSTS: '/saved-posts',

    },

    // 4. KHU VỰC DÀNH CHO NHÂN VIÊN VÀ QUẢN TRỊ (Back-office)
    MANAGE: {
        DASHBOARD: '/manage',
        USERS: '/manage/users',
        VERIFICATIONS: '/manage/verifications',
        VIPS: '/manage/vips',
        CATEGORIES: '/manage/categories',
        POSTS: '/manage/posts',
        TRANSACTIONS: '/manage/transactions',
        STATISTICS: {
            USERS: '/manage/statistics/users',
            TRANSACTIONS: '/manage/statistics/transactions',
            POSTS: '/manage/statistics/posts',
        },
    },

    // 5. ERROR ROUTES
    ERRORS: {
        FORBIDDEN: 'errors/forbidden',
    },
} as const;