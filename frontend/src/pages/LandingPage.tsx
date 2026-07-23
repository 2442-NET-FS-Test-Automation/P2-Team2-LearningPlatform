import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import Features from "../components/home/Features";
import FeaturedCourses from "../components/home/FeaturedCourses";
import { useEffect } from "react";
import { getEnabledCourses } from "../api/coursesRequests";

export default function LandingPage() {4
    useEffect(() => {
        getEnabledCourses().then((res) => console.log(res))
    }, [])
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