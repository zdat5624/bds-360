// env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        // API Endpoints
        NEXT_PUBLIC_API_URL: string;

        NEXT_PUBLIC_WS_URL: string;

        // Third-party keys
        NEXT_PUBLIC_MAPBOX_KEY: string;

        NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;


        // Thêm các biến khác của bạn ở đây...
    }
}