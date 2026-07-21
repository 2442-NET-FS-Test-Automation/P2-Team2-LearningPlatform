import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../lib/api";
import type { AuthUser, AuthContextType, LoginCredentials, RegisterData } from "../lib/typesAuth";

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
                switch (res.data.user.result.role){
                    case 0: res.data.user.result.role = "Admin"; break;
                    case 1: res.data.user.result.role = "Professor"; break;
                    case 2: res.data.user.result.role = "Student"; break;
                }
                setUser(res.data.user.result); 
            })
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setIsLoading(false));
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const res = await api.post("/auth/login", credentials);
        localStorage.setItem("token", res.data.token);
        switch (res.data.user.role){
            case 0: res.data.user.role = "Admin"; break;
            case 1: res.data.user.role = "Professor"; break;
            case 2: res.data.user.role = "Student"; break;
        }
        setUser(res.data.user);
        return res.data.user;
    };

    const register = async (data: RegisterData) => {
        const res = await api.post("/auth/register", data);
        localStorage.setItem("token", res.data.token);
        switch (res.data.user.role){
            case 0: res.data.user.role = "Admin"; break;
            case 1: res.data.user.role = "Professor"; break;
            case 2: res.data.user.role = "Student"; break;
        }
        setUser(res.data.user);
        return res.data.user;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};