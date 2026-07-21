export default function UnauthorizedPage() {
    return (
        <div className="flex h-screen items-center justify-center">
            <img src="/Unauthorized.png" alt="Unauthorized image" className="rounded-xl" width={150} height={150} />
            <h1 className="mx-10 text-3xl font-bold">401 | Unauthorized</h1>
        </div>
    );
}