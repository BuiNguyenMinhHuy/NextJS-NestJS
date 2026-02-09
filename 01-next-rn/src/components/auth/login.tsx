'use client'
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { authenticate } from '@/utils/actions';
import { useRouter } from 'next/navigation';
import ModalReactive from './modal.reactive';
import { useActionState, useEffect, useState } from 'react';
import ModalChangePassword from './modal.change.password';

const Login = () => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const [changePassword, setChangePassword] = useState(false);

    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        const res = await authenticate(username, password);

        if (res?.error) {
            return { error: res.error, code: res.code, username, _id: res?._id };
        }
        if (res?.success) {
            return { success: true };
        }
        return null;
    }, null);

    useEffect(() => {
        if (state?.success) {
            notification.success({
                title: "Đăng nhập thành công",
                description: "Chào mừng bạn đã quay trở lại!"
            });
            router.push("/");
            router.refresh();
        }

        if (state?.error) {
            // Trường hợp tài khoản chưa kích hoạt (code 2)
            if (state?.code === 2) {
                notification.warning({
                    title: "Thông báo kích hoạt",
                    description: state.error // "Tài khoản chưa được kích hoạt"
                });
                // Tự động nhảy sang trang verify với _id nhận được từ action
                if (state?._id) {
                    router.push(`/verify/${state._id}`);
                }
            } else {
                // Các lỗi đăng nhập thông thường khác
                notification.error({
                    title: "Lỗi đăng nhập",
                    description: state.error
                });
            }
        }
    }, [state]);

    return (
        <>
            <Row justify={"center"} style={{ marginTop: "30px" }}>
                <Col xs={24} md={16} lg={8}>
                    <fieldset style={{
                        padding: "15px",
                        margin: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "5px"
                    }}>
                        <legend>Đăng Nhập</legend>
                        <form action={formAction}>
                            <div style={{ marginBottom: 15 }}>
                                <label>Email:</label>
                                <Input name="username" required />
                            </div>
                            <div style={{ marginBottom: 15 }}>
                                <label>Password:</label>
                                <Input.Password name="password" required />
                            </div>

                            {/* Thêm div này để căn chỉnh nút Login và Quên mật khẩu */}
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 15
                            }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isPending}
                                    disabled={isPending}
                                >
                                    Login
                                </Button>

                                {/* Nút Quên mật khẩu kích hoạt state setChangePassword */}
                                <span
                                    onClick={() => setChangePassword(true)}
                                    style={{ cursor: "pointer", color: "#1890ff" }}
                                >
                                    Quên mật khẩu?
                                </span>
                            </div>
                        </form>
                        <Link href={"/"}><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                        <Divider />
                        <div style={{ textAlign: "center" }}>
                            Chưa có tài khoản? <Link href={"/auth/register"}>Đăng ký tại đây</Link>
                        </div>
                    </fieldset>
                </Col>
            </Row>
            <ModalReactive
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                userEmail={userEmail}
            />
            <ModalChangePassword
                isModalOpen={changePassword}
                setIsModalOpen={setChangePassword}
            />
        </>
    )
}

export default Login;