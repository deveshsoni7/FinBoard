'use client';

import { useStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export function ThemeProvider({ children }) {
    const { theme } = useStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    if (!mounted) {
        return <div className="invisible">{children}</div>;
    }

    return <>{children}</>;
}
