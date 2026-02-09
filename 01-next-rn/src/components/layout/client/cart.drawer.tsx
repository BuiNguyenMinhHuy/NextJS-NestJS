'use client'

import { Drawer, List, Avatar, Button, Typography, Space, InputNumber, message, notification, Flex } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '@/library/cart.context';
import { handlePlaceOrderAction } from '@/utils/actions';
import { useRouter } from 'next/navigation';

const CartDrawer = (props: any) => {
    const { isCartOpen, setIsCartOpen } = props;
    const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
    const router = useRouter();

    const totalPrice = cart.reduce((acc, item) => acc + (item.basePrice * item.quantity), 0);

    const handleConfirmOrder = async () => {
        if (cart.length === 0) return;
        const orderData = {
            restaurant: cart[0].restaurant,
            totalPrice: totalPrice,
            detail: cart.map(item => ({ menuItem: item._id, quantity: item.quantity, price: item.basePrice }))
        };

        const res = await handlePlaceOrderAction(orderData);
        // Kiểm tra đúng kiểu dữ liệu IBackendRes
        if (res && 'data' in res && res.data) {
            message.success("Đặt hàng thành công!");
            clearCart();
            setIsCartOpen(false);
            router.push('/my-orders');
        } else {
            const errorMsg = (res as any)?.message || "Vui lòng đăng nhập để thực hiện";
            notification.error({ message: "Lỗi đặt hàng", description: errorMsg });
        }
    };

    return (
        <Drawer
            title={<Space><ShoppingCartOutlined /> Giỏ hàng của bạn</Space>}
            placement="right"
            onClose={() => setIsCartOpen(false)}
            open={isCartOpen}
            styles={{
                wrapper: { width: 450 }
            }}
            footer={
                <div style={{ padding: '10px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' }}>
                        <Typography.Text strong style={{ fontSize: 16 }}>Tổng cộng:</Typography.Text>
                        <Typography.Text type="danger" strong style={{ fontSize: 18 }}>
                            {new Intl.NumberFormat('vi-VN').format(totalPrice)} VND
                        </Typography.Text>
                    </div>
                    <Button type="primary" block size="large" disabled={cart.length === 0} onClick={handleConfirmOrder}>
                        Xác nhận đặt hàng
                    </Button>
                </div>
            }
        >
            <Flex vertical gap="middle">
                {cart.map((item) => (
                    <div key={item._id} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 15 }}>
                        <Flex align="start" justify="space-between">
                            <Flex gap="middle">
                                <Avatar shape="square" size={64} src={item.image} />
                                <Flex vertical>
                                    <Typography.Text strong>{item.title}</Typography.Text>
                                    <Typography.Text strong type="danger">
                                        {new Intl.NumberFormat('vi-VN').format(item.basePrice)} VND
                                    </Typography.Text>
                                    <Space style={{ marginTop: 5 }}>
                                        <Typography.Text type="secondary">Số lượng:</Typography.Text>
                                        <InputNumber
                                            min={1}
                                            value={item.quantity}
                                            onChange={(val) => updateQuantity(item._id, val as number)}
                                        />
                                    </Space>
                                </Flex>
                            </Flex>
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => removeFromCart(item._id)}
                            />
                        </Flex>
                    </div>
                ))}
            </Flex>
        </Drawer>
    );
};

export default CartDrawer;