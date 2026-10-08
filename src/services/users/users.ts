import type { UpdateUserPayload, User } from '@/types/user';
import * as userRepository from '@/repositories/userRepository';
import { ConflictError, NotFoundError } from '@/errors/http-errors';
import * as cloudinaryService from '@/integrations/cloudinary/cloudinaryService';
import { CLOUDINARY_FOLDERS } from '@/integrations/cloudinary/cloudinaryFolders';
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
		profileUrl: user.profileUrl,
		profilePublicId: user.profilePublicId,
		about: user.about,
		role: user.role as User["role"],
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
		throw new NotFoundError("User not found");
	}

	// Check email
	if (data.email && data.email !== user.email) {
		const existingUser = await userRepository.findByEmail(data.email);

		if (existingUser && existingUser.id !== userId) {
			throw new ConflictError("Email is already in use");
		}
	}

	const updates: {
		name?: string;
		email?: string;
		password?: string;
		about?: string | null;
		profileUrl?: string | null;
		profilePublicId?: string | null;
	} = {};

	if (data.name !== undefined) {
		updates.name = data.name;
	}

	if (data.email !== undefined) {
		updates.email = data.email;
	}

	if (data.about !== undefined) {
		updates.about = data.about;
	}

	if (data.password) {
		updates.password = await bcrypt.hash(data.password, 10);
	}

	// New profile image
	if (Buffer.isBuffer(data.profileUrl)) {
		const uploaded = await cloudinaryService.uploadImage(
			data.profileUrl,
			CLOUDINARY_FOLDERS.USER_PROFILE,
		);

		updates.profileUrl = uploaded.url;
		updates.profilePublicId = uploaded.publicId;
	}

	const updatedUser = (await userRepository.updateUser({
		userId: user.id,
		updates,
	}))!;

	// delete old photo
	if (Buffer.isBuffer(data.profileUrl) && user.profilePublicId) {
		await cloudinaryService.deleteImage(user.profilePublicId);
	}

	return {
		id: updatedUser.id,
		name: updatedUser.name,
		email: updatedUser.email,
		profileUrl: updatedUser.profileUrl,
		profilePublicId: updatedUser.profilePublicId,
		about: updatedUser.about,
		role: updatedUser.role as User["role"],
		createdAt: updatedUser.createdAt,
		updatedAt: updatedUser.updatedAt,
		deletedAt: updatedUser.deletedAt,
	};
};

export { getUser, updateUser };