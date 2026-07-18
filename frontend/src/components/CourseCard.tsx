import { Link } from "react-router-dom";
import type { CourseCardProps } from "../lib/types";

export default function CourseCard({
    Id,
    Name,
    Description,
    CategoryName
}: CourseCardProps) {
    return (
        <Link to={"/courses/" + Id} className="no-underline">
            <div key={Name} className="card p-3">
                <img src={"/course_img/" + CategoryName + ".jpg"} alt={CategoryName + " image"} className="rounded-xl aspect-video"/>
                <div className="p-4">
                    <h3 className="text-xl font-semibold dark:text-white">{Name}</h3>
                    <p className="mt-3 text-slate-600 dark:text-slate-300">{Description}</p>
                    <p className="mt-8 text-slate-600 dark:text-slate-300">{CategoryName}</p>
                </div>
            </div>
        </Link>
    );
}