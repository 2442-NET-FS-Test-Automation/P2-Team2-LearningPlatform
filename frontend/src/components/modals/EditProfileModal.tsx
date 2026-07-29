import { useState } from "react";
import { UserRoundPen } from "lucide-react";

import type { UpdateProfileDto } from "../../lib/types";
import { isAlphanumeric } from "../../lib/funcs";
import { updateUser } from "../../api/usersRequest";
import type { AuthUser } from "../../lib/typesAuth";
import { useAuth } from "../../ctx/AuthCtx";
import ModalHeader from "./ModalHeader";
import ErrorMessage from "../ErrorMessage";

interface Props {
    userId: number;
    currentUser: AuthUser;
    onClose: () => void;
    onUpdated: (updated: AuthUser) => void;
}

export default function EditProfileModal({
    userId,
    currentUser,
    onClose,
    onUpdated,
}: Props) {
    const { setToken } = useAuth();

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        username: currentUser.username,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        bio: currentUser.bio ?? "",
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if (!isAlphanumeric(form.username)) {
            setError("Username can only contain letters and numbers");
            setIsSubmitting(false);
            return;
        }

        // Build the DTO with only changed fields
        const dto: UpdateProfileDto = {};

        if (form.username !== currentUser.username)
            dto.username = form.username;
        if (form.firstName !== currentUser.firstName)
            dto.firstName = form.firstName;
        if (form.lastName !== currentUser.lastName)
            dto.lastName = form.lastName;
        if (form.email !== currentUser.email)
            dto.email = form.email;
        if (form.bio !== (currentUser.bio ?? ""))
            dto.bio = form.bio;

        // Nothing changed
        if (Object.keys(dto).length === 0) {
            onClose();
            return;
        }

        try {
            const result = await updateUser(userId, dto);
            setToken(result.token);
            onUpdated({
                id: userId,
                username: result.user.username,
                firstName: result.user.firstName,
                lastName: result.user.lastName,
                email: result.user.email,
                role: currentUser.role,
                bio: result.user.bio,
            });
            onClose();
        } catch (err: any) {
            setError(err.response?.data ?? "Failed to update profile.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="modal-container">
            <div className="card modal-card animate-fade-in-up">
                <ModalHeader 
                    Icon={UserRoundPen} 
                    Title={"Edit Profile"} 
                    Description={"Change your personal data"}
                    OnClose={onClose} />    

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal information */}
                    <div>
                        <h3 className="font-semibold mb-3">
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex-col">
                                <label className="form-label">Username</label>
                                <input
                                    className="form-input"
                                    placeholder="Username"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex-col">
                                <label className="form-label">Email</label>
                                <input
                                    className="form-input"
                                    type="email"
                                    placeholder="Email address"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex-col">
                                <label className="form-label">First name</label>
                                <input
                                    className="form-input"
                                    placeholder="First name"
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex-col">
                                <label className="form-label">Last name</label>
                                <input
                                    className="form-input"
                                    placeholder="Last name"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <h3 className="font-semibold mb-3">
                            Biography
                        </h3>

                        <textarea
                            className="form-input w-full"
                            rows={3}
                            placeholder="Tell us about yourself..."
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                        />
                    </div>

                    {error && <ErrorMessage error={error} />}
                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t pt-5">
                        <button
                            type="button"
                            className="btn-outline"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="btn-primary py-3 font-semibold">
                            {isSubmitting ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
