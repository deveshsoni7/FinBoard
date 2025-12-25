'use client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { fetchApiData, flattenObject } from '@/lib/api-client';
import { useStore } from '@/lib/store';
import { Loader2, Check, Search, Plus, Trash2, RefreshCw } from 'lucide-react';

export function WidgetBuilder({ onClose, initialData = null }) {
    const { addWidget, updateWidget } = useStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiData, setApiData] = useState(null);
    const [flattenedData, setFlattenedData] = useState({});

    const [config, setConfig] = useState({
        title: '',
        type: 'card',
        apiEndpoint: '',
        refreshInterval: 30,
        settings: { dataMap: {} }
    });

    // State for Search and Selection
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFields, setSelectedFields] = useState([]);

    // Initialize from initialData if provided (Edit Mode)
    useEffect(() => {
        if (initialData) {
            setConfig({
                title: initialData.title || '',
                type: initialData.type || 'card',
                apiEndpoint: initialData.apiEndpoint || '',
                refreshInterval: initialData.refreshInterval || 30,
                settings: initialData.settings || { dataMap: {} }
            });

            // Extract selected fields from settings
            const dataMap = initialData.settings?.dataMap || {};
            // If it's the new array format
            if (dataMap.selectedFields && Array.isArray(dataMap.selectedFields)) {
                setSelectedFields(dataMap.selectedFields);
            }
            // Legacy format fallback
            else if (dataMap.value) {
                const legacyFields = [dataMap.value, dataMap.change, dataMap.label].filter(Boolean);
                setSelectedFields(legacyFields);
            }

            // Note: We don't auto-fetch API data here to prevent unnecessary calls, 
            // but user can click "Test" to populate the "Available Fields" list.
        }
    }, [initialData]);

    const handleTestApi = async () => {
        if (!config.apiEndpoint) return;
        setLoading(true);
        setError(null);
        try {
            const data = await fetchApiData(config.apiEndpoint);
            setApiData(data);
            setFlattenedData(flattenObject(data));
        } catch (err) {
            setError('Failed to fetch data. Check URL or CORS.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddField = (key) => {
        if (selectedFields.includes(key)) return;
        const newSelection = [...selectedFields, key];
        setSelectedFields(newSelection);
    };

    const handleRemoveField = (key) => {
        const newSelection = selectedFields.filter(k => k !== key);
        setSelectedFields(newSelection);
    };

    const handleSave = () => {
        if (!config.title || !config.apiEndpoint || !config.type) return;

        // Save selected fields into settings structure
        // We use a generic 'selectedFields' array now for flexibility across all widget types
        const finalSettings = {
            ...config.settings,
            dataMap: {
                ...config.settings.dataMap,
                selectedFields: selectedFields
            }
        };

        if (initialData) {
            // Update existing
            updateWidget(initialData.id, {
                title: config.title,
                type: config.type,
                apiEndpoint: config.apiEndpoint,
                refreshInterval: config.refreshInterval,
                settings: finalSettings
            });
        } else {
            // Create new
            const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
            const newWidget = {
                id,
                title: config.title,
                type: config.type,
                apiEndpoint: config.apiEndpoint,
                refreshInterval: config.refreshInterval || 30,
                layout: { x: 0, y: 0, w: config.type === 'table' ? 2 : 1, h: 1 },
                settings: finalSettings
            };
            addWidget(newWidget);
        }

        onClose();
    };

    return (
        <div className="flex flex-col h-full min-h-0 bg-white dark:bg-[#0d1117]">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">

                {/* 1. Widget Name */}
                <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Widget Name</Label>
                    <Input
                        value={config.title}
                        onChange={e => setConfig({ ...config, title: e.target.value })}
                        placeholder="e.g. Bitcoin Price Tracker"
                        className="bg-gray-50 dark:bg-[#161b22] border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-600 focus:border-green-500/50 focus:ring-green-500/20 transition-all font-medium"
                    />
                </div>

                {/* 2. API URL */}
                <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">API URL</Label>
                    <div className="flex gap-2">
                        <Input
                            value={config.apiEndpoint}
                            onChange={e => setConfig({ ...config, apiEndpoint: e.target.value })}
                            className="font-mono text-xs bg-gray-50 dark:bg-[#161b22] border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-300 focus:border-green-500/50 focus:ring-green-500/20"
                            placeholder="https://api.example.com/data"
                        />
                        <Button
                            onClick={handleTestApi}
                            disabled={loading}
                            className="bg-gray-100 dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-white min-w-[80px] shrink-0"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : (
                                <span className="flex items-center gap-2">
                                    <RefreshCw size={14} /> Test
                                </span>
                            )}
                        </Button>
                    </div>
                    {apiData && !error && (
                        <div className="mt-3 bg-green-500/10 border border-green-500/20 p-2.5 rounded-md flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1">
                            <div className="bg-green-500/20 p-1 rounded-full"><Check size={12} className="text-green-500" /></div>
                            <p className="text-green-600 dark:text-green-400 text-xs font-medium">API connection successful! {Object.keys(flattenedData).length} fields found.</p>
                        </div>
                    )}
                    {error && <p className="text-red-500 dark:text-red-400 text-[10px] mt-2 bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-200 dark:border-red-900/50 flex items-center gap-2">⚠️ {error}</p>}
                </div>

                {/* 3. Refresh Interval */}
                <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Refresh Interval (seconds)</Label>
                    <Input
                        type="number"
                        value={config.refreshInterval}
                        onChange={e => setConfig({ ...config, refreshInterval: parseInt(e.target.value) || 30 })}
                        className="bg-gray-50 dark:bg-[#161b22] border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-300"
                    />
                </div>

                {/* 4. Select Fields to Display (Header) */}
                <div className="pt-2">
                    <Label className="mb-3 block text-xs uppercase tracking-wider text-gray-500 font-semibold">Select Fields to Display</Label>

                    {/* Display Mode */}
                    <div className="bg-gray-100 dark:bg-[#161b22] p-1 rounded-lg border border-gray-200 dark:border-gray-800 inline-flex gap-1 mb-6">
                        {['card', 'table', 'chart'].map(mode => (
                            <button
                                key={mode}
                                onClick={() => setConfig({ ...config, type: mode })}
                                className={`px-4 py-1.5 rounded-md text-xs font-medium capitalize transition-all flex items-center gap-2 ${config.type === mode
                                    ? 'bg-white dark:bg-green-600 text-green-700 dark:text-white shadow-sm dark:shadow-green-900/20 border border-gray-200 dark:border-transparent'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    {/* Search & Filter */}
                    <div className="space-y-3 mb-4">
                        <Label className="block text-xs uppercase tracking-wider text-gray-500 font-semibold">Search Fields</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                            <Input
                                placeholder="Search for fields..."
                                className="pl-9 bg-gray-50 dark:bg-[#1a1d21] border-gray-200 dark:border-gray-800 text-xs h-10 focus:ring-1 focus:ring-green-500 placeholder:text-gray-500 dark:placeholder:text-gray-600 rounded-md text-gray-900 dark:text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                disabled={!apiData && !initialData}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="showArrays" className="rounded bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-800 text-green-600 focus:ring-0 w-3 h-3" />
                            <label htmlFor="showArrays" className="text-[10px] text-gray-500 select-none cursor-pointer">Show arrays only (for table view)</label>
                        </div>
                    </div>

                    {/* Available Fields List */}
                    <div className="mb-6 space-y-2">
                        <Label className="block text-[10px] uppercase tracking-wider text-gray-600 font-semibold">Available Fields</Label>
                        <div className="bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 rounded-lg h-[220px] overflow-y-auto custom-scrollbar p-0">
                            {!apiData ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600/50 text-xs gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                                        <Search size={16} />
                                    </div>
                                    <span>Test API to see available fields</span>
                                </div>
                            ) : Object.keys(flattenedData).length === 0 ? (
                                <div className="p-4 text-center text-gray-500 dark:text-gray-600 text-xs">No fields found matching search</div>
                            ) : (
                                <div>
                                    {Object.entries(flattenedData)
                                        .filter(([key]) => key.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map(([key, value]) => {
                                            const isSelected = selectedFields.includes(key);
                                            return (
                                                <div
                                                    key={key}
                                                    onClick={() => !isSelected && handleAddField(key)}
                                                    className={`
                                                        flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-800/50 last:border-0 cursor-pointer transition-colors group
                                                        ${isSelected ? 'bg-green-50 dark:bg-green-900/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800/30'}
                                                    `}
                                                >
                                                    <div className="flex flex-col gap-0.5 overflow-hidden">
                                                        <span className={`text-xs font-mono truncate max-w-[280px] ${isSelected ? 'text-green-600 dark:text-green-500' : 'text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400'}`} title={key}>
                                                            {key}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] text-gray-500 dark:text-gray-600 font-mono">
                                                                {String(value).slice(0, 40)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${isSelected ? 'text-green-600 dark:text-green-500' : 'text-gray-400 dark:text-gray-600 group-hover:text-gray-900 dark:group-hover:text-white group-hover:bg-gray-200 dark:group-hover:bg-gray-700'}`}
                                                    >
                                                        {isSelected ? <Check size={14} /> : <Plus size={14} />}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selected Fields List */}
                    {selectedFields.length > 0 && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-2">
                            <Label className="block text-[10px] uppercase tracking-wider text-gray-600 font-semibold">Selected Fields</Label>
                            <div className="bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden divide-y divide-gray-200 dark:divide-gray-800">
                                {selectedFields.map((field, index) => (
                                    <div key={field} className="p-3 bg-gray-100/50 dark:bg-[#161b22]/30 flex items-center justify-between group hover:bg-gray-200 dark:hover:bg-[#161b22]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded bg-white dark:bg-gray-900 text-gray-500 text-[10px] flex items-center justify-center font-mono border border-gray-200 dark:border-gray-800">
                                                {index + 1}
                                            </div>
                                            <span className="text-xs text-gray-700 dark:text-gray-300 font-mono">{field}</span>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveField(field)}
                                            className="text-gray-400 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors p-1"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#161b22] flex justify-end gap-3 shrink-0 z-20">
                <Button
                    variant="ghost"
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-900 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-500 text-white min-w-[120px] shadow-lg shadow-green-900/20"
                    disabled={(!apiData && !initialData) || !config.title || selectedFields.length === 0}
                >
                    {initialData ? 'Update Widget' : 'Add Widget'}
                </Button>
            </div>
        </div >
    );
}
