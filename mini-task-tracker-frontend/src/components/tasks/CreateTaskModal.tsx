import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { taskService } from '../../services/task.service';
import type { CreateTaskRequest, Task } from '../../types/task.types';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTaskSaved: () => void;
    taskToEdit?: Task | null;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onTaskSaved, taskToEdit }) => {
    const [formData, setFormData] = useState<CreateTaskRequest>({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'Medium',
        dueDate: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (taskToEdit) {
            setFormData({
                title: taskToEdit.title,
                description: taskToEdit.description,
                status: taskToEdit.status,
                priority: taskToEdit.priority,
                dueDate: taskToEdit.dueDate || ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'TODO',
                priority: 'Medium',
                dueDate: ''
            });
        }
    }, [taskToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (taskToEdit) {
                await taskService.updateTask(taskToEdit.id, formData);
            } else {
                await taskService.createTask(formData);
            }

            onTaskSaved();
            onClose();
        } catch (err) {
            console.error('Failed to save task:', err);
            setError('Failed to save task. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={taskToEdit ? "Edit Task" : "Create New Task"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="What needs to be done?"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea
                        className="block w-full px-4 py-3 bg-gray-100 border border-transparent text-uber-black placeholder-gray-500 focus:bg-white focus:border-black focus:ring-0 focus:outline-none transition-colors duration-200 rounded-none"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Add details..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                        <select
                            className="block w-full px-4 py-3 bg-gray-100 border border-transparent text-uber-black focus:bg-white focus:border-black focus:ring-0 focus:outline-none transition-colors duration-200"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
                        <input
                            type="date"
                            className="block w-full px-4 py-3 bg-gray-100 border border-transparent text-uber-black focus:bg-white focus:border-black focus:ring-0 focus:outline-none transition-colors duration-200"
                            value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                    <select
                        className="block w-full px-4 py-3 bg-gray-100 border border-transparent text-uber-black focus:bg-white focus:border-black focus:ring-0 focus:outline-none transition-colors duration-200"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                    </select>
                </div>

                {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                )}

                <div className="pt-2 flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {taskToEdit ? "Update Task" : "Create Task"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
