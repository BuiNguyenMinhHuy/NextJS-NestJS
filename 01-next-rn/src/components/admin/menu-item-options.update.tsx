'use client'
import { handleUpdateMenuItemOptionAction } from '@/utils/actions';
import { Modal, Input, Form, Row, Col, message, notification, Select, InputNumber } from 'antd';
import { useEffect } from 'react';

const MenuItemOptionUpdate = (props: any) => {
    const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate, menuItems } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                title: dataUpdate.title,
                description: dataUpdate.description,
                additionalPrice: dataUpdate.additionalPrice,
                optionalDescription: dataUpdate.optionalDescription,
                menuItem: dataUpdate.menuItem?._id
            })
        }
    }, [dataUpdate])

    const handleClose = () => {
        form.resetFields();
        setIsUpdateModalOpen(false);
        setDataUpdate(null);
    }

    const onFinish = async (values: any) => {
        const res = await handleUpdateMenuItemOptionAction({ _id: dataUpdate._id, ...values });
        if (res?.data) {
            handleClose();
            message.success("Cập nhật thành công!");
        } else {
            notification.error({ message: "Lỗi", description: res?.message });
        }
    };

    return (
        <Modal
            title="Cập nhật tùy chọn"
            open={isUpdateModalOpen}
            onOk={() => form.submit()}
            onCancel={handleClose}
            maskClosable={false}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[15, 10]}>
                    <Col span={24}>
                        <Form.Item label="Món ăn" name="menuItem" rules={[{ required: true }]}>
                            <Select options={menuItems.map((item: any) => ({ label: item.title, value: item._id }))} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Tên tùy chọn" name="title" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Giá thêm" name="additionalPrice" rules={[{ required: true }]}>
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Loại tùy chọn" name="optionalDescription" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Mô tả" name="description">
                            <Input.TextArea rows={2} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default MenuItemOptionUpdate;