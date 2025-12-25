'use client';
import { useStore } from '@/lib/store';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { WidgetContainer } from '@/components/widgets/WidgetContainer';
import { FinanceCard } from '@/components/widgets/FinanceCard';
import { ChartWidget } from '@/components/widgets/ChartWidget';
import { TableWidget } from '@/components/widgets/TableWidget';
import { useState, useEffect } from 'react';

// Helper to render widget content based on type
const renderWidgetContent = (widget) => {
    switch (widget.type) {
        case 'card': return <FinanceCard widget={widget} />;
        case 'chart': return <ChartWidget widget={widget} />;
        case 'table': return <TableWidget widget={widget} />;
        default: return <div className="text-gray-500 text-xs p-4">Unknown widget type: {widget.type}</div>;
    }
};

export function DashboardGrid({ onEdit }) {
    const { widgets, reorderWidgets } = useStore();
    const [activeId, setActiveId] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require drag of 8px to start, prevents accidental drags on clicks
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = widgets.findIndex((w) => w.id === active.id);
            const newIndex = widgets.findIndex((w) => w.id === over.id);
            reorderWidgets(arrayMove(widgets, oldIndex, newIndex));
        }
        setActiveId(null);
    };

    const activeWidget = activeId ? widgets.find(w => w.id === activeId) : null;

    if (!mounted) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

    if (widgets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <div
                    onClick={() => document.getElementById('add-widget-trigger')?.click()}
                    className="group w-64 h-64 border-2 border-dashed border-gray-700 hover:border-green-500/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-green-500/5 relative"
                >
                    <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center mb-4 text-white shadow-lg shadow-green-900/30 group-hover:scale-110 transition-transform">
                        <span className="text-2xl font-light">+</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-1">Add Widget</h3>
                    <p className="text-gray-500 text-xs max-w-[180px] leading-relaxed">
                        Connect to a finance API and create a custom widget
                    </p>
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-green-500/5 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
                </div>
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={(event) => setActiveId(event.active.id)}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={widgets.map(w => w.id)}
                strategy={rectSortingStrategy}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                    {widgets.map((widget) => (
                        <WidgetContainer key={widget.id} widget={widget} onEdit={onEdit}>
                            {renderWidgetContent(widget)}
                        </WidgetContainer>
                    ))}
                </div>
            </SortableContext>

            <DragOverlay>
                {activeWidget ? (
                    <div className="opacity-80">
                        <WidgetContainer widget={activeWidget}>
                            {renderWidgetContent(activeWidget)}
                        </WidgetContainer>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
