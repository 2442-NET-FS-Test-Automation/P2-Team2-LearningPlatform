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
            <div className="card group p-3 h-full flex flex-col overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
                <div className="overflow-hidden rounded-xl">
                    <img src={"/course_img/" + CategoryName + ".jpg"} alt={CategoryName + " image"} 
                        className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-102"/>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {Name}
                    </h3>
                    <p className="mt-3 mb-6 text-muted line-clamp-3">{Description}</p>
                    <div className="mt-auto">
                        <span className="blue-accent-chip rounded-full px-3 py-1 text-xs font-semibold">
                            {CategoryName}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}