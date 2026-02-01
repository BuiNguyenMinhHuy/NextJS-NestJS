'use client'
import { handleUpdateMenuItemAction } from '@/utils/actions';
import { Modal, Input, Form, Row, Col, message, notification, Select, InputNumber } from 'antd';
import { useEffect } from 'react';

const MenuItemUpdate = (props: any) => {
    const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate, menus } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                title: dataUpdate.title,
                description: dataUpdate.description,
                basePrice: dataUpdate.basePrice,
                image: dataUpdate.image,
                menu: dataUpdate.menu?._id // Lấy ID để khớp với Select
            })
        }
    }, [dataUpdate])

    const handleClose = () => {
        form.resetFields();
        setIsUpdateModalOpen(false);
        setDataUpdate(null);
    }

    const onFinish = async (values: any) => {
        const res = await handleUpdateMenuItemAction({ _id: dataUpdate._id, ...values });
        if (res?.data) {
            handleClose();
            message.success("Cập nhật món ăn thành công!");
        } else {
            notification.error({ message: "Lỗi", description: res?.message });
        }
    };

    return (
        <Modal title="Cập nhật món ăn" open={isUpdateModalOpen} onOk={() => form.submit()} onCancel={handleClose} maskClosable={false}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[15, 10]}>
                    <Col span={24}>
                        <Form.Item label="Menu" name="menu" rules={[{ required: true }]}>
                            <Select options={menus.map((m: any) => ({ label: m.title, value: m._id }))} />
                        </Form.Item>
                    </Col>
                    <Col span={12}><Form.Item label="Tên món" name="title" rules={[{ required: true }]}><Input /></Form.Item></Col>
                    <Col span={12}><Form.Item label="Giá cơ bản" name="basePrice" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
                    <Col span={24}><Form.Item label="Mô tả" name="description"><Input.TextArea rows={2} /></Form.Item></Col>
                    <Col span={24}><Form.Item label="URL Hình ảnh" name="image"><Input /></Form.Item></Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default MenuItemUpdate;