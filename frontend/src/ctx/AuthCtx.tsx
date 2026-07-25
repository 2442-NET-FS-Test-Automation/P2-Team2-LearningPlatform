import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../api/api";
import type { AuthUser, AuthContextType, LoginCredentials, RegisterData } from "../lib/typesAuth";
import type { UserRole } from "../lib/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsLoading(false);
            return;
        }
        api.get("/auth/me")
            .then((res) => {
                setUser(parseAuthUser(res.data.user.result));
            })
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setIsLoading(false));
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const res = await api.post("/auth/login", credentials);
        localStorage.setItem("token", res.data.token);
        const logged = parseAuthUser(res.data.user)
        setUser(logged);
        return logged;
    };

    const register = async (data: RegisterData) => {
        const res = await api.post("/auth/register", data);
        localStorage.setItem("token", res.data.token);
        const registered = parseAuthUser(res.data.user)
        setUser(registered);
        return registered;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const setToken = (token: string) => {
        localStorage.setItem("token", token);
    }

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading, login, register, logout, setToken }}>
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
    console.log("res", res)
    const authUser: AuthUser = {
        id: res.id,
        firstName: res.firstName,
        lastName: res.lastName,
        username: res.username,
        email: res.email,
        role: res.role as UserRole,
        bio: res.bio
    };
    console.log("parsed", authUser)
    return authUser;
}