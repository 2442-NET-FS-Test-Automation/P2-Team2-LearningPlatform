import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import Features from "../components/home/Features";
import FeaturedCourses from "../components/home/FeaturedCourses";
import { useEffect } from "react";
import { getCourseDetails} from "../api/coursesRequests";

export default function LandingPage() {
    useEffect(() => {
        console.log("id: 1")
        getCourseDetails(1).then((res) => console.log(res)).catch((e) => console.log("error", e))
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