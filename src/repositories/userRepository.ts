// contains raw Prisma calls ( a place to interact with prisma ). 0 business logic
import { db } from "@/../prisma/db";

const findByEmail = async (email: string) => {
	const result =  await db.orm.public.User.first({ email });
    if(!result) return null
    
    return {
        ...result
    }
};


const createUser = async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
}) => {
    return db.orm.public.User.create(data);
};

const updateRefreshTokenHash = async (data: {
    userId: NonNullable<Awaited<ReturnType<typeof findByEmail>>>['id'];
    tokenHash: string;
}) => {
    return db.orm.public.User
        .where({ id: data.userId })
        .update({ refreshTokenHash: data.tokenHash });
};

const clearRefreshTokenHash = async (tokenHash: string) => {
    return db.orm.public.User
        .where({ refreshTokenHash: tokenHash })
        .update({ refreshTokenHash: null });
};

export {
	findByEmail,
	createUser,
    updateRefreshTokenHash,
    clearRefreshTokenHash,
};
