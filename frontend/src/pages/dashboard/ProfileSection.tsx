import { useState } from "react";
import { UserRound, UserRoundPen, UserRoundCog } from "lucide-react";

import EditProfileModal from "../../components/modals/EditProfileModal";

import { useAuth } from "../../ctx/AuthCtx";
import type { AuthUser } from "../../lib/typesAuth";


export default function ProfileSection() {
    const { user, setUser } = useAuth();
    
    const [showEditModal, setShowEditModal] = useState(false);

    if (user == null) return;
    
    return (
        <>
        <div className="card space-y-6">
            <div className="flex items-center gap-6">
                {user.role === "Admin" &&
                    <UserRoundCog size={75} />
                }
                {user.role === "Professor" &&
                    <UserRoundPen size={75} />
                }
                {user.role === "Student" &&
                    <UserRound size={75} />
                }
                <div>
                    <h2 className="text-2xl font-bold">{user.firstName + " " + user.lastName}</h2>
                    <p className="mb-2">{user.username}</p>
                    <p className="text-muted">{user.role}</p>
                    <p className="text-muted text-sm dark:text-slate-400">{user.email}</p>
                </div>
                <button className="btn-outline ml-auto text-sm" onClick={() => setShowEditModal(true)}>Edit Profile</button>
            </div>
            <div>
                <h3 className="font-semibold">Bio</h3>
                <p className="text-muted">{user.bio || "No bio provided."}</p>
            </div>
        </div>
        {showEditModal && (
            <EditProfileModal
                userId={user.id}
                currentUser={user}
                onClose={() => setShowEditModal(false)}
                onUpdated={(updated: AuthUser) => {
                    setUser({ ...user, ...updated });
                    setShowEditModal(false);
                }}
            />
        )}
        </>
    );
}