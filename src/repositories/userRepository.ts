// contains raw Prisma calls ( a place to interact with prisma ). 0 business logic
import { db } from "@/../prisma/db";

const findByEmail = async (email: string) => {
	const result =  await db.orm.public.User.first({ email });
    if(!result) return null
    
    return {
        ...result
    }
};

export {
	findByEmail,
};
