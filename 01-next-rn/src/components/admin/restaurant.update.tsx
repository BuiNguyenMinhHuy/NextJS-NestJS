'use client'
import { handleUpdateUserAction, handleUpdateRestaurantAction } from '@/utils/actions';
import { Modal, Input, Form, Row, Col, message, notification, InputNumber } from 'antd';
import { useEffect } from 'react';

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: (v: any) => void;
}

const RestaurantUpdate = (props: IProps) => {
    const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                name: dataUpdate.name,
                email: dataUpdate.email,
                phone: dataUpdate.phone,
                address: dataUpdate.address,
                rating: dataUpdate.rating
            })
        }
    }, [dataUpdate])

    const onFinish = async (values: any) => {
        const res = await handleUpdateRestaurantAction({ _id: dataUpdate._id, ...values });
        if (res?.data) {
            setIsUpdateModalOpen(false);
            setDataUpdate(null);
            message.success("Cập nhật thành công!");
        } else {
            notification.error({ message: "Lỗi", description: res?.message });
        }
    };

    return (
        <Modal title="Cập nhật nhà hàng" open={isUpdateModalOpen} onOk={() => form.submit()} onCancel={() => setIsUpdateModalOpen(false)}>
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

export default RestaurantUpdate;