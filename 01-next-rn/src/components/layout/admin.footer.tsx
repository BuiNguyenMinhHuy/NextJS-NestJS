'use client'
import { Layout } from 'antd';

const AdminFooter = () => {
    const { Footer } = Layout;

    return (
        <>
            <Footer style={{ textAlign: 'center' }}>
                Web Demo ©{new Date().getFullYear()} Created by @webdemo
            </Footer>
        </>
    )
}

export default AdminFooter;