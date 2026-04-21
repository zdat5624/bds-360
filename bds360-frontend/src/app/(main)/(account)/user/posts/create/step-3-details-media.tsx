'use client';

import { useUploadImages } from '@/features/media/api/media.mutations';
import { BulbOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Form, FormInstance, InputNumber, Row, Select, Typography, Upload, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useState } from 'react';

// --- THƯ VIỆN KÉO THẢ (DND-KIT) ---
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Import constants
import {
    COMPASS_DIRECTION_OPTIONS,
    FURNISHING_OPTIONS,
    LEGAL_STATUS_OPTIONS
} from '@/features/posts/posts.constant';

const { Text } = Typography;

interface Step3DetailsMediaProps {
    form: FormInstance;
}

// =====================================================================
// 1. COMPONENT PHỤ: KHỐI KÉO THẢ TỪNG BỨC ẢNH
// =====================================================================
interface DraggableUploadListItemProps {
    originNode: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    file: UploadFile<any>;
}
const DraggableUploadListItem = ({ originNode, file }: DraggableUploadListItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: file.uid,
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: isDragging ? 'grabbing' : 'grab',
        height: '100%',
        touchAction: 'none', // Chặn cuộn trang khi đang kéo
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        ...(isDragging ? { position: 'relative', zIndex: 9999, opacity: 0.8 } : {}),
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {originNode}
        </div>
    );
};

// =====================================================================
// 2. COMPONENT PHỤ: CUSTOM FORM CONTROL (CÁCH LY LOGIC UPLOAD KHỎI FORM.ITEM)
// =====================================================================
interface ImageUploadControlProps {
    value?: string[];
    onChange?: (value: string[]) => void;
}

const ImageUploadControl: React.FC<ImageUploadControlProps> = ({ value = [], onChange }) => {
    const { mutateAsync: uploadImages } = useUploadImages();

    // Khởi tạo fileList từ value của Form (Chỉ chạy 1 lần khi render)
    const [fileList, setFileList] = useState<UploadFile[]>(() =>
        value.map((url, index) => ({
            uid: `-${index}`,
            name: `image-${index}.png`,
            status: 'done',
            url: url,
        }))
    );

    // Cảm biến chuẩn cho cả chuột và cảm ứng (kéo 8px là ăn)
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    const onDragEnd = ({ active, over }: any) => {
        if (active.id !== over?.id) {
            setFileList((prev) => {
                const activeIndex = prev.findIndex((i) => i.uid === active.id);
                const overIndex = prev.findIndex((i) => i.uid === over?.id);
                const newList = arrayMove(prev, activeIndex, overIndex);

                // Bắn dữ liệu mới lên cho Form.Item cập nhật
                const validUrls = newList.map(f => f.response || f.url).filter(Boolean) as string[];
                onChange?.(validUrls);

                return newList;
            });
        }
    };

    const beforeUpload = (file: File) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Vui lòng chỉ chọn file ảnh!');
            return Upload.LIST_IGNORE;
        }
        const isLt50M = file.size / 1024 / 1024 < 50;
        if (!isLt50M) {
            message.error('Ảnh phải nhỏ hơn 50MB!');
            return Upload.LIST_IGNORE;
        }
        if (fileList.length >= 16) {
            message.error('Tối đa 16 hình ảnh!');
            return Upload.LIST_IGNORE;
        }
        return true;
    };

    const handleCustomRequest: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
        try {
            const responseUrls = await uploadImages({ files: [file as File] });
            if (responseUrls && responseUrls.length > 0) {
                onSuccess?.(responseUrls[0]);
            } else {
                throw new Error('Upload thất bại: Không có URL trả về');
            }
        } catch (error) {
            console.error('Lỗi upload ảnh:', error);
            onError?.(error as any);
            message.error('Không thể tải ảnh lên. Vui lòng thử lại.');
        }
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);

        // Bắn dữ liệu lên Form liên tục
        const validUrls = newFileList.map(file => file.response || file.url).filter(Boolean) as string[];
        onChange?.(validUrls);
    };

    const uploadButton = (
        <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
            <PlusOutlined className="text-xl" />
            <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
        </div>
    );

    return (
        <div
            className={`p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 min-h-[200px] transition-colors hover:border-blue-400
  ${fileList.length === 0 ? 'flex items-center justify-center' : ''}`}
        >
            <DndContext sensors={sensors} onDragEnd={onDragEnd}>
                <SortableContext items={fileList.map((i) => i.uid)} strategy={rectSortingStrategy}>
                    <Upload
                        className={fileList.length === 0 ? '!flex justify-center w-full' : ''}

                        listType="picture-card"

                        fileList={fileList}
                        customRequest={handleCustomRequest}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        accept="image/*"
                        multiple
                        showUploadList={{ showPreviewIcon: false }}
                        itemRender={(originNode, file) => (
                            <DraggableUploadListItem originNode={originNode} file={file} />
                        )}
                    >
                        {fileList.length >= 16 ? null : uploadButton}
                    </Upload>
                </SortableContext>
            </DndContext>

            {fileList.length > 0 && (
                <div className="mt-4 text-xs text-gray-500 bg-blue-50 p-2 rounded inline-block">
                    <span className="hidden md:inline"><BulbOutlined /> Ảnh đầu tiên trong danh sách sẽ được làm ảnh bìa. Kéo thả để đổi vị trí.</span>
                    <span className="md:hidden"><BulbOutlined /> Nhấn giữ ảnh (0.25s) và kéo để thay đổi ảnh bìa.</span>
                </div>
            )}
        </div>
    );
};

