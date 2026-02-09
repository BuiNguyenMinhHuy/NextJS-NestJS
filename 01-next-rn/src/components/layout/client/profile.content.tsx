'use client'

import { Row, Col, Form, Input, Button, Card, message, notification, Typography, Divider, Space } from 'antd';
import { UserOutlined, PhoneOutlined, HomeOutlined, MailOutlined, SaveOutlined, KeyOutlined } from '@ant-design/icons';
import { handleUpdateProfileAction } from '@/utils/actions';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ModalChangePasswordProfile from './modal.change.password.profile';

const { Title } = Typography;

const ProfileContent = (props: any) => {
    const { user } = props;
    const [form] = Form.useForm();
    const router = useRouter();
    const { update } = useSession();

    // State quản lý Modal đổi mật khẩu
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState<boolean>(false);

    const onFinish = async (values: any) => {
        const { name, phone, address } = values;
        const res = await handleUpdateProfileAction({
            _id: user._id,
            name, phone, address
        });

        if (res?.data) {
            await update({ name: name });
            message.success("Cập nhật thông tin cá henna thành công!");
            router.refresh();
        } else {
            notification.error({
                title: "Lỗi cập nhật",
                description: res?.message
            });
        }
    };

    return (
        <Row justify="center">
            <Col xs={24} md={18} lg={12}>
                <Card variant="borderless" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
                    <div style={{ textAlign: 'center', marginBottom: 30 }}>
                        <Title level={2}>Thông Tin Cá Nhân</Title>
                        <Typography.Text type="secondary">Cập nhật thông tin liên lạc của bạn</Typography.Text>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            email: user?.email,
                            name: user?.name,
                            phone: user?.phone,
                            address: user?.address
                        }}
                    >
                        {/* Các trường Email, Tên, SĐT, Địa chỉ giữ nguyên như code cũ */}
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="Email (Không thể thay đổi)" name="email">
                                    <Input prefix={<MailOutlined />} disabled />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                                    <Input prefix={<UserOutlined />} placeholder="Nhập tên của bạn" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Số điện thoại" name="phone">
                                    <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại liên lạc" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Địa chỉ" name="address">
                                    <Input prefix={<HomeOutlined />} placeholder="Địa chỉ hiện tại" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider />

                        <Form.Item style={{ marginBottom: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    icon={<KeyOutlined />}
                                    onClick={() => setIsChangePasswordModalOpen(true)}
                                >
                                    Đổi mật khẩu
                                </Button>
                                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                                    Lưu Thay Đổi
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>

            {/* Modal đổi mật khẩu */}
            <ModalChangePasswordProfile
                isModalOpen={isChangePasswordModalOpen}
                setIsModalOpen={setIsChangePasswordModalOpen}
            />
        </Row>
    );
};

export default ProfileContent;