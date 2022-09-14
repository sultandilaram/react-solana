interface Response<T = any> {
    success: boolean;
    code: number;
    message: string;
    data: T;
}
export default function useApi(): {
    get: <T = any>(endpoint: string) => Promise<T | Response<T>>;
    post: <T_1 = any, R = any>(endpoint: string, data: T_1) => Promise<R | Response<R>>;
    put: <T_2 = any, R_1 = any>(endpoint: string, data: T_2) => Promise<R_1 | Response<R_1>>;
    del: <T_3 = any>(endpoint: string) => Promise<T_3 | Response<T_3>>;
};
export {};
