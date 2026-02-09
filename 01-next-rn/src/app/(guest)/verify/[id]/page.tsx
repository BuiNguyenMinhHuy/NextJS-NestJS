import Verify from "@/components/auth/verify";

const VerifyPage = async (props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;
    const { id } = params;

    return (
        <>
            <Verify id={id} />
        </>
    )
}

export default VerifyPage;