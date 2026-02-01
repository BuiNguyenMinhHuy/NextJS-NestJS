'use client'
import { handleCreateRestaurantAction } from '@/utils/actions';
import { Modal, Input, Form, Row, Col, message, notification, InputNumber } from 'antd';

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
}

const RestaurantCreate = (props: IProps) => {
    const { isCreateModalOpen, setIsCreateModalOpen } = props;
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        const res = await handleCreateRestaurantAction(values);
        if (res?.data) {
            form.resetFields();
            setIsCreateModalOpen(false);
            message.success("Tạo mới thành công!");
        } else {
            notification.error({ message: "Lỗi", description: res?.message });
        }
    };

    return (
        <Modal title="Thêm mới nhà hàng" open={isCreateModalOpen} onOk={() => form.submit()} onCancel={() => setIsCreateModalOpen(false)} maskClosable={false}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[15, 5]}>
                    <Col span={12}><Form.Item label="Tên" name="name" rules={[{ required: true }]}><Input /></Form.Item></Col>
                    <Col span={12}><Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item></Col>
                    <Col span={12}><Form.Item label="Số điện thoại" name="phone" rules={[{ required: true }]}><Input /></Form.Item></Col>
                    <Col span={24}><Form.Item label="Địa chỉ" name="address" rules={[{ required: true }]}><Input.TextArea rows={2} /></Form.Item></Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default RestaurantCreate;