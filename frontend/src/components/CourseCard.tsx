import { Link } from "react-router-dom";

export type CourseCardProps = {
    Id: number,
    Name: string,
    Description: string,
    CategoryName: string,
    IsFull: number,
    IsEnrolled: boolean
}

export default function CourseCard({
    Id,
    Name,
    Description,
    CategoryName,
    IsFull,
    IsEnrolled
}: CourseCardProps) {
    const occupancy =
        IsEnrolled === true
        ? {
            text: "Enrolled",
            className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
        }
        : IsFull >= 100
        ? {
            text: "Full",
            className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
        }
        : IsFull >= 80
        ? {
            text: "Almost full",
            className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
        }
        : IsFull >= 50
        ? {
            text: "Filling up",
            className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
        }
        : {
            text: "Open seats",
            className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
        };
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
                    <div className="mt-auto flex items-center justify-between">
                        <span className="blue-accent-chip rounded-full px-3 py-1 text-xs font-semibold">
                            {CategoryName}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-semifold ${occupancy.className}`}>
                            {occupancy.text}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}