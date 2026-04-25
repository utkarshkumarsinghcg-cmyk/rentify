import { useSelector } from 'react-redux';

export const useAuth = () => {
    const { user, isLoading } = useSelector((state) => state.auth);
    
    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        role: user?.role
    };
};
