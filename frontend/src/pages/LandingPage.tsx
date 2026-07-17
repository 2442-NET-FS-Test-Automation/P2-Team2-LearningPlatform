import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import Features from "../components/home/Features";
import FeaturedCourses from "../components/home/FeaturedCourses";

export default function LandingPage() {
    return (
        <>
            <main>
                <Hero />
                <Stats />
                <Features />
                <FeaturedCourses />
            </main>
        </>
    );
}