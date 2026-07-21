import type { UserInfo } from "../../../lib/types";
import { UserRound, UserRoundPen, UserRoundCog } from "lucide-react";

export default function ProfileSection({
    firstName,
    lastName,
    email,
    username,
    role,
    bio
}: UserInfo) {
    return (
        <div className="card space-y-6">
            <div className="flex items-center gap-6">
                {role === "Admin" &&
                    <UserRoundCog size={75} />
                }
                {role === "Professor" &&
                    <UserRoundPen size={75} />
                }
                {role === "Student" &&
                    <UserRound size={75} />
                }
                <div>
                    <h2 className="text-2xl font-bold">{firstName + " " + lastName}</h2>
                    <p className="mb-2">{username}</p>
                    <p className="text-muted">{role}</p>
                    <p className="text-muted text-sm dark:text-slate-400">{email}</p>
                </div>
                <button className="btn-outline ml-auto text-sm">Edit Profile</button>
            </div>
            <div>
                <h3 className="font-semibold">Bio</h3>
                <p className="text-muted">{bio || "No bio provided."}</p>
            </div>
        </div>
    );
}