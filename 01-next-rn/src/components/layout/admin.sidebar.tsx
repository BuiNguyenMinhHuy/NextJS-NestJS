'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    AppstoreOutlined,
    MailOutlined,
    SettingOutlined,
    TeamOutlined,
    ShopOutlined,
    MenuOutlined,
    CoffeeOutlined,
    PlusSquareOutlined

} from '@ant-design/icons';
import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from "@/library/admin.context";
import { Skeleton, type MenuProps } from 'antd';
import Link from 'next/link'
import { usePathname } from "next/navigation";
import { useHasMounted } from "@/utils/customHook";

type MenuItem = Required<MenuProps>['items'][number];
const AdminSideBar = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(AdminContext)!;
    const pathname = usePathname();
    const hasMounted = useHasMounted();


    const getSelectedKey = (path: string) => {
        if (path.includes('/dashboard/user')) return 'users';
        if (path.includes('/dashboard/restaurant')) return 'restaurants';
        if (path.includes('/dashboard/menu-item-options')) return 'menu-item-options';
        if (path.includes('/dashboard/menu')) return 'menus';
        if (path.includes('/dashboard/product')) return 'menu-items';
        if (path === '/dashboard') return 'dashboard';
        return '';
    };
    const currentKey = getSelectedKey(pathname);

    if (!hasMounted) {
        return (
            <Sider collapsed={collapseMenu}>
                <div style={{ padding: '16px', fontWeight: 'bold', textAlign: 'center' }}>WEB DEMO</div>
                <div style={{ height: '100vh', background: '#fff' }}></div>
            </Sider>
        );
    }

    const items: MenuItem[] = [

        {
            key: 'grp',
            label: (
                <Link href="/" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }}>
                    WEB DEMO
                </Link>
            ),
            type: 'group',
            children: [
                {
                    key: "dashboard",
                    label: <Link href={"/dashboard"}>Dashboard</Link>,
                    icon: <AppstoreOutlined />,
                },

                {
                    key: "users",
                    label: <Link href={"/dashboard/user"}>Manage Users</Link>,
                    icon: <TeamOutlined />,
                },
                {
                    key: "restaurants",
                    label: <Link href={"/dashboard/restaurant"}>Manage Restaurants</Link>,
                    icon: <ShopOutlined />,
                },
                {
                    key: "menus",
                    label: <Link href={"/dashboard/menu"}>Manage Menus</Link>,
                    icon: <MenuOutlined />,
                },

                {
                    key: "menu-items",
                    label: <Link href={"/dashboard/product"}>Manage Menu Items</Link>,
                    icon: <CoffeeOutlined />,
                },

                {
                    key: "menu-item-options",
                    label: <Link href={"/dashboard/menu-item-options"}>Menu Item Options</Link>,
                    icon: <PlusSquareOutlined />,
                },
                {
                    key: 'sub1',
                    label: 'Navigation One',
                    icon: <MailOutlined />,
                    children: [
                        {
                            key: 'g1',
                            label: 'Item 1',
                            type: 'group',
                            children: [
                                { key: '1', label: 'Option 1' },
                                { key: '2', label: 'Option 2' },
                            ],
                        },
                        {
                            key: 'g2',
                            label: 'Item 2',
                            type: 'group',
                            children: [
                                { key: '3', label: 'Option 3' },
                                { key: '4', label: 'Option 4' },
                            ],
                        },
                    ],
                },
                {
                    key: 'sub2',
                    label: 'Navigation Two',
                    icon: <AppstoreOutlined />,
                    children: [
                        { key: '5', label: 'Option 5' },
                        { key: '6', label: 'Option 6' },
                        {
                            key: 'sub3',
                            label: 'Submenu',
                            children: [
                                { key: '7', label: 'Option 7' },
                                { key: '8', label: 'Option 8' },
                            ],
                        },
                    ],
                },
                {
                    type: 'divider',
                },
                {
                    key: 'sub4',
                    label: 'Navigation Three',
                    icon: <SettingOutlined />,
                    children: [
                        { key: '9', label: 'Option 9' },
                        { key: '10', label: 'Option 10' },
                        { key: '11', label: 'Option 11' },
                        { key: '12', label: 'Option 12' },
                    ],
                },
            ],
        },
    ];

    return (
        <Sider
            collapsed={collapseMenu}
        >

            <Menu
                mode="inline"
                selectedKeys={[currentKey]}
                items={items}
                style={{ height: '100vh' }}
            />
        </Sider>
    )
}

export default AdminSideBar;    