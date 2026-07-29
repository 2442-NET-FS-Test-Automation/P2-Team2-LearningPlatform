import { useState, useEffect } from "react";
import { UserRoundPen, X } from "lucide-react";

import type { UserDetailsDto ,UpdateProfileDto, CourseSelectDto } from "../../lib/types";
import { updateUser } from "../../api/usersRequest";
import { getEnabledCourses } from "../../api/coursesRequests";
import ModalHeader from "./ModalHeader";
import ErrorMessage from "../ErrorMessage";

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
        professorCourseIds: user.professor?.courses.map(c => c.id) ?? []
    });

    const [courses, setCourses] = useState<CourseSelectDto[]>([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState<string|null>(null);

    useEffect(() => {
        async function loadCourses() {
            try {
                const result = await getEnabledCourses();

                console.log("COURSES RESPONSE:", result);

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
        <div className="modal-container">
            <div className="card modal-card animate-fade-in-up">
                <ModalHeader 
                    Icon={UserRoundPen} 
                    Title={"Edit User"} 
                    Description={"Edit an existing course"} 
                    OnClose={onClose} />
                
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
                                    <label className="text-xs font-medium uppercase text-slate-500">
                                        Enrolled Courses
                                    </label>

                                    <div className="form-input min-h-12 flex flex-wrap gap-2 p-2">

                                        {form.studentCourseIds.map(id => {
                                            const course = courses.find(c => c.id === id);

                                            return (
                                                <span
                                                    key={id}
                                                    className="
                                                        flex items-center gap-1
                                                        rounded-full
                                                        bg-blue-100
                                                        px-3 py-1
                                                        text-sm
                                                        text-blue-700
                                                        dark:bg-blue-900/30
                                                        dark:text-blue-300
                                                    "
                                                >
                                                    {course?.name}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setForm(prev => ({
                                                                ...prev,
                                                                studentCourseIds:
                                                                    prev.studentCourseIds.filter(
                                                                        courseId => courseId !== id
                                                                    )
                                                            }))
                                                        }
                                                        className="hover:text-red-500"
                                                    >
                                                        <X size={14}/>
                                                    </button>
                                                </span>
                                            );
                                        })}


                                        <select
                                            className="
                                                flex-1
                                                min-w-32
                                                bg-transparent
                                                outline-none
                                            "
                                            value=""
                                            onChange={(e) => {
                                                const id = Number(e.target.value);

                                                if (!form.studentCourseIds.includes(id)) {
                                                    setForm(prev => ({
                                                        ...prev,
                                                        studentCourseIds: [
                                                            ...prev.studentCourseIds,
                                                            id
                                                        ]
                                                    }));
                                                }
                                            }}
                                        >
                                            <option value="">
                                                Add course...
                                            </option>

                                            {courses
                                                .filter(course =>
                                                    !form.studentCourseIds.includes(course.id)
                                                )
                                                .map(course => (
                                                    <option
                                                        key={course.id}
                                                        value={course.id}
                                                    >
                                                        {course.name}
                                                    </option>
                                                ))
                                            }

                                        </select>

                                    </div>

                                    <p className="text-xs text-slate-500">
                                        Select courses where this student is enrolled.
                                    </p>
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


                                <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase text-slate-500">
                                        Teaching Courses
                                    </label>

                                    <div className="form-input min-h-12 flex flex-wrap gap-2 p-2">

                                        {form.professorCourseIds.map(id => {
                                            const course = courses.find(c => c.id === id);

                                            return (
                                                <span
                                                    key={id}
                                                    className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                                                >
                                                    {course?.name}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setForm(prev => ({
                                                                ...prev,
                                                                professorCourseIds:
                                                                    prev.professorCourseIds.filter(
                                                                        x => x !== id
                                                                    )
                                                            }))
                                                        }
                                                    >
                                                        <X size={14}/>
                                                    </button>
                                                </span>
                                            );
                                        })}

                                        <select
                                            className="flex-1 bg-transparent outline-none"
                                            value=""
                                            onChange={(e) => {
                                                const id = Number(e.target.value);

                                                if(!form.professorCourseIds.includes(id)){
                                                    setForm(prev => ({
                                                        ...prev,
                                                        professorCourseIds: [
                                                            ...prev.professorCourseIds,
                                                            id
                                                        ]
                                                    }));
                                                }
                                            }}
                                        >
                                            <option value="">
                                                Add course...
                                            </option>

                                            {courses
                                                .filter(c =>
                                                    !form.professorCourseIds.includes(c.id)
                                                )
                                                .map(course => (
                                                    <option 
                                                        key={course.id}
                                                        value={course.id}
                                                    >
                                                        {course.name}
                                                    </option>
                                                ))
                                            }

                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {error && <ErrorMessage error={error} />}
                
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