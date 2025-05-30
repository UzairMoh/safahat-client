import { jwtDecode } from 'jwt-decode';

export const getUserIdFromToken = (): string | null => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const decoded = jwtDecode(token) as any;
        const id = decoded.i || decoded.sub || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

        return id ? String(id) : null;
    } catch (err) {
        console.error('Failed to decode token:', err);
        return null;
    }
};