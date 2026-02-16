import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/task.service';
import type { Task } from '../types/task.types';
import { TaskCard } from '../components/ui/TaskCard';
import { Button } from '../components/ui/Button';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal';
import { Pagination } from '../components/ui/Pagination'; // Import the new component
import { authService } from '../services/auth.service';

export const HomePage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null); // New state for editing

    // Pagination & Sorting state
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');

    // Extended Filters state
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [priorityFilter, setPriorityFilter] = useState<string>('');
    const [dueDateFrom, setDueDateFrom] = useState('');
    const [dueDateTo, setDueDateTo] = useState('');

    const navigate = useNavigate();

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(0); // Reset page on search change
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleCreateNew = () => {
        setTaskToEdit(null);
        setIsCreateModalOpen(true);
    };

    const handleLogout = async () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const { refreshToken } = JSON.parse(storedUser);
                if (refreshToken) {
                    await authService.logout(refreshToken);
                }
            } catch (err) {
                console.error('Logout error:', err);
            }
        }
        localStorage.removeItem('user');
        navigate('/login');
    };

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: any = {
                page,
                size: pageSize,
                sortBy,
                sortDirection,
            };

            if (search) params.search = search;
            if (statusFilter) params.status = statusFilter;
            if (priorityFilter) params.priority = priorityFilter;
            if (dueDateFrom) params.dueDateFrom = new Date(dueDateFrom).toISOString();
            if (dueDateTo) params.dueDateTo = new Date(dueDateTo).toISOString();

            const response = await taskService.getTasks(params);
            setTasks(response.content);
            setTotalPages(response.totalPages);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
            // setError('Failed to load tasks. Please try again.'); // Optional: keep or remove UI error
            toast.error('Failed to load tasks');
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize, sortBy, sortDirection, search, statusFilter, priorityFilter, dueDateFrom, dueDateTo]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }

        // Fetch fresh user details
        authService.getCurrentUser()
            .then((u: { username: string }) => setUser(u))
            .catch((err: any) => console.error('Failed to fetch user:', err));

        fetchTasks();
    }, [navigate, fetchTasks]);

    const handleEdit = (task: Task) => {
        setTaskToEdit(task);
        setIsCreateModalOpen(true);
    };

    const handleTaskSaved = () => {
        fetchTasks(); // Refresh list after create or update
    };

    const handleDelete = async (task: Task) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                // Optimistically update list or just reload
                await taskService.deleteTask(task.id);
                toast.success('Task deleted successfully');
                fetchTasks();
            } catch (err) {
                console.error('Failed to delete task:', err);
                toast.error('Failed to delete task');
            }
        }
    };



    // Filter change handlers (reset page to 0)
    const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
        setPage(0);
    };

    const handleSortDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortDirection(e.target.value as 'ASC' | 'DESC');
        setPage(0);
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setPage(0);
    };

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('');
        setPriorityFilter('');
        setDueDateFrom('');
        setDueDateTo('');
        setPage(0);
    };

    if (isLoading && tasks.length === 0) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-uber-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-uber-white">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-uber-black">My Tasks</h1>
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={handleCreateNew}
                            className="!py-2 !px-4 text-sm"
                        >
                            Create New
                        </Button>
                        {user && (
                            <span className="hidden sm:inline-block text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                Hi, <span className="text-uber-black">{user.username}</span>
                            </span>
                        )}
                        <Button
                            variant="secondary"
                            onClick={handleLogout}
                            className="!p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 !border-transparent"
                            title="Log Out"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filter and Sort Controls */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col gap-6 transition-all hover:shadow-md">
                    {/* Top Row: Search and Fundamental Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-1 relative">
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm border-gray-200 bg-gray-50 rounded-lg focus:border-uber-black focus:ring-black focus:bg-white transition-colors"
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>

                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                                className="w-full appearance-none pl-3 pr-8 py-2 text-sm bg-gray-50 border-transparent rounded-lg focus:border-uber-black focus:ring-0 hover:bg-gray-100 transition-colors cursor-pointer text-gray-700"
                            >
                                <option value="">All Statuses</option>
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>

                        <div className="relative">
                            <select
                                value={priorityFilter}
                                onChange={(e) => { setPriorityFilter(e.target.value); setPage(0); }}
                                className="w-full appearance-none pl-3 pr-8 py-2 text-sm bg-gray-50 border-transparent rounded-lg focus:border-uber-black focus:ring-0 hover:bg-gray-100 transition-colors cursor-pointer text-gray-700"
                            >
                                <option value="">All Priorities</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={dueDateFrom}
                                onChange={(e) => { setDueDateFrom(e.target.value); setPage(0); }}
                                className="w-full px-3 py-2 text-sm border-gray-200 bg-gray-50 rounded-lg focus:border-uber-black focus:ring-black focus:bg-white transition-colors text-gray-500"
                                placeholder="From"
                            />
                            <input
                                type="date"
                                value={dueDateTo}
                                onChange={(e) => { setDueDateTo(e.target.value); setPage(0); }}
                                className="w-full px-3 py-2 text-sm border-gray-200 bg-gray-50 rounded-lg focus:border-uber-black focus:ring-black focus:bg-white transition-colors text-gray-500"
                                placeholder="To"
                            />
                        </div>
                    </div>

                    {/* Bottom Row: Sort and Page Size */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-4 items-center w-full sm:w-auto">
                            <div className="flex items-center gap-2 group">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 group-hover:text-uber-black transition-colors">Sort</label>
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={handleSortByChange}
                                        className="appearance-none pl-3 pr-8 py-2 text-sm bg-gray-50 border-transparent rounded-lg focus:border-uber-black focus:ring-0 hover:bg-gray-100 transition-colors cursor-pointer font-medium text-gray-700"
                                    >
                                        <option value="createdAt">Created Date</option>
                                        <option value="dueDate">Due Date</option>
                                        <option value="priority">Priority</option>
                                        <option value="status">Status</option>
                                        <option value="title">Title</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 group">
                                <div className="relative">
                                    <select
                                        value={sortDirection}
                                        onChange={handleSortDirectionChange}
                                        className="appearance-none pl-3 pr-8 py-2 text-sm bg-gray-50 border-transparent rounded-lg focus:border-uber-black focus:ring-0 hover:bg-gray-100 transition-colors cursor-pointer font-medium text-gray-700"
                                    >
                                        <option value="DESC">Newest First</option>
                                        <option value="ASC">Oldest First</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Show</label>
                            <div className="relative">
                                <select
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                    className="appearance-none pl-3 pr-8 py-2 text-sm bg-gray-50 border-transparent rounded-lg focus:border-uber-black focus:ring-0 hover:bg-gray-100 transition-colors cursor-pointer font-medium text-gray-700"
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>

                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-500 hover:text-uber-black underline decoration-gray-300 hover:decoration-uber-black underline-offset-4 transition-all"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
                        {error}
                    </div>
                )}

                <CreateTaskModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onTaskSaved={handleTaskSaved}
                    taskToEdit={taskToEdit}
                />

                {tasks.length === 0 && !error && !isLoading ? (
                    <div className="text-center py-12">
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">No tasks</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
                        <div className="mt-6">
                            <Button onClick={handleCreateNew}>Create New Task</Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onClick={(t) => console.log('Clicked task:', t.id)}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(newPage: number) => setPage(newPage)}
                            isLoading={isLoading}
                        />
                    </>
                )}
            </main>
        </div>
    );
};
