'use client'
import { Typography } from 'antd';
const { Text } = Typography;

const GuestFooter = () => {
    return (
        <footer style={{ textAlign: 'center', padding: '30px 0', background: '#001529', color: '#fff', marginTop: 50 }}>
            <Text style={{ color: '#fff' }}>Fullstack Project ©2026 Created by @webdemo</Text>
        </footer>
    );
};

export default GuestFooter;