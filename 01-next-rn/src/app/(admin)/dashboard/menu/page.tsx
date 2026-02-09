import { auth } from "@/auth";
import MenuTable from "@/components/admin/menu.table";
import { sendRequest } from "@/utils/api";

interface IProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ManageMenuPage = async (props: IProps) => {
    const searchParams = await props.searchParams;

    const current = searchParams?.current ?? 1;
    const pageSize = searchParams?.pageSize ?? 10;
    const session = await auth();

    const [resMenu, resRestaurant] = await Promise.all([
        sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus`,
            method: "GET",
            queryParams: { current, pageSize },
            headers: { Authorization: `Bearer ${session?.user?.access_token}` },
            nextOption: { next: { tags: ['list-menus'] } }
        }),
        sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants`,
            method: "GET",
            queryParams: { current: 1, pageSize: 100 },
            headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        })
    ]);

    return (
        <div>
            <MenuTable
                menus={resMenu?.data?.results ?? []}
                meta={resMenu?.data?.meta}
                restaurants={resRestaurant?.data?.results ?? []}
            />
        </div>
    )
}

export default ManageMenuPage;