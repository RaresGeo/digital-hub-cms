import { User } from '@auth/user';
import UserModel from '@auth/user/models/UserModel';
import { PartialDeep } from 'type-fest';
import apiFetch from '@/utils/apiFetch';

/**
 * Refreshes the access token
 */
export async function authRefreshToken(): Promise<Response> {
	return apiFetch('/api/auth/refresh-token', { method: 'POST' });
}

/**
 * Gets the profile of the currently logged in user using cookies
 */
export async function authGetProfile(): Promise<Response> {
	return apiFetch('/api/auth/profile');
}

/**
 * Logs out by deleting the cookies
 */
export async function authLogout(): Promise<Response> {
	return apiFetch('/api/auth/logout', { method: 'POST' });
}

/**
 * Get user by id
 */
export async function authGetDbUser(userId: string): Promise<Response> {
	return apiFetch(`/api/mock/auth/user/${userId}`);
}

/**
 * Get user by email
 */
export async function authGetDbUserByEmail(email: string): Promise<Response> {
	return apiFetch(`/api/mock/auth/user-by-email/${email}`);
}

/**
 * Update user
 */
export function authUpdateDbUser(user: PartialDeep<User>) {
	return apiFetch(`/api/mock/auth/user/${user.id}`, {
		method: 'PUT',
		body: JSON.stringify(UserModel(user))
	});
}

/**
 * Create user
 */
export async function authCreateDbUser(user: PartialDeep<User>) {
	return apiFetch('/api/mock/users', {
		method: 'POST',
		body: JSON.stringify(UserModel(user))
	});
}
