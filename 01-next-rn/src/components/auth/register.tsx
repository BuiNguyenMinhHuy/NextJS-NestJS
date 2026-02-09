'use client'
import React, { useActionState, useEffect } from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { sendRequest } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { handleRegisterAction } from '@/utils/actions';

const Register = () => {
    const router = useRouter()

    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const email = formData.get('email');
        const password = formData.get('password');
        const name = formData.get('name');

        const res = await handleRegisterAction({ email, password, name });
        if (res?.data) {
            router.push(`/verify/${res?.data?._id}`);
            return null;
        }
        return { error: res?.message };
    }, null);

    useEffect(() => {
        if (state?.error) {
            notification.error({ message: "Lỗi đăng ký", description: state.error });
        }
    }, [state]);

    const onFinish = async (values: any) => {
        const { email, password, name } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
            method: "POST",
            body: {
                email, password, name
            }
        })
        if (res?.data) {
            router.push(`/verify/${res?.data?._id}`);
        } else {
            notification.error({
                title: "Register error",
                description: res?.message
            })
        }
    };

    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: "15px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px"
                }}>
                    <legend>Đăng Ký Tài Khoản</legend>
                    <form action={formAction}>
                        <div style={{ marginBottom: 15 }}>
                            <label>Email:</label>
                            <Input name="email" required placeholder="Nhập email của bạn" />
                        </div>

                        <div style={{ marginBottom: 15 }}>
                            <label>Mật khẩu:</label>
                            <Input.Password name="password" required placeholder="Nhập mật khẩu" />
                        </div>

                        <div style={{ marginBottom: 15 }}>
                            <label>Họ tên:</label>
                            <Input name="name" placeholder="Nhập họ và tên" />
                        </div>

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isPending}
                            disabled={isPending}
                            block
                        >
                            Đăng ký
                        </Button>
                    </form>
                    <Link href={"/"}><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        Đã có tài khoản? <Link href={"/auth/login"}>Đăng nhập</Link>
                    </div>

                </fieldset>
            </Col>
        </Row>

    )
}

export default Register;