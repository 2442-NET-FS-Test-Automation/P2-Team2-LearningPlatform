export default function ProfilePage(){
    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900">
            <div className="py-20 mx-auto px-8 max-w-7xl">
                <img src="/profile.jpg" alt="Profile image" className="rounded-full" />
                <p>Profile</p>
            </div>
        </div>
    );
}