// @/constants/search-suggestions.ts

export interface SearchSuggestion {
    label: string;
    type: 'keyword';
}

export const SEARCH_SUGGESTIONS: SearchSuggestion[] = [
    // --- 🏠 Loại hình phổ biến ---
    { label: "Chung cư mini", type: "keyword" },
    { label: "Phòng trọ sinh viên", type: "keyword" },
    { label: "Nhà nguyên căn", type: "keyword" },
    { label: "Nhà mặt phố", type: "keyword" },
    { label: "Mặt bằng kinh doanh", type: "keyword" },
    { label: "Văn phòng giá rẻ", type: "keyword" },
    { label: "Ký túc xá / Sleepbox", type: "keyword" },

    // --- 🛋️ Tiện ích & Nội thất ---
    { label: "Full nội thất", type: "keyword" },
    { label: "Nội thất cơ bản", type: "keyword" },
    { label: "Phòng trống", type: "keyword" },
    { label: "Có ban công", type: "keyword" },
    { label: "Có thang máy", type: "keyword" },
    { label: "Chỗ để xe rộng", type: "keyword" },
    { label: "Bếp tách biệt", type: "keyword" },
    { label: "Máy giặt riêng", type: "keyword" },

    // --- 📍 Vị trí & Môi trường xung quanh ---
    { label: "Gần trường đại học", type: "keyword" },
    { label: "Gần chợ / Siêu thị", type: "keyword" },
    { label: "Gần trạm xe bus", type: "keyword" },
    { label: "Khu an ninh yên tĩnh", type: "keyword" },
    { label: "Hẻm ô tô / Ngõ rộng", type: "keyword" },

    // --- 🐾 Nhu cầu đặc biệt & Quy định ---
    { label: "Cho nuôi thú cưng", type: "keyword" },
    { label: "Không chung chủ", type: "keyword" },
    { label: "Giờ giấc tự do", type: "keyword" },
    { label: "Tìm người ở ghép", type: "keyword" },
    { label: "Hỗ trợ cọc", type: "keyword" },
    { label: "Chính chủ cho thuê", type: "keyword" }
];