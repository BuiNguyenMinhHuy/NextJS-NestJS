'use client '

import { useHasMounted } from "@/utils/customHook";
import { Button, Form, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { Steps } from 'antd';
import { sendRequest } from "@/utils/api";
const ModalReactive = (props: any) => {
    const { isModalOpen, setIsModalOpen, userEmail } = props;
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [userId, setUserId] = useState("");

    useEffect(() => {
        form.setFieldsValue({
            email: userEmail
        });
    }, [userEmail]);
    const hasMount = useHasMounted();
    if (!hasMount) return <></>

    const onFinishStep0 = async (values: any) => {
        const { email } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-active`,
            method: "POST",
            body: {
                email
            }


        })
        if (res?.data) {
            setUserId(res?.data?._id)
            setCurrent(1);
        } else {
            notification.error({
                message: 'Call APIs error',
                description: res?.message || 'Unknown error',
            })
        }
    }
    const onFinishStep1 = async (values: any) => {
        const { code } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
            method: "POST",
            body: {
                code, _id: userId
            }
        })
        if (res?.data) {
            setCurrent(2);
        } else {
            notification.error({
                message: 'Register Failed',
                description: res?.message || 'Unknown error',
            })
        }
    }
    return (
        <Modal
            title="Active Account Steps"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
            maskClosable={false}
            footer={null}
        >
            <Steps
                current={current}


                items={[
                    {
                        title: 'Login',
                        status: 'finish',
                        icon: <UserOutlined />,
                    },
                    {
                        title: 'Verification',
                        //status: 'finish',
                        icon: <SolutionOutlined />,
                    },

                    {
                        title: 'Done',
                        // status: 'wait',
                        icon: <SmileOutlined />,
                    },
                ]}
            />

            {
                current === 0 && <><div style={{ marginTop: "20px" }}>
                    <p>Your account is inactive.</p>
                </div>
                    <Form
                        name="basic"
                        onFinish={onFinishStep0}
                        autoComplete="off"
                        layout='vertical'
                        form={form}
                    >
                        <Form.Item
                            label=""
                            name="email"

                        >
                            <Input disabled value={userEmail} />
                        </Form.Item>

                        <Form.Item
                        >
                            <Button type="primary" htmlType="submit">
                                Resend
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            }


            {
                current === 1 && <><div style={{ marginTop: "20px" }}>
                    <p>Please fill your code</p>
                </div>
                    <Form
                        name="basic"
                        onFinish={onFinishStep1}
                        autoComplete="off"
                        layout='vertical'
                        form={form}
                    >
                        <Form.Item
                            label="Code"
                            name="code"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your code!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                        >
                            <Button type="primary" htmlType="submit">
                                Active
                            </Button>
                        </Form.Item>
                    </Form></>
            }
            {
                current === 2 && <div style={{ marginTop: "20px" }}>
                    <p>Your account was be active successful</p>

                </div>
            }
        </Modal>
    );
}
export default ModalReactive;