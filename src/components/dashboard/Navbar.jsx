'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, LayoutGrid, Settings } from 'lucide-react';
import { SettingsModal } from './SettingsModal';

export function Navbar({ onAddWidget }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <>
            <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-md p-4 flex justify-between items-center text-gray-900 dark:text-white sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="bg-green-600 p-2 rounded-lg text-white">
                        <LayoutGrid size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl leading-none">FinBoard</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-xs hidden sm:block">Real-time Finance Dashboard</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSettingsOpen(true)}
                        className="text-gray-400 hover:text-white"
                        title="Settings"
                    >
                        <Settings size={20} />
                    </Button>

                    <Button
                        id="add-widget-trigger"
                        onClick={onAddWidget}
                        className="gap-2 bg-green-600 hover:bg-green-700 text-white border-0 shadow-lg shadow-green-900/20"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Add Widget</span>
                    </Button>
                </div>
            </nav>

            {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
        </>
    );
}
