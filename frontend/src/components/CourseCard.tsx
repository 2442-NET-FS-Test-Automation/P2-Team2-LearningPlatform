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
        <Link to={"/courses/" + Id} className="no-underline">
            <div className="card p-3">
                <img src={"/course_img/" + CategoryName + ".jpg"} alt={CategoryName + " image"} className="rounded-xl aspect-video"/>
                <div className="p-4">
                    <h3 className="text-xl font-semibold">{Name}</h3>
                    <p className="mt-3 text-muted">{Description}</p>
                    <p className="mt-8 text-muted">{CategoryName}</p>
                </div>
            </div>
        </Link>
    );
}