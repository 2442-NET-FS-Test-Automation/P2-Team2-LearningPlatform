import { useState, useEffect } from "react";
import { BookOpenCheck, X } from "lucide-react";

import { COURSE_CATEGORIES, DAY_NAMES, type CourseSchedule, type UpdateCourseDto } from "../../lib/types";
import { getCourseDetails, updateCourse } from "../../api/coursesRequests";
import ModalHeader from "./ModalHeader";
import ErrorMessage from "../ErrorMessage";

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
    const [newSchedule, setNewSchedule] = useState<Partial<CourseSchedule>>({ day: 1, startTime: "08:00", endTime: "10:00" });

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
                    schedule: course.schedule ?? [],
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="card w-full max-w-2xl shadow-xl animate-in fade-in zoom-in duration-200 flex justify-center py-10">
                    Loading course details...
                </div>
            </div>
        );
    }

    return (
        <div className="modal-container">
            <div className="card modal-card animate-fade-in-up">
                <ModalHeader 
                    Icon={BookOpenCheck} 
                    Title={"Edit Course"} 
                    Description={"Edit details of an existing course"} 
                    OnClose={onClose} />

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
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                            <h3 className="text-sm font-semibold mb-3">Course Schedule</h3>
                            
                            {form.schedule && form.schedule.length > 0 ? (
                                <ul className="space-y-2 mb-4">
                                    {form.schedule.map((s, idx) => (
                                        <li key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-md border border-slate-200 dark:border-slate-700">
                                            <span className="text-sm font-medium">
                                                {DAY_NAMES[s.day]}s, {s.startTime.substring(0,5)} - {s.endTime.substring(0,5)}
                                            </span>
                                            <button 
                                                type="button" 
                                                onClick={() => setForm({ ...form, schedule: form.schedule?.filter((_, i) => i !== idx) })}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <X size={16} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-500 mb-4">No schedules added yet.</p>
                            )}

                            <div className="flex items-end gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-md border border-slate-200 dark:border-slate-700">
                                <div className="flex-1 space-y-1">
                                    <label className="text-xs font-medium">Day</label>
                                    <select 
                                        className="form-input w-full py-1.5 text-sm"
                                        value={newSchedule.day}
                                        onChange={e => setNewSchedule({ ...newSchedule, day: Number(e.target.value) })}
                                    >
                                        {DAY_NAMES.map((d, i) => (
                                            <option key={i} value={i}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <label className="text-xs font-medium">Start</label>
                                    <input 
                                        type="time" 
                                        className="form-input w-full py-1.5 text-sm"
                                        value={newSchedule.startTime}
                                        onChange={e => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <label className="text-xs font-medium">End</label>
                                    <input 
                                        type="time" 
                                        className="form-input w-full py-1.5 text-sm"
                                        value={newSchedule.endTime}
                                        onChange={e => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                                    />
                                </div>
                                <button 
                                    type="button"
                                    className="btn-outline py-1.5 px-3 text-sm h-[34px] flex-shrink-0"
                                    onClick={() => {
                                        if (newSchedule.startTime && newSchedule.endTime) {
                                            const scheduleItem: CourseSchedule = {
                                                day: newSchedule.day!,
                                                startTime: newSchedule.startTime + (newSchedule.startTime.length === 5 ? ":00" : ""),
                                                endTime: newSchedule.endTime + (newSchedule.endTime.length === 5 ? ":00" : "")
                                            };
                                            setForm({ ...form, schedule: [...(form.schedule || []), scheduleItem] });
                                        }
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {error && <ErrorMessage error={error}/>}

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
