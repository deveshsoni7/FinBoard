import { useState } from 'react';
import { useWidgetData } from '@/hooks/useWidgetData';
import { Loader2, Search, ArrowUpDown } from 'lucide-react';

export function TableWidget({ widget }) {
    const { data: rawData, loading, error } = useWidgetData(widget);
    const [searchTerm, setSearchTerm] = useState('');

    if (loading) return <div className="h-full flex items-center justify-center text-gray-500"><Loader2 className="animate-spin text-green-600" /></div>;
    if (error) return <div className="h-full flex items-center justify-center text-red-500 text-xs">Failed to load data</div>;

    // Helper to find the largest array in the object (deep search)
    const findLargestArray = (obj) => {
        if (!obj) return null;
        if (Array.isArray(obj)) return obj;
        if (typeof obj !== 'object') return null;

        let largestArray = null;
        let maxLength = 0;

        for (const key in obj) {
            const result = findLargestArray(obj[key]);
            if (result && Array.isArray(result) && result.length > maxLength) {
                largestArray = result;
                maxLength = result.length;
            }
        }
        return largestArray;
    };

    const tableData = findLargestArray(rawData) || [];

    if (tableData.length === 0) return <div className="h-full flex items-center justify-center text-gray-500 text-xs">No array data found</div>;

    // Get columns from first item
    const allColumns = Object.keys(tableData[0] || {});
    // Prioritize columns that match selected fields if available, otherwise take first 4
    const columns = allColumns.slice(0, 4);

    const filteredData = tableData.filter(row =>
        Object.values(row).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Search Bar - Matches Reference */}
            <div className="px-1 pb-3">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 text-gray-500" size={14} />
                    <input
                        type="text"
                        placeholder="Search table..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-300 text-xs rounded-lg py-2 pl-8 pr-3 focus:outline-none focus:border-gray-400 dark:focus:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-600"
                    />
                    <div className="absolute right-3 top-2.5 text-[10px] text-gray-500 dark:text-gray-600 font-mono">
                        {filteredData.length} of {tableData.length} items
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-gray-50 dark:bg-[#0d1117] z-10">
                        <tr>
                            {columns.map(col => (
                                <th key={col} className="p-3 text-[10px] uppercase tracking-wider font-semibold text-gray-500 border-b border-gray-200 dark:border-gray-800/50 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                    <div className="flex items-center gap-1">
                                        {col}
                                        <ArrowUpDown size={10} className="opacity-50" />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/30">
                        {filteredData.slice(0, 100).map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors group">
                                {columns.map(col => (
                                    <td key={col} className="p-3 text-xs text-gray-700 dark:text-gray-300 font-mono border-b border-gray-100 dark:border-gray-800/30 whitespace-nowrap">
                                        {typeof row[col] === 'object' ?
                                            <span className="text-gray-400 dark:text-gray-600 italic">obj</span> :
                                            String(row[col])
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredData.length === 0 && (
                    <div className="p-8 text-center text-gray-500 text-xs">No matching results</div>
                )}
            </div>
        </div>
    );
}
