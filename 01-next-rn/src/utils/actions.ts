'use server'

import { auth, signIn } from "@/auth";
import { revalidateTag } from 'next/cache'
import { sendRequest } from "./api";
import { cookies } from "next/headers";


export async function authenticate(username: string, password: string) {
    try {
        const r = await signIn("credentials", {
            username: username,
            password: password,
            // callbackUrl: "/",
            redirect: false,
        })
        return { success: true };

    } catch (error) {
        const errorType = (error as any).name;

        if (errorType === "InvalidEmailPasswordError") {
            return { error: (error as any).type, code: 1 };
        }

        if (errorType === "InactiveAccountError") {
            // Khi tài khoản chưa kích hoạt, gọi thêm API để lấy _id từ email
            const res = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-active`,
                method: "POST",
                body: { email: username }
            });

            return {
                error: (error as any).type,
                code: 2,
                _id: res?.data?._id
            };
        }

        return { error: "Internal server error", code: 0 };
    }
}

export const handleRegisterAction = async (data: any) => {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
        method: "POST",
        body: { ...data }
    })
    return res;
}

export const handleCreateUserAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        method: "POST",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        body: { ...data }
    })
    revalidateTag("list-users")
    return res;
}


export const handleUpdateUserAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    revalidateTag("list-users")
    return res;
}

export const handleDeleteUserAction = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${id}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
    })

    revalidateTag("list-users")
    return res;
}

export const handleCreateRestaurantAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants`,
        method: "POST",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        body: { ...data }
    })
    revalidateTag("list-restaurants");
    return res;
}

export const handleUpdateRestaurantAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        body: { ...data }
    })
    revalidateTag("list-restaurants");
    return res;
}

export const handleDeleteRestaurantAction = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants/${id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
    })
    revalidateTag("list-restaurants");
    return res;
}

export const handleCreateMenuAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus`,
        method: "POST",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        body: { ...data }
    })
    revalidateTag("list-menus");
    return res;
}

export const handleUpdateMenuAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        body: { ...data }
    })
    revalidateTag("list-menus");
    return res;
}

export const handleDeleteMenuAction = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus/${id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
    })
    revalidateTag("list-menus");
    return res;
}

export const handleCreateMenuItemAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items`,
        method: "POST",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        body: { ...data }
    })
    revalidateTag("list-menu-items");
    return res;
}

export const handleUpdateMenuItemAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        body: { ...data }
    })
    revalidateTag("list-menu-items");
    return res;
}

export const handleDeleteMenuItemAction = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items/${id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
    })
    revalidateTag("list-menu-items");
    return res;
}


export const handleCreateMenuItemOptionAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-item-options`,
        method: "POST",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        body: { ...data }
    })
    revalidateTag("list-menu-item-options");
    return res;
}

export const handleUpdateMenuItemOptionAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-item-options`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        body: { ...data }
    })
    revalidateTag("list-menu-item-options");
    return res;
}

export const handleDeleteMenuItemOptionAction = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-item-options/${id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
    })
    revalidateTag("list-menu-item-options");
    return res;
}


export const handleUpdateProfileAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    revalidateTag("list-users") // Làm mới dữ liệu người dùng
    return res;
}

export const handleChangePasswordAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/change-password`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    return res;
}

export const handlePlaceOrderAction = async (data: any): Promise<IBackendRes<any>> => {
    const session = await auth();
    if (!session) return {
        statusCode: 401,
        message: "Vui lòng đăng nhập để đặt hàng",
        data: null // Luôn trả về thuộc tính data để tránh lỗi TS ở Client
    };

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`,
        method: "POST",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        body: { ...data }
    });
}