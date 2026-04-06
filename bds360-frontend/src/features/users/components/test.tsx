import type { UserFilterRequest } from '@/features/users/api/types';
import { Alert, Pagination, Spin, Table } from 'antd'; // Giả sử bạn dùng Ant Design
import { useState } from 'react';
import { useGetUsersQuery } from '../api/user.queries';

export const UserList = () => {
    // 1. Quản lý Params (Filter, Phân trang) gửi lên API
    const [queryParams, setQueryParams] = useState<UserFilterRequest>({
        page: 0, // Backend thường đếm từ 0
        size: 10,
    });

    // 2. Gọi Hook lấy dữ liệu
    // data ở đây ĐÃ ĐƯỢC TỰ ĐỘNG HIỂU là UserPaginatedResponse 
    const { data, isLoading, isError, error } = useGetUsersQuery(queryParams);

    // 3. Xử lý trạng thái Loading
    if (isLoading) {
        return <Spin tip="Đang tải danh sách người dùng..." />;
    }

    // 4. Xử lý trạng thái Lỗi
    if (isError) {
        return <Alert message="Lỗi tải dữ liệu" description={error.message} type="error" />;
    }

    // Lấy mảng dữ liệu thực tế an toàn (Fallback về [] nếu không có)
    const users = data?.content || [];

    return (
        <div className="user-list-container">
            <h2>Danh sách người dùng</h2>

            {/* Render danh sách */}
            <Table
                dataSource={users}
                rowKey="id"
                pagination={false} // Tắt phân trang mặc định của Table để dùng cái custom bên dưới
            >
                {/* Lúc này bạn gõ record. sẽ tự động gợi ý các trường của User (name, email...) */}
                <Table.Column title="ID" dataIndex="id" key="id" />
                <Table.Column title="Tên người dùng" dataIndex="name" key="name" />
                <Table.Column title="Email" dataIndex="email" key="email" />
                <Table.Column title="Vai trò" dataIndex="role" key="role" />
            </Table>

            {/* 5. Phân trang */}
            {data && (
                <div style={{ marginTop: 20, textAlign: 'right' }}>
                    <Pagination
                        current={(data.currentPage ?? 0) + 1} // Giao diện thường đếm từ 1, Backend đếm từ 0
                        pageSize={data.pageSize}
                        total={data.totalElements}
                        onChange={(page, pageSize) => {
                            setQueryParams((prev) => ({
                                ...prev,
                                page: page - 1,
                                size: pageSize,
                            }));
                        }}
                    />
                </div>
            )}
        </div>
    );
};