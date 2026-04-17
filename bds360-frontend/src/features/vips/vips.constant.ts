// @/features/vips/vips.constant.ts

export const VIP_PACKAGES = [
    {
        id: 'VIP_0',
        name: 'Gói Tiêu Chuẩn',
        price: 'Miễn phí',
        features: [
            { text: 'Hiển thị ngay không chờ duyệt', available: false },
            { text: 'Hiển thị nổi bật', available: false },
            { text: 'Thông báo xem tin', available: false },
            { text: 'Thông báo xem số điện thoại', available: false },
        ],
        tagColor: 'default',
        buttonText: 'Đăng tin tiêu chuẩn',
        isPopular: false,
    },
    {
        id: 'VIP_1',
        name: 'Gói VIP 1',
        price: '2.000đ / ngày',
        features: [
            { text: 'Hiển thị ngay không chờ duyệt', available: true },
            { text: 'Hiển thị nổi bật', available: true },
            { text: 'Thông báo xem tin', available: true },
            { text: 'Thông báo xem số điện thoại', available: true },
        ],
        tagColor: 'gold',
        buttonText: 'Đăng tin VIP 1',
        isPopular: true,
    },
    {
        id: 'VIP_2',
        name: 'Gói VIP 2',
        price: '4.000đ / ngày',
        features: [
            { text: 'Hiển thị ngay không chờ duyệt', available: true },
            { text: 'Hiển thị nổi bật & ưu tiên nhất', available: true },
            { text: 'Thông báo xem tin', available: true },
            { text: 'Thông báo xem số điện thoại', available: true },
        ],
        tagColor: 'volcano',
        buttonText: 'Đăng tin VIP 2',
        isPopular: false,
    },
];