// env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {

        // API Endpoints
        NEXT_PUBLIC_API_URL: string;

        // Third-party keys
        NEXT_PUBLIC_MAPBOX_KEY: string;

        // Thêm các biến khác của bạn ở đây...
    }
}