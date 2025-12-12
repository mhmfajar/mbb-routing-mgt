import { useState, useEffect } from 'react';

import type { ApiError, ApiResponse } from '~/types';

interface UseFetchOptions {
    immediate?: boolean;
}

interface UseFetchResult<T> {
    data: T | null;
    loading: boolean;
    error: ApiError | null;
    refetch: () => Promise<void>;
}

export function useFetch<T>(
    url: string,
    options: UseFetchOptions = { immediate: true }
): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw {
                    message: response.statusText,
                    status: response.status,
                };
            }

            const result: ApiResponse<T> = await response.json();
            setData(result.data);
        } catch (err) {
            setError(err as ApiError);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (options.immediate) {
            fetchData();
        }
    }, [url, options.immediate]);

    return { data, loading, error, refetch: fetchData };
}
