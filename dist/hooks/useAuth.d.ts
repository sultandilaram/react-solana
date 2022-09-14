export default function useAuth(): {
    authToken: string | null;
    isAuth: boolean;
    login: (...args: any) => Promise<void>;
    logout: () => void;
};
