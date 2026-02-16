import React from 'react';
import type { Task } from '../../types/task.types';


interface TaskCardProps {
    task: Task;
    onClick?: (task: Task) => void;
    onEdit?: (task: Task) => void;
    onDelete?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onEdit, onDelete }) => {
    const statusColors = {
        TODO: 'bg-gray-100 text-gray-800',
        IN_PROGRESS: 'bg-blue-100 text-uber-blue',
        DONE: 'bg-green-100 text-uber-green',
    };

    const priorityColors = {
        High: 'text-red-600',
        Medium: 'text-yellow-600',
        Low: 'text-gray-500',
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit?.(task);
    };

    return (
        <div
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer relative group"
            onClick={() => onClick?.(task)}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-uber-black truncate pr-4 flex-1">{task.title}</h3>
                <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status] || 'bg-gray-100'}`}>
                        {task.status.replace('_', ' ')}
                    </span>
                    <button
                        onClick={handleEditClick}
                        className="p-1 text-gray-400 hover:text-uber-black hover:bg-gray-100 rounded-full transition-colors"
                        title="Edit Task"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete?.(task); }}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete Task"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

            <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    <span className={`font-medium ${priorityColors[task.priority as keyof typeof priorityColors] || 'text-gray-500'}`}>
                        {task.priority} Priority
                    </span>
                    {task.dueDate && (
                        <span>• Due {new Date(task.dueDate).toLocaleDateString()}</span>
                    )}
                </div>
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
};
