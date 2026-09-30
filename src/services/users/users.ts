import type { UpdateUserPayload, User } from '@/types/user';
import * as userRepository from '@/repositories/userRepository';
import { ConflictError, NotFoundError } from '@/utils/errors';
import bcrypt from 'bcrypt';

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
		updatedAt: user.updatedAt,
		deletedAt: user.deletedAt,
	};
};


const updateUser = async (
	userId: string,
	data: UpdateUserPayload,
): Promise<User> => {
	const user = await userRepository.findById(userId);

	if (!user) {
		throw new NotFoundError('User not found');
	}

	if (data.email && data.email !== user.email) { // check existing email
		const userWithEmail = await userRepository.findByEmail(data.email);

		if (userWithEmail && userWithEmail.id !== user.id) {
			throw new ConflictError('Email is already in use');
		}
	}

	const updates = {
		...data,
		password: data.password
			? await bcrypt.hash(data.password, 10)
			: undefined,
	};

	const updatedUser = await userRepository.updateUser({
		userId: user.id,
		updates,
	});

	if (!updatedUser) {
		throw new NotFoundError('User not found');
	}

	return {
		id: updatedUser.id,
		name: updatedUser.name,
		email: updatedUser.email,
		role: updatedUser.role,
		createdAt: updatedUser.createdAt,
		updatedAt: updatedUser.updatedAt,
		deletedAt: updatedUser.deletedAt,
	};
};

export {getUser, updateUser}