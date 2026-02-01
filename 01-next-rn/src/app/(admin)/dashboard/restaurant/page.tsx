import { auth } from "@/auth";
import RestaurantTable from "@/components/admin/restaurant.table";
import { sendRequest } from "@/utils/api";

interface IProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

const ManageRestaurantPage = async (props: IProps) => {
    const current = props?.searchParams?.current ?? 1;
    const pageSize = props?.searchParams?.pageSize ?? 10;
    const session = await auth();

    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants`,
        method: "GET",
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ['list-restaurants'] } // Tag để revalidate dữ liệu
        }
    })

    return (
        <div>
            <RestaurantTable
                restaurants={res?.data?.results ?? []}
                meta={res?.data?.meta}
            />
        </div>
    )
}

export default ManageRestaurantPage;