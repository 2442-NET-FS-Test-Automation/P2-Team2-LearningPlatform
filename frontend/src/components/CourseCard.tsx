import { Link } from "react-router-dom";

export type CourseCardProps = {
    Id: number,
    Name: string,
    Description: string,
    CategoryName: string
}

export default function CourseCard({
    Id,
    Name,
    Description,
    CategoryName
}: CourseCardProps) {
    return (
        <Link to={"/courses/" + Id} className="no-underline h-full">
            <div className="card p-3 h-full flex flex-col">
                <img src={"/course_img/" + CategoryName + ".jpg"} alt={CategoryName + " image"} className="rounded-xl aspect-video object-cover"/>
                <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold">{Name}</h3>
                    <p className="mt-3 mb-6 text-muted">{Description}</p>
                    <p className="text-muted mt-auto">{CategoryName}</p>
                </div>
            </div>
        </Link>
    );
}