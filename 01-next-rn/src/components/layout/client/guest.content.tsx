'use client'
import { Carousel, Typography, Input, Row, Col, Card, Rate, Tag } from 'antd';
import { SearchOutlined, ShopOutlined, EnvironmentOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

const GuestContent = (props: any) => {
    const { restaurants } = props;
    const banners = [
        { id: 1, color: '#108ee9', title: 'Đặt món ngay - Giao hàng cực nhanh' },
        { id: 2, color: '#f50', title: 'Ưu đãi lên đến 50% cho người dùng mới' },
    ];

    return (
        <>
            <Carousel autoplay>
                {banners.map(item => (
                    <div key={item.id}>
                        <div style={{
                            height: '350px', background: item.color, display: 'flex',
                            flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff'
                        }}>
                            <Title style={{ color: '#fff' }}>{item.title}</Title>
                            <div style={{ width: '500px', marginTop: 20 }}>
                                <Input size="large" placeholder="Tìm kiếm món ăn hoặc nhà hàng..." prefix={<SearchOutlined />} />
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
                            <Link href={`/restaurant/${item._id}`} style={{ textDecoration: 'none' }}>
                                <Card
                                    hoverable
                                    cover={<img alt={item.name} src={item.image || "https://placehold.co/600x400?text=Restaurant"} style={{ height: 180, objectFit: 'cover' }} />}
                                >
                                    <Card.Meta title={item.name} description={<Text ellipsis={{ tooltip: item.address }}><EnvironmentOutlined /> {item.address}</Text>} />
                                    <div style={{ marginTop: 10 }}>
                                        <Rate disabled defaultValue={item.rating} style={{ fontSize: 12 }} />
                                        <Tag color="orange" style={{ marginLeft: 8 }}>{item.rating}/5</Tag>
                                    </div>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    );
};

export default GuestContent;