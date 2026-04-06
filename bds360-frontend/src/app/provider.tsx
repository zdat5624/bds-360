'use client';

import { antdTheme } from '@/config/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () => new QueryClient({
            defaultOptions: {
                queries: { staleTime: 60 * 1000, refetchOnWindowFocus: false },
            },
        })
    );

    return (
        <QueryClientProvider client={queryClient}>

            <ConfigProvider theme={antdTheme}>

                {children}

            </ConfigProvider>

        </QueryClientProvider>
    );
}