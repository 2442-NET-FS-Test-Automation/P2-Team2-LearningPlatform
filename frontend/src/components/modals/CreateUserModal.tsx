import { useState } from "react";
import { X } from "lucide-react";

import type { CreateUserDto } from "../../lib/types";
import { isAlphanumeric, isBirthDateValid } from "../../lib/funcs";

import { createUser } from "../../api/usersRequest";

interface Props {
    onClose: () => void;
    onCreated: () => void;
}

export default function CreateUserModal({
    onClose,
    onCreated,
}: Props) {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState<CreateUserDto>({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        bio: "",
        role: "Student",

        birthDate: "",

        shiftId: undefined,
        contractDate: "",
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!isAlphanumeric(form.username)) {
            setError("Username can only contain letters and numbers");
            setIsSubmitting(false);
            return;
        }

        if (form.birthDate && !isBirthDateValid(form.birthDate)) {
            setError("User needs to be 12 years old to register");
            setIsSubmitting(false);
            return;
        }

        if (form.password.length < 8) {
            setError("Password should be at least 8 characters long");
            setIsSubmitting(false);
            return;
        }

        try {
            await createUser(form);

            await onCreated();
            onClose();
        } catch (err: any) {
            console.error(err.response?.data);
            alert(JSON.stringify(err.response?.data));
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="card w-full max-w-3xl shadow-xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">
                            Create New User
                        </h2>

                        <p className="text-sm text-muted">
                            Add a new member to LearnHub
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
                    {/* Basic information */}
                    <div>
                        <h3 className="font-semibold mb-3">
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <input
                                className="form-input"
                                placeholder="Username"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />

                            <input
                                className="form-input"
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />

                            <input
                                className="form-input"
                                placeholder="First name"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                            />

                            <input
                                className="form-input"
                                placeholder="Last name"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                            />

                            <input
                                className="form-input col-span-2"
                                type="email"
                                placeholder="Email address"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <h3 className="font-semibold mb-3">
                            Account Settings
                        </h3>

                        <select
                            className="form-input w-full"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="Student">Student</option>
                            <option value="Professor">Professor</option>
                            <option value="Admin">Administrator</option>
                        </select>
                    </div>

                    {/* Extra information */}
                    <div>
                        <textarea
                            className="form-input w-full"
                            rows={3}
                            placeholder="Biography (optional)"
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Student fields */}
                    {form.role === "Student" && (
                        <div className="rounded-lg border p-4">
                            <h3 className="font-semibold mb-3">
                                Student Information
                            </h3>

                            <input
                                className="form-input w-full"
                                type="date"
                                name="birthDate"
                                value={form.birthDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    {/* Professor fields */}
                    {form.role === "Professor" && (
                        <div className="rounded-lg border p-4">
                            <h3 className="font-semibold mb-3">
                                Professor Information
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    className="form-input"
                                    type="number"
                                    placeholder="Shift ID"
                                    name="shiftId"
                                    value={form.shiftId ?? ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            shiftId: Number(e.target.value)
                                        })
                                    }
                                />

                                <input
                                    className="form-input"
                                    type="date"
                                    name="contractDate"
                                    value={form.contractDate}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    )}

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
                            {isSubmitting ? "Creating account…" : "Create Account"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}