'use client'
import { handleDeleteMenuItemAction } from "@/utils/actions";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, Popconfirm, Table, message, notification, Image } from "antd"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from "react";
import MenuItemCreate from "./menu-item.create";
import MenuItemUpdate from "./menu-item.update";

interface IProps {
    menuItems: any;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    menus: any[];
}

const MenuItemTable = (props: IProps) => {
    const { menuItems, meta, menus } = props;
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
                <>{(index + 1) + (meta?.current - 1) * (meta?.pageSize)}</>
            )
        },
        { title: 'Tên món', dataIndex: 'title' },
        {
            title: 'Giá (VND)',
            dataIndex: 'basePrice',
            render: (value: any) => <>{new Intl.NumberFormat().format(value)}</>
        },
        {
            title: 'Thuộc Menu',
            render: (text: any, record: any) => <>{record?.menu?.title ?? "N/A"}</>
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
                        title={"Xác nhận xóa món ăn"}
                        description={"Bạn có chắc chắn muốn xóa món ăn này?"}
                        onConfirm={async () => {
                            const res = await handleDeleteMenuItemAction(record?._id);
                            if (res?.data) {
                                message.success("Xóa thành công!");
                            } else {
                                notification.error({ message: "Lỗi", description: res?.message });
                            }
                        }}
                        okText="Xác nhận"
                        cancelText="Hủy"
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
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20
            }}>
                <span>Manage Menu Items</span>
                <Button onClick={() => setIsCreateModalOpen(true)}>Create Menu Item</Button>
            </div>
            <Table
                bordered
                dataSource={menuItems}
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
            <MenuItemCreate
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                menus={menus}
            />
            <MenuItemUpdate
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                menus={menus}
            />
        </>
    )
}

export default MenuItemTable;