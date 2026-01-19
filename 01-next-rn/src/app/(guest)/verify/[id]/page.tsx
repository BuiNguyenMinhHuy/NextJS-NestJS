import Verify from "@/components/auth/verify";

const verifyPage = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {
    const { id } = await params;
    return (
        <>
            <Verify id={id}

            />
        </>
    )
}
export default verifyPage;