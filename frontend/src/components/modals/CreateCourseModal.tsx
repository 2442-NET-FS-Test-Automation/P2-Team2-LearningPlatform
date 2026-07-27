import { useEffect, useState } from "react";
import { X } from "lucide-react";

import {
    COURSE_CATEGORIES,
    type CreateCourseDto,
    type UserDetailsDto,
} from "../../lib/types";
import { createCourse } from "../../api/coursesRequests";
import { getUser, getUsers } from "../../api/usersRequest";

interface Props {
    onClose: () => void;
    onCreated: () => void;
}

type ProfessorOption = {
    professorId: number;
    label: string;
};

export default function CreateCourseModal({ onClose, onCreated }: Props) {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingProfessors, setLoadingProfessors] = useState(true);
    const [professors, setProfessors] = useState<ProfessorOption[]>([]);

    const [form, setForm] = useState<CreateCourseDto>({
        professorId: 0,
        name: "",
        description: "",
        about: "",
        category: "Programming",
        price: 0,
        hours: 0,
        capacity: 0,
        certification: false,
        isActive: true,
    });

    useEffect(() => {
        let cancelled = false;

        async function loadProfessors() {
            try {
                // Backend caps pageSize at 50
                const res = await getUsers(1, 50, null, "Professor", true);
                const users = res.items ?? [];

                const details: UserDetailsDto[] = await Promise.all(
                    users.map((u: { id: number }) => getUser(u.id))
                );

                const options = details
                    .filter((u) => u.professor?.id != null)
                    .map((u) => ({
                        professorId: u.professor!.id,
                        label: `${u.firstName} ${u.lastName} (${u.username})`,
                    }));

                if (!cancelled) {
                    setProfessors(options);
                }
            } catch {
                if (!cancelled) {
                    setError("Failed to load professors");
                }
            } finally {
                if (!cancelled) {
                    setLoadingProfessors(false);
                }
            }
        }

        loadProfessors();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target;

        let parsedValue: string | number | boolean = value;
        if (type === "number") {
            parsedValue = Number(value);
        } else if (type === "checkbox") {
            parsedValue = (e.target as HTMLInputElement).checked;
        } else if (name === "professorId") {
            parsedValue = Number(value);
        }

        setForm((prev) => ({ ...prev, [name]: parsedValue }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!form.professorId || form.professorId <= 0) {
            setError("Please select a professor");
            return;
        }

        if (form.price <= 0) {
            setError("Price must be greater than 0");
            return;
        }

        if (form.capacity <= 0) {
            setError("Capacity must be greater than 0");
            return;
        }

        if (form.hours <= 0) {
            setError("Hours must be greater than 0");
            return;
        }

        setIsSubmitting(true);

        try {
            await createCourse(form);
            onCreated();
            onClose();
        } catch (err: any) {
            console.error(err.response?.data);
            setError(
                err.response?.data?.error ||
                    err.response?.data?.title ||
                    "Failed to create course"
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="card w-full max-w-3xl max-h-screen shadow-xl overflow-auto animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Add Course</h2>
                        <p className="text-sm text-muted">
                            Add a new course to LearnHub
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-white text-xl"
                    >
                        <X />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="form-input w-full"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Professor</label>
                        <select
                            name="professorId"
                            value={form.professorId || ""}
                            onChange={handleChange}
                            className="form-input w-full"
                            required
                            disabled={loadingProfessors}
                        >
                            <option value="" disabled>
                                {loadingProfessors
                                    ? "Loading professors..."
                                    : "Select a professor"}
                            </option>
                            {professors.map((p) => (
                                <option key={p.professorId} value={p.professorId}>
                                    {p.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="form-input w-full"
                            rows={3}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">About</label>
                        <textarea
                            name="about"
                            value={form.about}
                            onChange={handleChange}
                            className="form-input w-full"
                            rows={5}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="form-input w-full"
                            >
                                {COURSE_CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                className="form-input w-full"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Hours</label>
                            <input
                                type="number"
                                name="hours"
                                value={form.hours}
                                onChange={handleChange}
                                className="form-input w-full"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Capacity</label>
                            <input
                                type="number"
                                name="capacity"
                                value={form.capacity}
                                onChange={handleChange}
                                className="form-input w-full"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="certification"
                                checked={form.certification}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                            />
                            <span className="text-sm font-medium">
                                Has Certification
                            </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={form.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                            />
                            <span className="text-sm font-medium">Is Active</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-outline px-4 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || loadingProfessors}
                            className="btn-primary py-3 font-semibold disabled:opacity-50"
                        >
                            {isSubmitting ? "Creating course…" : "Create Course"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
