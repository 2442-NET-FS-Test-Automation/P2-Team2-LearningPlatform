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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                <div className="card w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold">
                        Edit User
                    </h2>
                    <button onClick={onClose}>
                        <X/>
                    </button>
                </div>

                <form 
                onSubmit={handleSubmit}
                className="space-y-5 overflow-y-auto pr-2 flex-1"
                >
                    <input
                    className="form-input w-full"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    />

                    <input
                    className="form-input w-full"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    />

                    <input
                    className="form-input w-full"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    />

                    <input
                    className="form-input w-full"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    />

                    <textarea
                    className="form-input w-full"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    />

                    {user.student && (
                        <div>
                            <label className="form-label">
                                Courses
                            </label>

                            <select
                                multiple
                                className="form-input w-full h-32"
                                value={form.studentCourseIds.map(String)}
                                onChange={(e) => {
                                    const values = Array.from(
                                        e.target.selectedOptions,
                                        o => Number(o.value)
                                    );

                                    setForm(prev => ({
                                        ...prev,
                                        studentCourseIds: values
                                    }));
                                }}
                            >
                                {courses.map(course => (
                                    <option
                                        key={course.id}
                                        value={course.id}
                                    >
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {user.professor && (
                        <>
                            <div>
                                <label className="form-label">
                                    Shift
                                </label>

                                <input
                                    type="number"
                                    name="shiftId"
                                    className="form-input w-full"
                                    value={form.shiftId}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="form-label">
                                    Contract Date
                                </label>

                                <input
                                    type="date"
                                    name="contractDate"
                                    className="form-input w-full"
                                    value={form.contractDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    id="isActive"
                                    type="checkbox"
                                    checked={form.isActive}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            isActive: e.target.checked
                                        })
                                    }
                                />

                                <label htmlFor="isActive">
                                    Active Professor
                                </label>
                                <div>
                                    <label className="form-label">
                                        Teaching Courses
                                    </label>

                                    <select
                                        multiple
                                        className="form-input w-full h-40"
                                        value={form.professorCourseIds.map(String)}
                                        onChange={(e) => {
                                            const values = Array.from(
                                                e.target.selectedOptions,
                                                o => Number(o.value)
                                            );

                                            setForm(prev => ({
                                                ...prev,
                                                professorCourseIds: values
                                            }));
                                        }}
                                    >
                                        {courses.map(course => (
                                            <option
                                                key={course.id}
                                                value={course.id}
                                            >
                                                {course.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                    
                    {
                    error &&
                    <p className="text-red-500">
                        {error}
                    </p>
                    }

                    <div className="flex justify-end gap-3">
                        <button
                        type="button"
                        className="btn-outline"
                        onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                        className="btn-primary"
                        disabled={loading}
                        >
                            {
                                loading 
                                ? "Saving..."
                                : "Save"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}