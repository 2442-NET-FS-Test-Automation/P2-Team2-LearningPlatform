import { useState } from "react";
import { UserRound, UserRoundPen, UserRoundCog, Pencil, Minus } from "lucide-react";

import EditProfileModal from "../../components/modals/EditProfileModal";

import { useAuth } from "../../ctx/AuthCtx";
import type { AuthUser } from "../../lib/typesAuth";


export default function ProfileSection() {
    const { user, setUser } = useAuth();
    
    const [showEditModal, setShowEditModal] = useState(false);

    if (user == null) return;

    const RoleIcon = user.role === "Admin" ? UserRoundCog : user.role === "Professor" ? UserRoundPen : UserRound;
    
    return (
        <>
        <div className="card space-y-6">
            <div className="flex items-center gap-6">
                <RoleIcon size={80} />
                <div>
                    <h2 className="text-2xl font-bold">{user.firstName + " " + user.lastName}</h2>
                    <p className="mb-2 text-muted">{user.username}</p>
                    <div className="flex mt-5 items-center">
                        <p className="blue-accent-chip inline-block rounded-full px-3 py-1 text-xs font-semibold">{user.role}</p>
                        <p className="text-muted dark:text-slate-400 mx-2"><Minus size={15}/></p>
                        <p className="text-muted text-sm dark:text-slate-400">{user.email}</p>
                    </div>
                    
                </div>
                <button className="btn-outline ml-auto text-sm" onClick={() => setShowEditModal(true)}>
                    <div className="flex items-center gap-2 p-1">
                        <Pencil size={14} />
                        Edit Profile
                    </div>
                </button>
            </div>
            <div className="divider-block">
                <h3 className="font-semibold">Bio</h3>
                <p className="text-muted mt-1">{user.bio || "No bio provided."}</p>
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