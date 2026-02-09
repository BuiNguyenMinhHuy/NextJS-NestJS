'use client'
import { handleDeleteMenuItemOptionAction } from "@/utils/actions";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, Popconfirm, Table, message, notification } from "antd"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from "react";
import MenuItemOptionCreate from "./menu-item-options.create";
import MenuItemOptionUpdate from "./menu-item-options.update";


interface IProps {
    menuItemOptions: any;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    menuItems: any[];
}

const MenuItemOptionTable = (props: IProps) => {
    const { menuItemOptions, meta, menuItems } = props;
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
        { title: 'Tùy chọn', dataIndex: 'title' },
        { title: 'Món ăn', render: (text: any, record: any) => record?.menuItem?.title ?? "N/A" },
        {
            title: 'Giá thêm (VND)',
            dataIndex: 'additionalPrice',
            render: (value: any) => <>{new Intl.NumberFormat('vi-VN').format(value)}</>
        },
        { title: 'Loại', dataIndex: 'optionalDescription' },
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
                        title={"Xác nhận xóa tùy chọn"}
                        description={"Bạn có chắc chắn muốn xóa lựa chọn này?"}
                        onConfirm={async () => {
                            const res = await handleDeleteMenuItemOptionAction(record?._id);
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
                <span>Manage Menu Item Options</span>
                <Button onClick={() => setIsCreateModalOpen(true)}>Create Option</Button>
            </div>
            <Table
                bordered
                dataSource={menuItemOptions}
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
            <MenuItemOptionCreate isCreateModalOpen={isCreateModalOpen} setIsCreateModalOpen={setIsCreateModalOpen} menuItems={menuItems} />
            <MenuItemOptionUpdate isUpdateModalOpen={isUpdateModalOpen} setIsUpdateModalOpen={setIsUpdateModalOpen} dataUpdate={dataUpdate} setDataUpdate={setDataUpdate} menuItems={menuItems} />
        </>
    )
}

export default MenuItemOptionTable;