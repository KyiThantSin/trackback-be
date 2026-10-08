// contains raw Prisma calls ( a place to interact with prisma ). 0 business logic
import { db } from "@/../prisma/db";

const findByEmail = async (email: string) => {
	const result =  await db.orm.public.User.first({ email });
    if(!result) return null;
    
    return {
        ...result
    };
};

const findById = async (id: string) => {
    const userId = id as NonNullable<Awaited<ReturnType<typeof findByEmail>>>['id'];
    const result = await db.orm.public.User.first({ id: userId });
    if (!result) return null;

    return {
        ...result,
    };
};

const createUser = async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    about?: string | null;
}) => {
    return db.orm.public.User.create(data);
};

const updateUser = async (data: {
    userId: NonNullable<Awaited<ReturnType<typeof findByEmail>>>['id'];
    updates: {
        name?: string;
        email?: string;
        password?: string;
        about?: string | null;
        profileUrl?: string | null;
        profilePublicId?: string | null;
    };
}) => {
    return db.orm.public.User
        .where({ id: data.userId })
        .update(data.updates);
};

export {
	findByEmail,
    findById,
	createUser,
    updateUser,
};
