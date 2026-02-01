'use client'
import { handleDeleteMenuAction } from "@/utils/actions";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, Popconfirm, Table, message, notification, Image } from "antd"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from "react";
import MenuCreate from "./menu.create";
import MenuUpdate from "./menu.update";


interface IProps {
    menus: any;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    restaurants: any[];
}

const MenuTable = (props: IProps) => {
    const { menus, meta, restaurants } = props;
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
        { title: 'Tiêu đề', dataIndex: 'title' },
        {
            title: 'Nhà hàng',
            render: (text: any, record: any) => <>{record?.restaurant?.name ?? "N/A"}</>
        },
        {
            title: 'Hình ảnh',
            render: (text: any, record: any) => (
                <Image src={record.image} width={50} height={50} style={{ objectFit: 'cover' }} />
            )
        },
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
                        title={"Xác nhận xóa menu"}
                        description={"Bạn có chắc chắn muốn xóa thực đơn này?"}
                        onConfirm={async () => {
                            const res = await handleDeleteMenuAction(record?._id);
                            if (res?.data) message.success("Xóa thành công!");
                            else notification.error({ message: "Lỗi", description: res?.message });
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
                <span>Manage Menus</span>
                <Button onClick={() => setIsCreateModalOpen(true)}>Create Menu</Button>
            </div>
            <Table
                bordered
                dataSource={menus}
                columns={columns}
                rowKey={"_id"}
                pagination={{

                    current: meta?.current,
                    pageSize: meta?.pageSize,
                    total: meta?.total ?? 0,
                    showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} rows`
                }}
                onChange={onChange}
            />
            <MenuCreate
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                restaurants={restaurants}
            />
            <MenuUpdate
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                restaurants={restaurants}
            />
        </>
    )
}

export default MenuTable;