import { sendRequest } from "@/utils/api";
import RestaurantDetail from "@/components/layout/restaurant.detail";

interface IProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const RestaurantDetailPage = async (props: IProps) => {

    const params = await props.params;
    const searchParams = await props.searchParams;

    const id = params.id;
    const menuId = searchParams?.menuId as string; // Lấy menuId từ URL


    const [resRestaurant, resMenu, resMenuItems] = await Promise.all([
        sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants/${id}`,
            method: "GET",
        }),
        sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus`,
            method: "GET",
            queryParams: { restaurant: id }
        }),
        menuId ? sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items`,
            method: "GET",
            queryParams: { menu: menuId, current: 1, pageSize: 100 }
        }) : Promise.resolve(null)
    ]);



    return (
        <RestaurantDetail
            restaurant={resRestaurant?.data}
            menus={resMenu?.data?.results ?? []}
            menuItems={resMenuItems?.data?.results ?? []}
            selectedMenuId={menuId}
        />
    );
};

export default RestaurantDetailPage;