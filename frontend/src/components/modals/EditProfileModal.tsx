import { useState } from "react";
import { X } from "lucide-react";

import type { UpdateProfileDto } from "../../lib/types";
import { isAlphanumeric } from "../../lib/funcs";
import { updateUser } from "../../api/usersRequest";
import type { AuthUser } from "../../lib/typesAuth";
import { useAuth } from "../../ctx/AuthCtx";

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="card w-full max-w-3xl shadow-xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">
                            Edit Profile
                        </h2>

                        <p className="text-sm text-muted">
                            Update your personal information
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white text-xl"
                    >
                        <X />
                    </button>
                </div>

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

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t pt-5">
                        {error && <p className="flex items-center align-center text-sm text-red-600 dark:text-red-400">{error}</p>}
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
