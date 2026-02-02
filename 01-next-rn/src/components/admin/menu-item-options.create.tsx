'use client'
import { handleCreateMenuItemOptionAction } from '@/utils/actions';
import { Modal, Input, Form, Row, Col, message, notification, Select, InputNumber } from 'antd';

const MenuItemOptionCreate = (props: any) => {
    const { isCreateModalOpen, setIsCreateModalOpen, menuItems } = props;
    const [form] = Form.useForm();

    const handleClose = () => {
        form.resetFields();
        setIsCreateModalOpen(false);
    }

    const onFinish = async (values: any) => {
        const res = await handleCreateMenuItemOptionAction(values);
        if (res?.data) {
            handleClose();
            message.success("Tạo tùy chọn thành công!");
        } else {
            notification.error({ message: "Lỗi", description: res?.message });
        }
    };

    return (
        <Modal
            title="Thêm tùy chọn mới (Topping/...)"
            open={isCreateModalOpen}
            onOk={() => form.submit()}
            onCancel={handleClose}
            maskClosable={false}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[15, 10]}>
                    <Col span={24}>
                        <Form.Item label="Thuộc món ăn" name="menuItem" rules={[{ required: true }]}>
                            <Select
                                placeholder="Chọn món ăn"
                                options={menuItems.map((item: any) => ({ label: item.title, value: item._id }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Tên tùy chọn" name="title" rules={[{ required: true }]}>
                            <Input placeholder="VD: Thêm Trân Châu" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Giá thêm" name="additionalPrice" rules={[{ required: true }]}>
                            <InputNumber min={0} style={{ width: '100%' }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Loại tùy chọn" name="optionalDescription" rules={[{ required: true }]}>
                            <Input placeholder="VD: Topping, Size, Sugar level..." />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Mô tả chi tiết" name="description">
                            <Input.TextArea rows={2} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default MenuItemOptionCreate;