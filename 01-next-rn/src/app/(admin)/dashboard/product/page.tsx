import { auth } from "@/auth";
import MenuItemTable from "@/components/admin/menu-item.table";

import { sendRequest } from "@/utils/api";

interface IProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ManageProductPage = async (props: IProps) => {
    const searchParams = await props.searchParams;

    const current = searchParams?.current ?? 1;
    const pageSize = searchParams?.pageSize ?? 10;
    const session = await auth();

    // Fetch đồng thời Menu Items và danh sách Menus
    const [resMenuItem, resMenu] = await Promise.all([
        sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items`,
            method: "GET",
            queryParams: { current, pageSize },
            headers: { Authorization: `Bearer ${session?.user?.access_token}` },
            nextOption: { next: { tags: ['list-menu-items'] } }
        }),
        sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus`,
            method: "GET",
            queryParams: { current: 1, pageSize: 100 },
            headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        })
    ]);

    return (
        <div>
            <MenuItemTable
                menuItems={resMenuItem?.data?.results ?? []}
                meta={resMenuItem?.data?.meta}
                menus={resMenu?.data?.results ?? []}
            />
        </div>
    )
}

export default ManageProductPage;