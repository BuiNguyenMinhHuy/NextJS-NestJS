'use client'
import { handleCreateMenuAction } from '@/utils/actions';
import { Modal, Input, Form, Row, Col, message, notification, Select } from 'antd';

const MenuCreate = (props: any) => {
    const { isCreateModalOpen, setIsCreateModalOpen, restaurants } = props;
    const [form] = Form.useForm();

    const handleClose = () => {
        form.resetFields();
        setIsCreateModalOpen(false);
    }

    const onFinish = async (values: any) => {
        const res = await handleCreateMenuAction(values);
        if (res?.data) {
            handleClose();
            message.success("Tạo menu thành công!");
        } else {
            notification.error({ message: "Lỗi tạo menu", description: res?.message });
        }
    };

    return (
        <Modal title="Add new menu" open={isCreateModalOpen} onOk={() => form.submit()} onCancel={handleClose} maskClosable={false}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[15, 15]}>
                    <Col span={24}>
                        <Form.Item label="Restaurant" name="restaurant" rules={[{ required: true }]}>
                            <Select
                                placeholder="Select a restaurant"
                                options={restaurants.map((r: any) => ({ label: r.name, value: r._id }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}><Form.Item label="Title" name="title" rules={[{ required: true }]}><Input /></Form.Item></Col>
                    <Col span={24}><Form.Item label="Description" name="description"><Input.TextArea rows={2} /></Form.Item></Col>
                    <Col span={24}><Form.Item label="Image URL" name="image" rules={[{ required: true }]}><Input /></Form.Item></Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default MenuCreate;