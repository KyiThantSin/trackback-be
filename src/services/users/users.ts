import type { User } from '@/types/user';
import * as userRepository from '@/repositories/userRepository';
import { NotFoundError } from '@/utils/errors';

const getUser = async (userId: string): Promise<User> => {
	const user = await userRepository.findById(userId);

	if (!user) {
		throw new NotFoundError('User not found');
	}

	return {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
		createdAt: user.createdAt,
	};
};

export {getUser}