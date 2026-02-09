import { auth } from "@/auth";
import ProfileContent from "@/components/layout/client/profile.content";
import { sendRequest } from "@/utils/api";


const ProfilePage = async () => {
    const session = await auth();

    // Fetch dữ liệu mới nhất của User từ DB
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${session?.user?._id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
    });

    return (
        <div style={{ padding: "50px 0" }}>
            <ProfileContent user={res?.data} />
        </div>
    );
};

export default ProfilePage;