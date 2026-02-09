import { auth } from "@/auth";
import GuestHeader from "@/components/layout/client/guest.header";
import GuestFooter from "@/components/layout/client/guest.footer";

export default async function GuestLayout({ children }: { children: React.ReactNode }) {
    const session = await auth(); // Lấy session ở server để tránh bị "nháy" giao diện

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <GuestHeader session={session} />
            <main style={{ flex: 1 }}>{children}</main>
            <GuestFooter />
        </div>
    );
}