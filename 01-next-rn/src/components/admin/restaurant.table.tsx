'use client'
import { handleDeleteRestaurantAction } from "@/utils/actions";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, Popconfirm, Table, message, notification } from "antd"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from "react";

import RestaurantUpdate from "./restaurant.update";
import RestaurantCreate from "./restaurant.create";

interface IProps {
    restaurants: any;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    }
}

const RestaurantTable = (props: IProps) => {
    const { restaurants, meta } = props;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);

    const columns = [
        {
            title: "STT",
            render: (_: any, record: any, index: any) => (
                <>{(index + 1) + (meta.current - 1) * (meta.pageSize)}</>
            )
        },
        { title: 'Tên nhà hàng', dataIndex: 'name' },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Số điện thoại', dataIndex: 'phone' },
        {
            title: 'Actions',
            render: (text: any, record: any) => (
                <>
                    <EditTwoTone
                        twoToneColor="#f57800" style={{ cursor: "pointer", margin: "0 20px" }}
                        onClick={() => {
                            setIsUpdateModalOpen(true);
                            setDataUpdate(record);
                        }}
                    />
                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa nhà hàng"}
                        description={"Bạn có chắc chắn muốn xóa nhà hàng này?"}
                        onConfirm={async () => {
                            const res = await handleDeleteRestaurantAction(record?._id);
                            if (res?.data) {
                                message.success("Xóa thành công!");
                            } else {
                                notification.error({ message: "Lỗi", description: res?.message });
                            }
                        }}
                        okText="Xác nhận" cancelText="Hủy"
                    >
                        <span style={{ cursor: "pointer" }}>
                            <DeleteTwoTone twoToneColor="#ff4d4f" />
                        </span>
                    </Popconfirm>
                </>
            )
        }
    ];

    const onChange = (pagination: any) => {
        if (pagination && pagination.current) {
            const params = new URLSearchParams(searchParams);
            params.set('current', pagination.current);
            replace(`${pathname}?${params.toString()}`);
        }
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span>Manage Restaurants</span>
                <Button onClick={() => setIsCreateModalOpen(true)}>Create Restaurant</Button>
            </div>
            <Table
                bordered
                dataSource={restaurants}
                columns={columns}
                rowKey={"_id"}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} rows`
                }}
                onChange={onChange}
            />
            <RestaurantCreate isCreateModalOpen={isCreateModalOpen} setIsCreateModalOpen={setIsCreateModalOpen} />
            <RestaurantUpdate isUpdateModalOpen={isUpdateModalOpen} setIsUpdateModalOpen={setIsUpdateModalOpen} dataUpdate={dataUpdate} setDataUpdate={setDataUpdate} />
        </>
    )
}

export default RestaurantTable;