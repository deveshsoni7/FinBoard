'use client';
import { useWidgetData } from '@/hooks/useWidgetData';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { flattenObject } from '@/lib/api-client';

export function FinanceCard({ widget }) {
    const { data, loading, error } = useWidgetData(widget);

    if (loading) return <div className="h-full flex items-center justify-center text-gray-500"><Loader2 className="animate-spin text-green-600" /></div>;
    if (error) return <div className="h-full flex flex-col items-center justify-center text-red-500 text-xs text-center p-2"><span className="text-lg">⚠️</span><span className="mt-2">Connection Failed</span></div>;
    if (!data) return <div className="h-full flex items-center justify-center text-gray-500 text-xs">No Data Available</div>;

    const flatData = flattenObject(data);

    // Get selected fields from settings
    const selectedFields = widget.settings?.dataMap?.selectedFields || [];

    // Fallback if no specific fields selected (legacy support or safety)
    if (selectedFields.length === 0 && widget.settings?.dataMap?.value) {
        selectedFields.push(widget.settings.dataMap.value);
    }

    return (
        <div className="flex flex-col h-full font-sans justify-between relative">
            <div className="space-y-4">
                {selectedFields.map((field, index) => {
                    const value = flatData[field];
                    const label = field.split('.').pop() || field;

                    // First field is typically the primary currency/title in the reference (e.g. BTC)
                    // The rest are list items (e.g. INR: 93847...)
                    // Based on Ref Image:
                    // Row 1: currency (left) ... BTC (right, Bold)
                    // Row 2: INR (left) ... Value (right, Bold)

                    return (
                        <div key={field} className={`flex justify-between items-end group/item ${index !== 0 ? 'pt-3 border-t border-gray-100 dark:border-gray-800/50' : ''}`}>
                            <span className="text-gray-500 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider mb-0.5">{label}</span>
                            <div className="text-right">
                                <span className="text-base font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                                    {value !== undefined ? String(value) : '--'}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {/* Empty State / Placeholder lines if few fields */}
                {selectedFields.length === 0 && (
                    <div className="space-y-3">
                        <div className="h-6 w-full bg-gray-100 dark:bg-gray-800/20 rounded animate-pulse"></div>
                        <div className="h-6 w-2/3 bg-gray-100 dark:bg-gray-800/20 rounded animate-pulse"></div>
                    </div>
                )}
            </div>

            <div className="mt-auto pt-3 flex justify-between items-center border-t border-gray-100 dark:border-gray-800/30">
                <p className="text-[10px] text-gray-500 font-medium">
                    Last updated: <span className="text-gray-400 dark:text-gray-400">{new Date().toLocaleTimeString()}</span>
                </p>
            </div>
        </div>
    );
}
