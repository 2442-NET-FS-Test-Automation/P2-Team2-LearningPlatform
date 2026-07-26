import { useState, useEffect } from "react";
import { X } from "lucide-react";

import { COURSE_CATEGORIES, type CourseCategory, type UpdateCourseDto } from "../../lib/types";
import { getCourseDetails, updateCourse } from "../../api/coursesRequests";

interface Props {
    courseId: number;
    onClose: () => void;
    onUpdated: () => void;
}

export default function EditCourseModal({ courseId, onClose, onUpdated }: Props) {
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<UpdateCourseDto>({});

    useEffect(() => {
        getCourseDetails(courseId)
            .then(course => {
                setForm({
                    name: course.name,
                    description: course.description,
                    about: course.about,
                    category: course.category,
                    price: course.price,
                    hours: course.hours ?? 0,
                    capacity: course.capacity,
                    certification: course.certification,
                    isActive: course.isActive,
                });
            })
            .catch(() => setError("Failed to load course details"))
            .finally(() => setLoadingDetails(false));
    }, [courseId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        let parsedValue: any = value;
        if (type === "number") {
            parsedValue = Number(value);
        } else if (type === "checkbox") {
            parsedValue = (e.target as HTMLInputElement).checked;
        }

        setForm({ ...form, [name]: parsedValue });
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const submitData = { ...form };
        if (form.category) {
            const categoryIndex = COURSE_CATEGORIES.indexOf(form.category as any);
            submitData.category = categoryIndex >= 0 ? categoryIndex : undefined as any;
        }

        try {
            await updateCourse(courseId, submitData);
            onUpdated();
        } catch {
            setError("Failed to update course.");
        } finally {
            setLoading(false);
        }
    }

    if (loadingDetails) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="card w-full max-w-2xl bg-white dark:bg-slate-900 flex justify-center py-10">
                    Loading course details...
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="card w-full max-w-2xl bg-white dark:bg-slate-900 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Edit Course</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <form id="editCourseForm" onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <input type="text" name="name" value={form.name || ""} onChange={handleChange} className="form-input w-full" required />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea name="description" value={form.description || ""} onChange={handleChange} className="form-input w-full" rows={3} required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">About</label>
                            <textarea name="about" value={form.about || ""} onChange={handleChange} className="form-input w-full" rows={5} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <select name="category" value={form.category || "Other"} onChange={handleChange} className="form-input w-full">
                                    {COURSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price</label>
                                <input type="number" step="0.01" name="price" value={form.price || 0} onChange={handleChange} className="form-input w-full" required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hours</label>
                                <input type="number" name="hours" value={form.hours || 0} onChange={handleChange} className="form-input w-full" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Capacity</label>
                                <input type="number" name="capacity" value={form.capacity || 0} onChange={handleChange} className="form-input w-full" required />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="certification" checked={form.certification || false} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                                <span className="text-sm font-medium">Has Certification</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="isActive" checked={form.isActive || false} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                                <span className="text-sm font-medium">Is Active</span>
                            </label>
                        </div>
                    </form>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button type="button" onClick={onClose} className="btn-outline px-4 py-2">Cancel</button>
                    <button type="submit" form="editCourseForm" disabled={loading} className="btn-primary px-6 py-2 disabled:opacity-50">
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
