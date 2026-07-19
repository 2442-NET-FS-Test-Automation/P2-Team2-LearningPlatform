import type { UserPartialInfo } from "../../lib/types";
import { UserRound, UserRoundPen, UserRoundCog } from "lucide-react";

export default function ProfileSection({
    Name,
    Email,
    Username,
    Role,
    Bio,
}: UserPartialInfo) {
    return (
        <div className="card space-y-6">
            <div className="flex items-center gap-6">
                {Role === "Admin" &&
                    <UserRoundCog size={75} />
                }
                {Role === "Professor" &&
                    <UserRoundPen size={75} />
                }
                {Role === "Student" &&
                    <UserRound size={75} />
                }
                <div>
                    <h2 className="text-2xl font-bold dark:text-white">{Name}</h2>
                    <p className="mb-2">{Username}</p>
                    <p className="text-muted">{Role}</p>
                    <p className="text-muted text-sm dark:text-slate-400">{Email}</p>
                </div>
                <button className="btn-outline ml-auto text-sm">Edit Profile</button>
            </div>
            <div>
                <h3 className="font-semibold dark:text-white">Bio</h3>
                <p className="text-muted">{Bio || "No bio provided."}</p>
            </div>
        </div>
    );
}