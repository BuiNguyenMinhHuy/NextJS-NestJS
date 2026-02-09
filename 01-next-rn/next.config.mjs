/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // Cho phép tất cả các nguồn ảnh (hoặc giới hạn hostname cụ thể)
            },
        ],
    },
};

export default nextConfig;