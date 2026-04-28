// @/constants/vip-packages.constant.ts

export const VIP_PACKAGES = [
    {
        id: 1,
        name: 'Gói VIP 0',
        defaultPrice: 'Miễn phí',
        themeColor: '#8c8c8c', //  Sửa thành màu xám (Gray)
        features: [
            { text: 'Hiển thị ngay không chờ duyệt', available: false },
            { text: 'Hiển thị nổi bật', available: false },
            { text: 'Thông báo xem số điện thoại', available: false },
        ],
        tagColor: 'default',
        buttonText: 'Đăng tin tiêu chuẩn',
        isPopular: false,
        shortName: 'VIP 0',
        vipLevel: 0,


    },
    {
        id: 2,
        name: 'Gói VIP 1',
        defaultPrice: 'Đang cập nhật...',
        themeColor: '#faad14', // Màu Vàng Gold sang trọng
        features: [
            { text: 'Hiển thị ngay không chờ duyệt', available: true },
            { text: 'Hiển thị nổi bật', available: true },
            { text: 'Thông báo xem số điện thoại', available: false },
        ],
        tagColor: 'gold',
        buttonText: 'Đăng tin VIP 1',
        isPopular: true,
        shortName: 'VIP 1',

        vipLevel: 1,


    },
    {
        id: 3,
        name: 'Gói VIP 2',
        defaultPrice: 'Đang cập nhật...',
        themeColor: '#f5222d', // Màu Đỏ Volcano quyền lực
        features: [
            { text: 'Hiển thị ngay không chờ duyệt', available: true },
            { text: 'Hiển thị nổi bật & ưu tiên nhất', available: true },
            { text: 'Thông báo xem số điện thoại', available: true },
        ],
        tagColor: 'volcano',
        buttonText: 'Đăng tin VIP 2',
        isPopular: false,
        shortName: 'VIP 2',
        vipLevel: 2,
    },
];

export const VIP_COLOR_MAP: Record<number, string> = VIP_PACKAGES.reduce((acc, pkg) => {
    acc[pkg.id] = pkg.themeColor;
    return acc;
}, {} as Record<number, string>);

export const VIP_TAG_COLOR_MAP: Record<number, string> = VIP_PACKAGES.reduce((acc, pkg) => {
    acc[pkg.id] = pkg.tagColor; // Lấy 'default', 'gold', 'volcano'...
    return acc;
}, {} as Record<number, string>);