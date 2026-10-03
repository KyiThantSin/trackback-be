type RoleType = 'USER' | 'ADMIN'
interface RegisterPayload{
    name: string;
    email: string;
    role: RoleType;
    password: string;
}

interface LoginPayload{
    email: string;
    password: string;
    rememberMe?: boolean;
}

interface UpdateUserPayload{
    name?: string;
    email?: string;
    password?: string;
}

interface User{
    id:string;
    name:string;
    email:string;
    role: RoleType;
    createdAt:string;
    updatedAt:string;
    deletedAt:string | null;
}

export type {
    RegisterPayload,
    LoginPayload,
    UpdateUserPayload,
    User,
    RoleType
}
