'use client'
import { handleUpdateMenuAction } from '@/utils/actions';
import { Modal, Input, Form, Row, Col, message, notification, Select } from 'antd';
import { useEffect } from 'react';

const MenuUpdate = (props: any) => {
    const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate, restaurants } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                title: dataUpdate.title,
                description: dataUpdate.description,
                image: dataUpdate.image,
                restaurant: dataUpdate.restaurant?._id
            })
        }
    }, [dataUpdate])

    const handleClose = () => {
        form.resetFields();
        setIsUpdateModalOpen(false);
        setDataUpdate(null);
    }

    const onFinish = async (values: any) => {
        const res = await handleUpdateMenuAction({ _id: dataUpdate._id, ...values });
        if (res?.data) {
            handleClose();
            message.success("Cập nhật thành công!");
        } else {
            notification.error({ message: "Lỗi cập nhật", description: res?.message });
        }
    };

    return (
        <Modal title="Update menu" open={isUpdateModalOpen} onOk={() => form.submit()} onCancel={handleClose} maskClosable={false}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[15, 15]}>
                    <Col span={24}>
                        <Form.Item label="Restaurant" name="restaurant" rules={[{ required: true }]}>
                            <Select options={restaurants.map((r: any) => ({ label: r.name, value: r._id }))} />
                        </Form.Item>
                    </Col>
                    <Col span={24}><Form.Item label="Title" name="title" rules={[{ required: true }]}><Input /></Form.Item></Col>
                    <Col span={24}><Form.Item label="Description" name="description"><Input.TextArea rows={2} /></Form.Item></Col>
                    <Col span={24}><Form.Item label="Image URL" name="image"><Input /></Form.Item></Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default MenuUpdate;