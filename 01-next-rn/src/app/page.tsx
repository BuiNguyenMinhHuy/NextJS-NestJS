import { sendRequest } from "@/utils/api";
import HomePage from "@/components/layout/homepage";
import { auth } from "@/auth"; // Import hàm auth để lấy session ở server

export default async function Home() {
  // Lấy session và danh sách nhà hàng song song để tối ưu tốc độ
  const [session, res] = await Promise.all([
    auth(),
    sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants`,
      method: "GET",
      queryParams: { current: 1, pageSize: 8 },
    })
  ]);

  return (
    // Truyền session trực tiếp vào HomePage
    <HomePage
      restaurants={res?.data?.results ?? []}
      session={session}
    />
  );
}