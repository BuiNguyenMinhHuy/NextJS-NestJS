'use client'

import React from 'react';
import { Carousel, Card, Row, Col, Typography, Tag, Rate, Button, Input, Space, Dropdown, Avatar } from 'antd';
import { ShoppingOutlined, DashboardOutlined, LogoutOutlined, UserOutlined, SearchOutlined, ShopOutlined, EnvironmentOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react"; // Import session helpers
import type { MenuProps } from 'antd';

const { Title, Text } = Typography;

const HomePage = (props: any) => {
    const { restaurants, session } = props;

    const isAuthenticated = !!session?.user;

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'name',
            label: (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text strong>{session?.user?.name}</Text>
                    <Tag color="gold" style={{ width: 'fit-content', marginTop: 4 }}>
                        {session?.user?.role}
                    </Tag>
                </div>
            ),
            disabled: true,
        },
        { type: 'divider' },
        {
            key: 'profile',
            label: <Link href="/profile">Thông tin cá nhân</Link>,
            icon: <UserOutlined />,
        },
        {
            key: 'orders',
            label: <Link href="/my-orders">Đơn hàng của tôi</Link>,
            icon: <ShoppingOutlined />,
        },
        ...(session?.user?.role === 'ADMINS' ? [
            {
                key: 'dashboard',
                label: <Link href="/dashboard">Quản trị hệ thống</Link>,
                icon: <DashboardOutlined />,
            }
        ] : []),
        { type: 'divider' },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: () => signOut(),
        },
    ];

    const banners = [
        { id: 1, color: '#108ee9', title: 'Đặt món ngay - Giao hàng cực nhanh' },
        { id: 2, color: '#f50', title: 'Ưu đãi lên đến 50% cho người dùng mới' },
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <div style={{
                background: '#fff',
                padding: '10px 50px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <Title
                        level={3}
                        style={{ margin: 0, color: '#1890ff', cursor: 'pointer' }}
                    >
                        @webdemo
                    </Title>
                </Link>

                <Space>
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
            </div>
            <Carousel autoplay>
                {banners.map(item => (
                    <div key={item.id}>
                        <div style={{
                            height: '350px',
                            background: item.color,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#fff'
                        }}>
                            <Title style={{ color: '#fff' }}>{item.title}</Title>
                            <div style={{ width: '500px', marginTop: 20 }}>
                                <Input
                                    size="large"
                                    placeholder="Tìm kiếm món ăn hoặc nhà hàng..."
                                    prefix={<SearchOutlined />}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>


            <div style={{ padding: '40px 100px' }}>
                <Title level={2}><ShopOutlined /> Nhà hàng nổi bật</Title>
                <Row gutter={[24, 24]}>
                    {restaurants.map((item: any) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
                            <Card
                                hoverable
                                cover={<img alt={item.name} src={item.image || "https://placehold.co/600x400?text=Restaurant"} style={{ height: 180, objectFit: 'cover' }} />}
                            >
                                <Card.Meta
                                    title={item.name}
                                    description={<Text ellipsis={{ tooltip: item.address }}><EnvironmentOutlined /> {item.address}</Text>}
                                />
                                <div style={{ marginTop: 10 }}>
                                    <Rate disabled defaultValue={item.rating} style={{ fontSize: 12 }} />
                                    <Tag color="orange" style={{ marginLeft: 8 }}>{item.rating}/5</Tag>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            <footer style={{ textAlign: 'center', padding: '30px 0', background: '#001529', color: '#fff', marginTop: 50 }}>
                <Text style={{ color: '#fff' }}>Fullstack Project ©2026 Created by @webdemo</Text>
            </footer>
        </div>
    );
};

export default HomePage;