import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../api/api";
import type { AuthUser, AuthContextType, LoginCredentials, RegisterData } from "../lib/typesAuth";
import type { UserRole } from "../lib/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
       
        api.get("/auth/me")
            .then((res) => {
                setUser(parseAuthUser(res.data.user));
            })
            // .catch(() => localStorage.removeItem("token"))
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }, []);

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            const res = await api.post("/auth/login", credentials);
            const loggedUser = parseAuthUser(res.data.user);
            setUser(loggedUser);
            return loggedUser;
        } finally {
            setIsLoading(false);
        }
    }

    const register = async (data: RegisterData) => {
        const res = await api.post("/auth/register", data);
        const registered = parseAuthUser(res.data.user)
        setUser(registered);
        return registered;
    };



    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setUser(null);
        }
    };


    return (
        <AuthContext.Provider value={{ user, setUser, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

function parseAuthUser(res: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
    bio?: string;
}): AuthUser {
    const authUser: AuthUser = {
        id: res.id,
        firstName: res.firstName,
        lastName: res.lastName,
        username: res.username,
        email: res.email,
        role: res.role as UserRole,
        bio: res.bio
    };
    return authUser;
}