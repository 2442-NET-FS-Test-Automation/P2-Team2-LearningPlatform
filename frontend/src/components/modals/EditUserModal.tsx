import { useState, useEffect } from "react";
import { X } from "lucide-react";

import type { UserDetailsDto ,UpdateProfileDto, CourseSelectDto } from "../../lib/types";
import { updateUser } from "../../api/usersRequest";
import { getCoursesForSelect } from "../../api/coursesRequests";

interface Props {
    user: UserDetailsDto;
    onClose: () => void;
    onUpdated: () => void;
}

export default function EditUserModal({
    user,
    onClose,
    onUpdated
}: Props) {

    const [form, setForm] = useState({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio ?? "",

        // Student
        birthDate: user.student?.birthDate ?? "",
        studentCourseIds: user.student?.courses.map(c => c.id) ?? [],

        // Professor
        shiftId: user.professor?.shiftId ?? 0,
        contractDate: user.professor?.contractDate ?? "",
        isActive: user.professor?.isActive ?? true,
        professorCourseIds: user.professor?.courses.map(c => c.id) ?? []
    });

    const [courses, setCourses] = useState<CourseSelectDto[]>([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState<string|null>(null);

    useEffect(() => {
        async function loadCourses() {
            try {
                const result = await getCoursesForSelect();
                setCourses(result);
            } catch {
                setError("Couldn't load courses.");
            }
        }

        loadCourses();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]:
                name === "shiftId"
                    ? Number(value)
                    : value
        });
    };


    async function handleSubmit(e:React.FormEvent){

        e.preventDefault();

        setLoading(true);
        setError(null);

        const dto:UpdateProfileDto = {};

        if(form.username !== user.username)
            dto.username = form.username;

        if(form.firstName !== user.firstName)
            dto.firstName = form.firstName;

        if(form.lastName !== user.lastName)
            dto.lastName = form.lastName;

        if(form.email !== user.email)
            dto.email = form.email;

        if(form.bio !== (user.bio ?? ""))
            dto.bio = form.bio;
        
        if(user.student)
        {
            if(form.birthDate !== user.student.birthDate)
                dto.birthDate = form.birthDate;

            dto.studentCourseIds = form.studentCourseIds;
        }


        if(user.professor)
        {
            if(form.shiftId !== user.professor.shiftId)
                dto.shiftId = Number(form.shiftId);

            if(form.contractDate !== user.professor.contractDate)
                dto.contractDate = form.contractDate;

            if(form.isActive !== user.professor.isActive)
                dto.isActive = form.isActive;

            dto.professorCourseIds = form.professorCourseIds;
        }

        if(Object.keys(dto).length === 0)
        {
            onClose();
            return;
        }

        try{
            await updateUser(user.id,dto);

            onUpdated();
            onClose();
        }catch(err:any){
            setError(
                err.response?.data?.error ??
                "Failed to update user"
            );
        }finally{
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="card w-full max-w-3xl shadow-xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Edit User</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <form id="editUserForm" onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Username</label>
                                <input className="form-input w-full" name="username" value={form.username} onChange={handleChange} required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <input type="email" className="form-input w-full" name="email" value={form.email} onChange={handleChange} required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">First Name</label>
                                <input className="form-input w-full" name="firstName" value={form.firstName} onChange={handleChange} required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last Name</label>
                                <input className="form-input w-full" name="lastName" value={form.lastName} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bio</label>
                            <textarea className="form-input w-full" name="bio" value={form.bio} onChange={handleChange} rows={3} />
                        </div>

                        {user.student && (
                            <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <label className="text-sm font-medium text-blue-600 dark:text-blue-400">Student Details</label>
                                <div className="space-y-2 mt-2">
                                    <label className="text-xs font-medium uppercase text-slate-500">Enrolled Courses</label>
                                    <select
                                        multiple
                                        className="form-input w-full h-32"
                                        value={form.studentCourseIds.map(String)}
                                        onChange={(e) => {
                                            const values = Array.from(e.target.selectedOptions, o => Number(o.value));
                                            setForm(prev => ({ ...prev, studentCourseIds: values }));
                                        }}
                                    >
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>{course.name}</option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-slate-500">Hold Ctrl (Windows) or Cmd (Mac) to select multiple courses.</p>
                                </div>
                            </div>
                        )}

                        {user.professor && (
                            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <label className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Professor Details</label>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium uppercase text-slate-500">Shift ID</label>
                                        <input type="number" name="shiftId" className="form-input w-full" value={form.shiftId} onChange={handleChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium uppercase text-slate-500">Contract Date</label>
                                        <input type="date" name="contractDate" className="form-input w-full" value={form.contractDate} onChange={handleChange} />
                                    </div>
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer mt-2">
                                    <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                                    <span className="text-sm font-medium">Active Professor</span>
                                </label>

                                <div className="space-y-2 mt-4">
                                    <label className="text-xs font-medium uppercase text-slate-500">Teaching Courses</label>
                                    <select
                                        multiple
                                        className="form-input w-full h-32"
                                        value={form.professorCourseIds.map(String)}
                                        onChange={(e) => {
                                            const values = Array.from(e.target.selectedOptions, o => Number(o.value));
                                            setForm(prev => ({ ...prev, professorCourseIds: values }));
                                        }}
                                    >
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>{course.name}</option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-slate-500">Hold Ctrl (Windows) or Cmd (Mac) to select multiple courses.</p>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
                
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button type="button" className="btn-outline" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" form="editUserForm" className="btn-primary" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    )
}