'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';

interface ICartItem {
    _id: string;
    title: string;
    basePrice: number;
    image: string;
    quantity: number;
    restaurant: string; // Để kiểm tra xem có đặt cùng nhà hàng không
}

interface ICartContext {
    cart: ICartItem[];
    addToCart: (item: ICartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<ICartContext | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<ICartItem[]>([]);

    // Load giỏ hàng từ LocalStorage khi khởi tạo
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    // Lưu vào LocalStorage mỗi khi giỏ hàng thay đổi
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const updateQuantity = (id: string, quantity: number) => {
        setCart(prevCart => {
            if (quantity <= 0) return prevCart.filter(item => item._id !== id);
            return prevCart.map(item =>
                item._id === id ? { ...item, quantity } : item
            );
        });
    };

    const addToCart = (item: ICartItem) => {
        if (cart.length > 0 && cart[0].restaurant !== item.restaurant) {
            message.warning("Vui lòng chỉ đặt món trong cùng một nhà hàng!");
            return;
        }

        // Đưa thông báo ra ngoài để tránh bị gọi 2 lần trong Strict Mode
        message.success(`Đã thêm ${item.title} vào giỏ hàng`);

        setCart(prevCart => {
            const existingItem = prevCart.find(i => i._id === item._id);
            if (existingItem) {
                return prevCart.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item._id !== id));
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};


