// =====================================
// COMPONENT TÁI SỬ DỤNG: LA BÀN HƯỚNG
import { CompassDirection } from "../posts.constant";
// =====================================
export const CompassSelector = ({ value, onChange, label }: { value?: CompassDirection, onChange: (val?: CompassDirection) => void, label: string }) => {
    // Tọa độ lblPos đã được kéo sâu vào giữa các miếng cắt (tránh chạm viền)
    const slices = [
        { dir: 'NORTH', d: 'M 225 30 A 195 195 0 0 1 362.8858091266486 87.11416446389634 L 225 225 Z', lblPos: { top: '22%', left: '50%' } },
        { dir: 'NORTHEAST', d: 'M 362.8858091266486 87.11416446389634 A 195 195 0 0 1 419.9999999999964 224.9999626513905 L 225 225 Z', lblPos: { top: '28%', left: '72%' } },
        { dir: 'EAST', d: 'M 419.9999999999964 224.9999626513905 A 195 195 0 0 1 362.88586194555364 362.8857827171885 L 225 225 Z', lblPos: { top: '50%', left: '78%' } },
        { dir: 'SOUTHEAST', d: 'M 362.88586194555364 362.8857827171885 A 195 195 0 0 1 225.00007469721902 419.9999999999857 L 225 225 Z', lblPos: { top: '72%', left: '72%' } },
        { dir: 'SOUTH', d: 'M 225.00007469721902 419.9999999999857 A 195 195 0 0 1 87.11424369227669 362.88588835499866 L 225 225 Z', lblPos: { top: '78%', left: '50%' } },
        { dir: 'SOUTHWEST', d: 'M 87.11424369227669 362.88588835499866 A 195 195 0 0 1 30.000000000032202 225.00011204582862 L 225 225 Z', lblPos: { top: '72%', left: '28%' } },
        { dir: 'WEST', d: 'M 30.000000000032202 225.00011204582862 A 195 195 0 0 1 87.11408523556145 87.114270101747 L 225 225 Z', lblPos: { top: '50%', left: '22%' } },
        { dir: 'NORTHWEST', d: 'M 87.11408523556145 87.114270101747 A 195 195 0 0 1 224.99985060556176 30.000000000057213 L 225 225 Z', lblPos: { top: '28%', left: '28%' } },
    ];
    const labels: Record<string, string> = { NORTH: 'Bắc', NORTHEAST: 'Đông Bắc', EAST: 'Đông', SOUTHEAST: 'Đông Nam', SOUTH: 'Nam', SOUTHWEST: 'Tây Nam', WEST: 'Tây', NORTHWEST: 'Tây Bắc' };
    return (
        <div className="flex flex-col gap-3">
            <label className="text-gray-800 font-semibold text-[0.85rem]">{label}</label>
            {/* Thu nhỏ nhẹ lại và giới hạn tối đa để không gây vỡ layout (scroll ngang) */}
            <div className="relative w-[220px] sm:w-[240px] h-[220px] sm:h-[240px] mx-auto rounded-full shrink-0">
                <svg viewBox="0 0 450 450" className="w-full h-full -rotate-[22.5deg]">
                    {/* ĐÃ BỎ ĐƯỜNG TRÒNG NGOÀI (r="220") như bạn chỉ trong ảnh */}
                    {slices.map((slice) => {
                        const isActive = value === slice.dir;
                        return (
                            <path
                                key={slice.dir} d={slice.d}
                                fill={isActive ? '#e6f4ff' : '#ffffff'}
                                stroke="#e5e7eb" strokeWidth="1.5"
                                onClick={() => onChange(isActive ? undefined : slice.dir as CompassDirection)}
                                className="cursor-pointer transition-colors duration-200 hover:fill-blue-50"
                            />
                        );
                    })}
                    <circle cx="225" cy="225" r="55" fill="#ffffff" stroke="#e5e7eb" strokeWidth="2" pointerEvents="none" />
                </svg>
                {/* Nhãn chữ (Font chữ siêu nhỏ để lọt thỏm trong miếng cắt) */}
                {slices.map((slice) => {
                    const isActive = value === slice.dir;
                    return (
                        <div key={slice.dir} className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none text-[0.65rem] sm:text-[0.7rem] whitespace-nowrap ${isActive ? 'text-[#1677ff] font-bold' : 'text-gray-600 font-medium'}`} style={slice.lblPos}>
                            {labels[slice.dir]}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};