// =====================================================================
// 3. COMPONENT CHÍNH: STEP 3 (HIỂN THỊ UI)
// =====================================================================
export function Step3DetailsMedia({ form }: Step3DetailsMediaProps) {
    return (
        <div className="flex flex-col gap-4 animate-fade-in">
            {/* PHẦN 1: THÔNG SỐ CHI TIẾT */}
            <div>
                <Text strong className="text-lg">Chi tiết bất động sản</Text>
                <Text type="secondary" className="block mt-1 mb-4">
                    Cung cấp các thông số chi tiết giúp người mua/thuê dễ dàng ra quyết định.
                </Text>

                <Row gutter={16}>
                    <Col xs={12} md={6}>
                        <Form.Item
                            label="Phòng ngủ"
                            name={['listingDetail', 'bedrooms']}
                            tooltip="Thông tin tùy chọn, điền vào giúp tin đăng chi tiết hơn"
                        >
                            <InputNumber min={1} max={100} size="large" className="!w-full" placeholder="VD: 2 (Tùy chọn)" />
                        </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Item
                            label="Phòng tắm/WC"
                            name={['listingDetail', 'bathrooms']}
                            tooltip="Thông tin tùy chọn, điền vào giúp tin đăng chi tiết hơn"
                        >
                            <InputNumber min={1} max={100} size="large" className="!w-full" placeholder="VD: 2 (Tùy chọn)" />
                        </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Item label="Nội thất" name={['listingDetail', 'furnishing']} tooltip="Thông tin tùy chọn">
                            <Select size="large" placeholder="-- Tùy chọn --" options={FURNISHING_OPTIONS} allowClear />
                        </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Item label="Pháp lý" name={['listingDetail', 'legalStatus']} tooltip="Thông tin tùy chọn">
                            <Select size="large" placeholder="-- Tùy chọn --" options={LEGAL_STATUS_OPTIONS} allowClear />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={12} md={6}>
                        <Form.Item label="Hướng nhà" name={['listingDetail', 'houseDirection']} tooltip="Thông tin tùy chọn">
                            <Select size="large" placeholder="-- Tùy chọn --" options={COMPASS_DIRECTION_OPTIONS} allowClear />
                        </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Item label="Hướng ban công" name={['listingDetail', 'balconyDirection']} tooltip="Thông tin tùy chọn">
                            <Select size="large" placeholder="-- Tùy chọn --" options={COMPASS_DIRECTION_OPTIONS} allowClear />
                        </Form.Item>
                    </Col>
                </Row>
            </div>

            {/* PHẦN 2: HÌNH ẢNH */}
            <div>
                <Text strong className="text-lg">Hình ảnh thực tế <span className="text-red-500">*</span></Text>
                <Text type="secondary" className="block mt-1 mb-4">
                    Kéo thả để thay đổi vị trí ảnh. Ảnh đầu tiên sẽ được làm ảnh bìa của tin đăng.
                </Text>

                {/*  Form.Item chỉ lo duy nhất việc kiểm tra Validation và nhận data từ ImageUploadControl */}
                <Form.Item
                    name="imageUrls"
                    rules={[
                        {
                            validator: (_, value) => {
                                const images = Array.isArray(value) ? value : [];

                                if (images.length < 4) return Promise.reject('Cần tối thiểu 4 hình ảnh');
                                if (images.length === 0) return Promise.reject('Vui lòng tải lên hình ảnh');
                                if (images.length > 16) return Promise.reject('Tối đa 16 hình ảnh');
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    {/* Bơm Custom Component vào đây */}
                    <ImageUploadControl />
                </Form.Item>
            </div>
        </div>
    );
}