'use client'
import { handleCreateMenuItemAction } from '@/utils/actions';
import { Modal, Input, Form, Row, Col, message, notification, Select, InputNumber } from 'antd';

const MenuItemCreate = (props: any) => {
    const { isCreateModalOpen, setIsCreateModalOpen, menus } = props;
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        const res = await handleCreateMenuItemAction(values);
        if (res?.data) {
            form.resetFields();
            setIsCreateModalOpen(false);
            message.success("Tạo món ăn thành công!");
        } else {
            notification.error({ message: "Lỗi", description: res?.message });
        }
    };

    return (
        <Modal title="Thêm món ăn mới" open={isCreateModalOpen} onOk={() => form.submit()} onCancel={() => setIsCreateModalOpen(false)} maskClosable={false}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[15, 10]}>
                    <Col span={24}>
                        <Form.Item label="Menu" name="menu" rules={[{ required: true }]}>
                            <Select placeholder="Chọn thực đơn" options={menus.map((m: any) => ({ label: m.title, value: m._id }))} />
                        </Form.Item>
                    </Col>
                    <Col span={12}><Form.Item label="Tên món" name="title" rules={[{ required: true }]}><Input /></Form.Item></Col>
                    <Col span={12}><Form.Item label="Giá cơ bản" name="basePrice" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
                    <Col span={24}><Form.Item label="Mô tả" name="description"><Input.TextArea /></Form.Item></Col>
                    <Col span={24}><Form.Item label="URL Hình ảnh" name="image" rules={[{ required: true }]}><Input /></Form.Item></Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default MenuItemCreate;