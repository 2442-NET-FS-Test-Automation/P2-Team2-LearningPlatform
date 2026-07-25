import { useState } from "react";
import { X } from "lucide-react";

import type { UserDto, UpdateProfileDto } from "../../lib/types";
import { updateUser } from "../../api/usersRequest";

interface Props {
    user: UserDto;
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
        bio: user.bio ?? ""
    });

    const [loading,setLoading] = useState(false);
    const [error,setError] = useState<string|null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    )=>{
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

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
            <div className="card w-full max-w-3xl">
                <div className="flex justify-between border-b pb-4 mb-5">
                    <h2 className="text-2xl font-bold">
                        Edit User
                    </h2>
                    <button onClick={onClose}>
                        <X/>
                    </button>
                </div>

                <form 
                onSubmit={handleSubmit}
                className="space-y-5"
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