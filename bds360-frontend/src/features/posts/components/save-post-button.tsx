// @/features/posts/components/save-post-button.tsx
'use client';

import { useSavePost, useUnsavePost } from '@/features/posts/api/posts.mutations';
import { useCheckSavedStatus } from '@/features/posts/api/posts.queries';
import { cn } from '@/lib/utils';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { Button, message, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';

interface SavePostButtonProps {
    postId: number;
    initialIsSaved?: boolean;
    className?: string;
    showText?: boolean;
}

export function SavePostButton({
    postId,
    initialIsSaved = false,
    className,
    showText = false
}: SavePostButtonProps) {
    const [isSaved, setIsSaved] = useState(initialIsSaved);

    const postIds = useMemo(() => [postId], [postId]);

    // 🌟 Lấy thêm refetch và isFetching từ query
    const {
        data: savedMap,
        isLoading: isInitialLoading, // Chỉ true ở lần load đầu tiên
        isFetching,                 // True mỗi khi query đang tải (bao gồm cả lúc refetch)
        refetch
    } = useCheckSavedStatus(postIds, true);

    useEffect(() => {
        if (savedMap && savedMap[postId] !== undefined) {
            setIsSaved(savedMap[postId]);
        }
    }, [savedMap, postId]);

    const saveMutation = useSavePost();
    const unsaveMutation = useUnsavePost();

    // 🌟 Trạng thái Loading tổng hợp: bao gồm cả lúc đang mutate và lúc đang check lại
    const isLoading = saveMutation.isPending || unsaveMutation.isPending || isInitialLoading || isFetching;

    const handleToggleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Callback chung để gọi sau khi Mutation kết thúc (dù thành công hay lỗi)
        const mutationOptions = {
            onSettled: () => {
                // 🌟 Ngầm check lại để đồng bộ dữ liệu chuẩn xác nhất từ server
                refetch();
            },
            onSuccess: () => {
                // Chỉ hiện toast thành công, không set state ở đây vì đã có refetch lo
                message.success(isSaved ? 'Đã bỏ lưu tin' : 'Đã lưu tin');
            },
            onError: () => {
                // Không báo lỗi, để refetch tự quyết định trạng thái trái tim
                console.log("Mutation error - verifying state with server...");
            }
        };

        if (isSaved) {
            unsaveMutation.mutate(postId, mutationOptions);
        } else {
            saveMutation.mutate(postId, mutationOptions);
        }
    };

    const buttonContent = (
        <Button
            type="text"
            shape='circle'
            icon={isSaved ? <HeartFilled className="!text-blue-600 text-[16px]" /> : <HeartOutlined className="text-[16px]" />}
            onClick={handleToggleSave}
            loading={isLoading}
            className={cn(
                "flex items-center justify-center rounded-full border !border-gray-300 hover:!border-blue-400 w-10 h-10 p-3 transition-all",
                isSaved ? "!bg-blue-50 !border-blue-200 hover:!bg-blue-100" : "!bg-white hover:!bg-gray-50",
                className
            )}
        >
            {showText && (
                <span className={cn("ml-2 text-sm font-medium", isSaved ? "!text-blue-600" : "!text-gray-600")}>
                    {isSaved ? 'Đã lưu' : 'Lưu tin'}
                </span>
            )}
        </Button>
    );

    return (
        <Tooltip title={isSaved ? "Bỏ lưu" : "Lưu tin"} mouseEnterDelay={0.5}>
            {buttonContent}
        </Tooltip>
    );
}