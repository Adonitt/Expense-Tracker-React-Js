export interface AuthUser {
    id?: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    isActive?: boolean;
    exp?: number;
}

const TOKEN_KEY = 'token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const decodeToken = (token: string): any | null => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

const getLoggedInUser = (): AuthUser | null => {
    const token = getToken();
    if (!token) return null;

    const decodedToken = decodeToken(token);
    if (!decodedToken) return null;

    return {
        id: decodedToken.id,
        email: decodedToken.email,
        role: decodedToken.role,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
        exp: decodedToken.exp,
        isActive: decodedToken.isActive
    }
}

const isLoggedIn = (): boolean => {
    return !!localStorage.getItem("token");
};

const hasRole = (role: string): boolean => {
    const user = getLoggedInUser();
    return user?.role === role;
}

const logout = () => {
    clearToken()
    window.location.href = "/login";
}

export {logout, isLoggedIn, hasRole, getLoggedInUser};
