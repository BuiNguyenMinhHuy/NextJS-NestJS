import { auth } from "@/auth";
import OrderHistory from "@/components/layout/client/order.history";
import { sendRequest } from "@/utils/api";


interface IProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const MyOrdersPage = async (props: IProps) => {
    const searchParams = await props.searchParams;

    const current = searchParams?.current ?? 1;
    const pageSize = searchParams?.pageSize ?? 10;
    const session = await auth();

    // Gọi API lấy danh sách đơn hàng của User
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`,
        method: "GET",
        queryParams: { current, pageSize },
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
    });

    return (
        <div style={{ padding: "40px 100px", minHeight: "80vh" }}>
            <OrderHistory
                orders={res?.data?.results ?? []}
                meta={res?.data?.meta}
            />
        </div>
    );
}

export default MyOrdersPage;