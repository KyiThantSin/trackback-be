// contains raw Prisma calls ( a place to interact with prisma ). 0 business logic
import { db } from "@/../prisma/db";

const findByEmail = async (email: string) => {
	const result =  await db.orm.public.User.first({ email });
    if(!result) return null
    
    return {
        ...result
    }
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
}) => {
    return db.orm.public.User.create(data);
};

export {
	findByEmail,
    findById,
	createUser,
};
