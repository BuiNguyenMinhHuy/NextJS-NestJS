'use client'

import { Table, Tag, Typography, Card } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import dayjs from 'dayjs'; // Thư viện xử lý thời gian đã có trong package.json của bạn

const { Title, Text } = Typography;

interface IProps {
    orders: any[];
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
}

const OrderHistory = (props: IProps) => {
    const { orders, meta } = props;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // Hàm xử lý khi người dùng chuyển trang
    const onChange = (pagination: any) => {
        if (pagination && pagination.current) {
            const params = new URLSearchParams(searchParams);
            params.set('current', pagination.current);
            replace(`${pathname}?${params.toString()}`);
        }
    };

    // Định nghĩa các cột cho bảng đơn hàng
    const columns: ColumnsType<any> = [
        {
            title: 'STT',
            key: 'index',
            width: 70,
            render: (_, __, index) => (index + 1) + (meta.current - 1) * meta.pageSize,
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: '_id',
            key: '_id',
            render: (id) => <Text copyable>{id}</Text>,
        },
        {
            title: 'Nhà hàng',
            dataIndex: ['restaurant', 'name'],
            key: 'restaurantName',
            render: (name) => <Text strong>{name ?? 'N/A'}</Text>,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => (
                <Text type="danger" strong>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                </Text>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'blue';
                let text = status;
                if (status === 'PENDING') color = 'warning';
                if (status === 'COMPLETED') color = 'success';
                if (status === 'CANCELLED') color = 'error';
                return <Tag color={color}>{text.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
    ];

    return (
        <Card variant="borderless" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ marginBottom: 20 }}>
                <Title level={3}>Lịch sử đơn hàng</Title>
                <Text type="secondary">Xem lại danh sách các món ăn bạn đã đặt</Text>
            </div>

            <Table
                columns={columns}
                dataSource={orders}
                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} đơn hàng`,
                }}
                onChange={onChange}
                bordered
            />
        </Card>
    );
};

export default OrderHistory;