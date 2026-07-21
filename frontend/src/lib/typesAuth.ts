import type { UserInfo } from "./types";

export type LoginCredentials = {
    EmailOrUsername: string;
    Password: string;
}

export type RegisterData = {
    FirstName: string;
    LastName: string;
    Username: string;
    Email: string;
    Password: string;
    BirthDate: string;
}

export type AuthUser = UserInfo & {
    Id: number;
}

export type AuthContextType = {
    user: AuthUser | null;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<AuthUser>;
    register: (data: RegisterData) => Promise<AuthUser>;
    logout: () => void;
}