'use client';
import { useStore } from '@/lib/store';
import { X, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRef, useState } from 'react';

export function SettingsModal({ onClose }) {
    const { widgets, theme, setTheme, importData } = useStore();
    const fileInputRef = useRef(null);
    const [importError, setImportError] = useState(null);

    const handleExport = () => {
        const data = JSON.stringify(widgets, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finboard-config-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target.result);
                if (Array.isArray(json)) {
                    importData(json);
                    onClose();
                } else {
                    setImportError('Invalid configuration file format.');
                }
            } catch (err) {
                setImportError('Failed to parse JSON file.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-[#0d1117] border border-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden ring-1 ring-white/10">
                <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-[#161b22]">
                    <h2 className="text-lg font-semibold text-white">Global Settings</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Theme Section */}


                    {/* Data Persistence Section */}
                    <div className="space-y-3">
                        <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Data & Backup</h3>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={handleExport}
                                className="bg-[#161b22] hover:bg-gray-800 border border-gray-700 text-gray-200 h-20 flex flex-col gap-2"
                            >
                                <Download size={20} className="text-green-500" />
                                <span className="text-xs">Export Config</span>
                            </Button>

                            <Button
                                onClick={handleImportClick}
                                className="bg-[#161b22] hover:bg-gray-800 border border-gray-700 text-gray-200 h-20 flex flex-col gap-2"
                            >
                                <Upload size={20} className="text-blue-500" />
                                <span className="text-xs">Import Config</span>
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".json"
                                className="hidden"
                            />
                        </div>
                        {importError && (
                            <p className="text-red-400 text-xs bg-red-950/30 p-2 rounded border border-red-900/50 text-center">
                                {importError}
                            </p>
                        )}
                        <p className="text-[10px] text-gray-500 text-center">
                            Save your dashboard layout and widgets found in <code>Task Persistence</code> requirements.
                        </p>
                    </div>
                </div>

                <div className="p-4 bg-[#161b22] border-t border-gray-800 flex justify-end">
                    <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">Done</Button>
                </div>
            </div>
        </div>
    );
}
