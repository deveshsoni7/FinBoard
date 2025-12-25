'use client';
import { useWidgetData } from '@/hooks/useWidgetData';
import { useStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ChartWidget({ widget }) {
    const { data: rawData, loading, error } = useWidgetData(widget);
    // Dynamically get theme for Recharts colors
    const { theme } = useStore();
    const isDark = theme === 'dark';

    if (loading) return <div className="h-full flex items-center justify-center text-gray-500"><Loader2 className="animate-spin text-green-600" /></div>;
    if (error) return <div className="h-full flex items-center justify-center text-red-500 text-xs">Failed to load chart</div>;

    // Naive data processing: assume API returns an array of objects or an object with an array property
    let chartData = [];
    if (Array.isArray(rawData)) {
        chartData = rawData;
    } else if (rawData && typeof rawData === 'object') {
        // Try to find an array in the object values
        const arrayProp = Object.values(rawData).find(val => Array.isArray(val));
        if (arrayProp) chartData = arrayProp;
        else if (rawData) chartData = [rawData];
    }

    if (!chartData || chartData.length === 0) return <div className="h-full flex items-center justify-center text-gray-500 text-xs">No data for chart</div>;

    // Keys guessing if not provided
    const keys = Object.keys(chartData[0] || {});
    // Prioritize timestamp/date/time keys for X axis
    const xKey = widget.settings?.dataMap?.['xAxis'] || keys.find(k => /date|time|ts|timestamp/i.test(k)) || keys[0];
    // Prioritize value/price/amount keys for Y axis
    const yKey = widget.settings?.dataMap?.['yAxis'] || keys.find(k => /price|value|amount|close/i.test(k) && typeof chartData[0][k] === 'number') || keys.find(k => typeof chartData[0][k] === 'number') || keys[1];

    if (!yKey) return <div className="h-full flex items-center justify-center text-gray-500 text-xs">Could not identify numeric data</div>;

    return (
        <div className="h-full w-full pt-2 text-xs">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} opacity={0.5} />
                    <XAxis
                        dataKey={xKey}
                        stroke={isDark ? "#9CA3AF" : "#6b7280"}
                        fontSize={10}
                        tickFormatter={(val) => {
                            try {
                                if (typeof val === 'number' && val > 10000000000) return new Date(val).toLocaleTimeString(); // Timestamp
                                return String(val).substring(0, 10);
                            } catch (e) { return String(val).substring(0, 5); }
                        }}
                    />
                    <YAxis stroke={isDark ? "#9CA3AF" : "#6b7280"} fontSize={10} domain={['auto', 'auto']} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: isDark ? '#111827' : '#ffffff',
                            borderColor: isDark ? '#374151' : '#e5e7eb',
                            color: isDark ? '#F3F4F6' : '#111827',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        itemStyle={{ color: '#16A34A' }}
                        labelStyle={{ color: isDark ? '#9CA3AF' : '#6b7280' }}
                    />
                    <Line type="monotone" dataKey={yKey} stroke="#16A34A" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
