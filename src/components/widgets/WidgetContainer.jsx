'use client';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Settings, Trash2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function WidgetContainer({ widget, children, onEdit }) {
    const { removeWidget } = useStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: widget.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            // Updated style: Glassmorphism effect, darker bg, border glow on hover
            // Updated logic: Check layout width or type to determine span
            className={cn(
                "bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col overflow-hidden relative group hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300",
                // Height Logic: Table/Chart = taller (96), Card = standard (64)
                (widget.type === 'table' || widget.type === 'chart') ? "h-96" : "h-64",
                // Width Logic: w >= 2 -> col-span-2
                (widget.layout?.w >= 2 || widget.type === 'table') ? "md:col-span-2" : "col-span-1",
                isDragging && "shadow-2xl ring-2 ring-green-500/50 opacity-80 scale-105 z-50"
            )}
        >
            <div
                className="px-5 py-3 border-b border-gray-100 dark:border-gray-800/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20 cursor-grab active:cursor-grabbing backdrop-blur-sm"
                {...attributes}
                {...listeners}
            >
                <div className="flex items-center gap-2.5">
                    {/* Icon/Status Indicator like Reference */}
                    <div className="flex items-center justify-center w-5 h-5 rounded bg-gray-100 dark:bg-gray-800 text-gray-400">
                        {/* Simple grid icon or similar */}
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    </div>
                    <span className="font-semibold text-sm text-gray-700 dark:text-gray-200 truncate max-w-[140px] tracking-wide">{widget.title}</span>

                    {/* Badge like '30s' in reference */}
                    <span className="text-[10px] font-medium text-gray-500 bg-gray-800/80 px-1.5 py-0.5 rounded border border-gray-700/50">
                        {widget.refreshInterval || 30}s
                    </span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-white hover:bg-white/10 rounded-md">
                        <RefreshCw size={13} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-500 hover:text-white hover:bg-white/10 rounded-md"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onEdit) onEdit(widget);
                        }}
                    >
                        <Settings size={13} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-md"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent drag start
                            removeWidget(widget.id);
                        }}
                    >
                        <Trash2 size={13} />
                    </Button>
                </div>
            </div>
            <div className="flex-1 p-5 overflow-auto relative md:no-scrollbar">
                {children}
            </div>
        </div>
    );
}
