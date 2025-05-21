import { authGetProfile, authLogout, authRefreshToken, authUpdateDbUser } from '@auth/authApi';
import JwtAuthContext, { JwtAuthContextType } from '@auth/services/jwt/JwtAuthContext';
import { FuseAuthProviderComponentProps, FuseAuthProviderState } from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import { useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { User } from '../../user';

export type JwtSignInPayload = {
	email: string;
	password: string;
};

export type JwtSignUpPayload = {
	displayName: string;
	email: string;
	password: string;
};

interface BackendUser {
	email: string;
	name: string;
	picture: string;
	isAdmin: boolean;
	googleId: string;
}

function mapBackendUserToUser(backendUser: BackendUser): User {
	return {
		id: backendUser.googleId,
		role: backendUser.isAdmin ? 'admin' : null,
		displayName: backendUser.name,
		photoURL: backendUser.picture,
		email: backendUser.email
	};
}

function JwtAuthProvider(props: FuseAuthProviderComponentProps) {
	const { ref, children, onAuthStateChanged } = props;

	/**
	 * Fuse Auth Provider State
	 */
	const [authState, setAuthState] = useState<FuseAuthProviderState<User>>({
		authStatus: 'configuring',
		isAuthenticated: false,
		user: null
	});

	/**
	 * Watch for changes in the auth state
	 * and pass them to the FuseAuthProvider
	 */
	useEffect(() => {
		if (onAuthStateChanged) {
			onAuthStateChanged(authState);
		}
	}, [authState, onAuthStateChanged]);

	/**
	 * Attempt to auto login with the stored token
	 */
	useEffect(() => {
		const attemptAutoLogin = async () => {
			try {
				const response = await authGetProfile();

				if (!response.ok || response.status === 401) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const userData = (await response.json()) as BackendUser;
				return mapBackendUserToUser(userData);
			} catch {
				return false;
			}
		};

		if (!authState.isAuthenticated) {
			attemptAutoLogin().then((userData) => {
				if (userData) {
					setAuthState({
						authStatus: 'authenticated',
						isAuthenticated: true,
						user: userData
					});
				} else if (userData === false) {
					setAuthState({
						authStatus: 'unauthenticated',
						isAuthenticated: false,
						user: null
					});
				}
			});
		}
	}, [authState.isAuthenticated]);

	/**
	 * Sign out
	 */
	const signOut: JwtAuthContextType['signOut'] = useCallback(async () => {
		await authLogout();
		setAuthState({
			authStatus: 'unauthenticated',
			isAuthenticated: false,
			user: null
		});
	}, []);

	/**
	 * Update user
	 */
	const updateUser: JwtAuthContextType['updateUser'] = useCallback(async (_user) => {
		try {
			return await authUpdateDbUser(_user);
		} catch (error) {
			console.error('Error updating user:', error);
			return Promise.reject(error);
		}
	}, []);

	/**
	 * Refresh access token
	 */
	const refreshToken: JwtAuthContextType['refreshToken'] = useCallback(async () => {
		const response = await authRefreshToken();

		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

		return response;
	}, []);

	useEffect(() => {
		// Periodically call the refresh endpoint
		if (authState.isAuthenticated) {
			const interval = setInterval(() => {
				refreshToken().catch(() => {
					signOut();
				});
			}, 1000 * 60); // 1 minute

			return () => clearInterval(interval);
		}
	}, [authState.isAuthenticated, refreshToken, signOut]);

	/**
	 * Auth Context Value
	 */
	const authContextValue = useMemo(
		() =>
			({
				...authState,
				signOut,
				updateUser,
				refreshToken
			}) as JwtAuthContextType,
		[authState, signOut, updateUser, refreshToken]
	);

	/**
	 * Expose methods to the FuseAuthProvider
	 */
	useImperativeHandle(ref, () => ({
		signOut,
		updateUser
	}));

	return <JwtAuthContext value={authContextValue}>{children}</JwtAuthContext>;
}

export default JwtAuthProvider;
