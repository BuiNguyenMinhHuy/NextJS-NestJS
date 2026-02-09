'use client'
import React, { useState } from 'react';
import { Typography, Button, Space, Dropdown, Avatar, Tag, Badge } from 'antd';
import { ShoppingOutlined, DashboardOutlined, LogoutOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { signOut } from "next-auth/react";
import type { MenuProps } from 'antd';
import CartDrawer from './cart.drawer';
import { useCart } from '@/library/cart.context';
import { useHasMounted } from '@/utils/customHook';

const { Title, Text } = Typography;

const GuestHeader = (props: any) => {
    const { session } = props;
    const isAuthenticated = !!session?.user;
    const { cart } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);

    const hasMounted = useHasMounted();

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'name',
            label: (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text strong>{session?.user?.name}</Text>
                    {session?.user?.role === 'ADMINS' && (
                        <Tag color="gold" style={{ width: 'fit-content', marginTop: 4 }}>
                            {session?.user?.role}
                        </Tag>
                    )}
                </div>
            ),
            disabled: true,
        },
        { type: 'divider' },
        { key: 'profile', label: <Link href="/profile">Thông tin cá nhân</Link>, icon: <UserOutlined /> },
        { key: 'orders', label: <Link href="/my-orders">Đơn hàng của tôi</Link>, icon: <ShoppingOutlined /> },
        ...(session?.user?.role === 'ADMINS' ? [
            { key: 'dashboard', label: <Link href="/dashboard">Quản trị hệ thống</Link>, icon: <DashboardOutlined /> }
        ] : []),
        { type: 'divider' },
        { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true, onClick: () => signOut() },
    ];

    return (
        <div style={{
            background: '#fff', padding: '10px 50px', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 100
        }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
                <Title level={3} style={{ margin: 0, color: '#1890ff', cursor: 'pointer' }}>@webdemo</Title>
            </Link>

            <Space size={24}>
                {isAuthenticated && (
                    <Badge count={hasMounted ? cart.length : 0} showZero offset={[5, 0]}>
                        <Button
                            type="text"
                            icon={<ShoppingCartOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                            onClick={() => setIsCartOpen(true)}
                        />
                    </Badge>
                )}
                {isAuthenticated ? (
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                            <Text>Chào, {session?.user?.name?.split(' ').pop()}</Text>
                        </Space>
                    </Dropdown>
                ) : (
                    <>
                        <Link href="/auth/login"><Button type="text">Đăng nhập</Button></Link>
                        <Link href="/auth/register"><Button type="primary">Đăng ký</Button></Link>
                    </>
                )}
            </Space>
            <CartDrawer isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
        </div>
    );
};

export default GuestHeader;