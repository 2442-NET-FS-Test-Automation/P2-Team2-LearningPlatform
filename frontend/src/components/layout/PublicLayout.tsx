import Navbar from "./NavBar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
    return (
        <>
            <Navbar />
                <main className="min-h-screen">
                    <Outlet />
                </main>
            <Footer />
        </>
    );
}