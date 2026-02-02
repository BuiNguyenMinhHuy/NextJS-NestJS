import { auth } from "@/auth";
import MenuItemOptionTable from "@/components/admin/menu-item-options.table";

import { sendRequest } from "@/utils/api";

interface IProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

const ManageMenuItemOptionPage = async (props: IProps) => {
    const current = props?.searchParams?.current ?? 1;
    const pageSize = props?.searchParams?.pageSize ?? 10;
    const session = await auth();

    // Fetch đồng thời Menu Item Options và danh sách Menu Items
    const [resOption, resMenuItem] = await Promise.all([
        sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-item-options`,
            method: "GET",
            queryParams: { current, pageSize },
            headers: { Authorization: `Bearer ${session?.user?.access_token}` },
            nextOption: { next: { tags: ['list-menu-item-options'] } }
        }),
        sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items`,
            method: "GET",
            queryParams: { current: 1, pageSize: 100 },
            headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        })
    ]);

    return (
        <div>
            <MenuItemOptionTable
                menuItemOptions={resOption?.data?.results ?? []}
                meta={resOption?.data?.meta}
                menuItems={resMenuItem?.data?.results ?? []}
            />
        </div>
    )
}

export default ManageMenuItemOptionPage;