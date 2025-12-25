'use client';
import { Navbar } from '@/components/dashboard/Navbar';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { useState } from 'react';
import { X } from 'lucide-react';
import { WidgetBuilder } from '@/components/builder/WidgetBuilder';

export default function Home() {
    // using combined state or just a separate one for editing
    const [isWidgetBuilderOpen, setIsWidgetBuilderOpen] = useState(false);
    const [editingWidget, setEditingWidget] = useState(null);

    const handleAddWidget = () => {
        setEditingWidget(null);
        setIsWidgetBuilderOpen(true);
    };

    const handleEditWidget = (widget) => {
        setEditingWidget(widget);
        setIsWidgetBuilderOpen(true);
    };

    const handleCloseWidgetBuilder = () => {
        setIsWidgetBuilderOpen(false);
        setEditingWidget(null);
    };

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar onAddWidget={handleAddWidget} />

            <div className="flex-1 overflow-auto bg-background">
                <div className="container mx-auto max-w-7xl py-8 px-4">
                    <DashboardGrid onEdit={handleEditWidget} />
                </div>
            </div>

            {isWidgetBuilderOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800 shrink-0 bg-gray-50 dark:bg-[#161b22]">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {editingWidget ? 'Edit Widget' : 'Add New Widget'}
                            </h2>
                            <button
                                onClick={handleCloseWidgetBuilder}
                                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-0 flex-1 overflow-hidden flex flex-col w-full relative bg-white dark:bg-[#0d1117]">
                            <WidgetBuilder
                                onClose={handleCloseWidgetBuilder}
                                initialData={editingWidget}
                            />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
