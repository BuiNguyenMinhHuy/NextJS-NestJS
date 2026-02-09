'use client'

import { Form, Input, Modal, message, notification } from "antd";
import { handleChangePasswordAction } from "@/utils/actions";

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
}

const ModalChangePasswordProfile = (props: IProps) => {
    const { isModalOpen, setIsModalOpen } = props;
    const [form] = Form.useForm();

    const handleClose = () => {
        form.resetFields();
        setIsModalOpen(false);
    }

    const onFinish = async (values: any) => {
        const { oldPassword, newPassword, confirmPassword } = values;
        if (newPassword !== confirmPassword) {
            notification.error({
                title: "Lỗi dữ liệu",
                description: "Mật khẩu mới và xác nhận mật khẩu không khớp!"
            });
            return;
        }

        const res = await handleChangePasswordAction({ oldPassword, newPassword, confirmPassword });

        if (res?.data) {
            message.success("Đổi mật khẩu thành công!");
            handleClose();
        } else {
            notification.error({
                title: "Lỗi đổi mật khẩu",
                description: res?.message
            });
        }
    };

    return (
        <Modal
            title="Thay đổi mật khẩu"
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={handleClose}
            maskClosable={false}
            okText="Cập nhật"
            cancelText="Hủy"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Mật khẩu hiện tại"
                    name="oldPassword"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu mới!' }]}
                >
                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalChangePasswordProfile;