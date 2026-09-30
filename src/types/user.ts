interface RegisterPayload{
    name: string;
    email: string;
    role: string;
    password: string;
}

interface LoginPayload{
    email: string;
    password: string;
    rememberMe?: boolean;
}

interface User{
    id:string;
    name:string;
    email:string;
    role:string;
    createdAt:string;
}

export type {
    RegisterPayload,
    LoginPayload,
    User
}
