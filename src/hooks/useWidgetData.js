'use client';
import { useState, useEffect, useRef } from 'react';
import { fetchApiData } from '@/lib/api-client';

export function useWidgetData(widget) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        const loadData = async () => {
            try {
                setLoading(true);
                const result = await fetchApiData(widget.apiEndpoint);
                if (mountedRef.current) {
                    setData(result);
                    setError(null);
                }
            } catch (err) {
                if (mountedRef.current) {
                    setError(err);
                }
            } finally {
                if (mountedRef.current) {
                    setLoading(false);
                }
            }
        };

        loadData();

        const intervalId = setInterval(loadData, (widget.refreshInterval || 30) * 1000);

        return () => {
            mountedRef.current = false;
            clearInterval(intervalId);
        };
    }, [widget.apiEndpoint, widget.refreshInterval]);

    return { data, loading, error };
}
