export default function NotFoundPage() {
    return(
        <div className="flex h-screen items-center justify-center">
            <img src="/NotFound.png" alt="Not Found image" className="rounded-xl" width={150} height={150}/>
            <h1 className="mx-10 text-3xl font-bold">404 | Page Not Found</h1>
        </div>
    );
}