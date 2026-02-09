import { sendRequest } from "@/utils/api";
import GuestContent from "@/components/layout/client/guest.content";

export default async function Home() {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants`,
        method: "GET",
        queryParams: { current: 1, pageSize: 8 },
        nextOption: { next: { tags: ['list-restaurants'] } }
    });

    return <GuestContent restaurants={res?.data?.results ?? []} />;
}