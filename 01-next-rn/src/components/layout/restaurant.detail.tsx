'use client'

import { Row, Col, Typography, Card, Divider, Tag, Button } from "antd";
import { EnvironmentOutlined, PlusOutlined } from "@ant-design/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/library/cart.context";
import { useSession } from "next-auth/react";

const { Title, Text } = Typography;

const RestaurantDetail = (props: any) => {
    const { restaurant, menus, menuItems, selectedMenuId } = props;
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { addToCart } = useCart();
    const { data: session } = useSession();

    const handleAddToCart = (item: any) => {
        if (!session) {
            router.push('/auth/login'); // Chưa login thì đá sang trang đăng nhập
            return;
        }
        addToCart({
            _id: item._id, title: item.title, basePrice: item.basePrice,
            image: item.image, quantity: 1, restaurant: restaurant?._id
        });
    };

    const handleSelectMenu = (id: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('menuId', id);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div style={{ padding: "20px 100px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <Card variant="borderless" style={{ marginBottom: 20 }}>
                <Row gutter={24}>
                    <Col span={6}>
                        <img src={restaurant?.image || "https://placehold.co/600x400?text=Restaurant"} style={{ width: "100%", borderRadius: 8, height: 180, objectFit: 'cover' }} />
                    </Col>
                    <Col span={18}>
                        <Title level={2}>{restaurant?.name}</Title>
                        <Text><EnvironmentOutlined /> {restaurant?.address}</Text>
                        <div style={{ marginTop: 10 }}><Tag color="orange">{restaurant?.rating}/5 sao</Tag></div>
                    </Col>
                </Row>
            </Card>

            <Title level={3}>Thực đơn</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 30 }}>
                {(menus ?? []).map((menu: any) => ( // Thêm ?? [] để tránh lỗi map của undefined
                    <Col span={6} key={menu._id}>
                        <Card hoverable onClick={() => handleSelectMenu(menu._id)} style={{ border: selectedMenuId === menu._id ? "2px solid #1890ff" : "none" }} cover={<img src={menu.image} style={{ height: 120, objectFit: 'cover' }} />}>
                            <Card.Meta title={menu.title} />
                        </Card>
                    </Col>
                ))}
            </Row>

            {selectedMenuId && (
                <>
                    <Divider titlePlacement="left"><Title level={3}>Danh sách món ăn</Title></Divider>
                    <Row gutter={[16, 16]}>
                        {(menuItems ?? []).map((item: any) => (
                            <Col span={12} key={item._id}>
                                <Card hoverable>
                                    <Row gutter={16} align="middle">
                                        <Col span={6}><img src={item.image} style={{ width: '100%', borderRadius: 4, height: 80, objectFit: 'cover' }} /></Col>
                                        <Col span={14}>
                                            <Text strong style={{ fontSize: 16 }}>{item.title}</Text>
                                            <div style={{ margin: "5px 0" }}><Text type="secondary" ellipsis>{item.description}</Text></div>
                                            <Text type="danger" strong>{new Intl.NumberFormat('vi-VN').format(item.basePrice)} VND</Text>
                                        </Col>
                                        <Col span={4} style={{ textAlign: 'right' }}>
                                            <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => handleAddToCart(item)} />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </div>
    );
};

export default RestaurantDetail;