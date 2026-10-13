import {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ConfirmDialog from '../components/common/ConfirmDialog';
import TaskPanel from '../components/tasks/TaskPanel';
import TaskTable from '../components/tasks/TaskTable';
import {SET_SEARCH_TERM, SET_STATUS_FILTER} from '../redux/slice/tasksSlice';
import {TASK_STATUS, TASK_STATUS_LABEL} from '../utils/Constants';
import useTasks from '../utils/hooks/useTasks';

const TaskManager = () => {
    const dispatch = useDispatch();
    const {items, isLoading, searchTerm, statusFilter} = useSelector(state => state.tasks);
    const {loadTasks, saveTask, updateTaskStatus, deleteTask} = useTasks();
    const [activeTask, setActiveTask] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [isTaskPanelOpen, setTaskPanelOpen] = useState(false);
    const [isSaving, setSaving] = useState(false);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const filteredTasks = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();
        return items.filter(task => {
            const statusMatches = statusFilter === 'ALL' || task.status === statusFilter;
            const searchMatches = !search
                || task.title.toLowerCase().includes(search)
                || task.description?.toLowerCase().includes(search);
            return statusMatches && searchMatches;
        });
    }, [items, searchTerm, statusFilter]);

    const counts = useMemo(() => ({
        all: items.length,
        todo: items.filter(task => task.status === TASK_STATUS.TODO).length,
        inProgress: items.filter(task => task.status === TASK_STATUS.IN_PROGRESS).length,
        completed: items.filter(task => task.status === TASK_STATUS.COMPLETED).length
    }), [items]);

    const openCreate = () => {
        setActiveTask(null);
        setTaskPanelOpen(true);
    };

    const openEdit = task => {
        setActiveTask(task);
        setTaskPanelOpen(true);
    };

    const handleSave = async values => {
        setSaving(true);
        try {
            await saveTask(values, activeTask?.taskId);
            setTaskPanelOpen(false);
            setActiveTask(null);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!taskToDelete) return;
        await deleteTask(taskToDelete.taskId);
        setTaskToDelete(null);
    };

    const statusCards = [
        {label: 'All tasks', value: 'ALL', count: counts.all},
        {label: TASK_STATUS_LABEL.TODO, value: TASK_STATUS.TODO, count: counts.todo},
        {label: TASK_STATUS_LABEL.IN_PROGRESS, value: TASK_STATUS.IN_PROGRESS, count: counts.inProgress},
        {label: TASK_STATUS_LABEL.COMPLETED, value: TASK_STATUS.COMPLETED, count: counts.completed}
    ];

    return (
        <>
            <section className="page-heading">
                <div>
                    <span className="section-label">Task management</span>
                    <h1>Casework tasks</h1>
                    <p>Plan, track and complete work across your active cases.</p>
                </div>
                <button className="button button--create" type="button" onClick={openCreate}>
                    Create task
                </button>
            </section>

            <section className="status-overview" aria-label="Task status summary">
                {statusCards.map(card => (
                    <button
                        key={card.value}
                        type="button"
                        className={`status-card ${statusFilter === card.value ? 'status-card--active' : ''}`}
                        onClick={() => dispatch(SET_STATUS_FILTER(card.value))}
                        aria-pressed={statusFilter === card.value}
                    >
                        <span className="status-card__count">{card.count}</span>
                        <span className="status-card__label">{card.label}</span>
                    </button>
                ))}
            </section>

            <section className="task-workbench" aria-labelledby="task-list-heading">
                <div className="workbench-heading">
                    <div>
                        <h2 id="task-list-heading">Your task list</h2>
                        <p>{filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} in this view</p>
                    </div>
                    <div className="filter-controls">
                        <div className="search-control">
                            <label htmlFor="task-search">Search tasks</label>
                            <input
                                id="task-search"
                                type="search"
                                placeholder="Search by title or description"
                                value={searchTerm}
                                onChange={event => dispatch(SET_SEARCH_TERM(event.target.value))}
                            />
                        </div>
                        <div className="select-control">
                            <label htmlFor="status-filter">Filter by status</label>
                            <select
                                id="status-filter"
                                value={statusFilter}
                                onChange={event => dispatch(SET_STATUS_FILTER(event.target.value))}
                            >
                                <option value="ALL">All statuses</option>
                                {Object.values(TASK_STATUS).map(status => (
                                    <option key={status} value={status}>{TASK_STATUS_LABEL[status]}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="loading-state" role="status">
                        <span className="spinner" aria-hidden="true" />
                        Loading tasks
                    </div>
                ) : (
                    <TaskTable
                        tasks={filteredTasks}
                        onEdit={openEdit}
                        onDelete={setTaskToDelete}
                        onStatusChange={updateTaskStatus}
                    />
                )}
            </section>

            <TaskPanel
                isOpen={isTaskPanelOpen}
                task={activeTask}
                isSaving={isSaving}
                onSave={handleSave}
                onClose={() => setTaskPanelOpen(false)}
            />

            <ConfirmDialog
                isOpen={Boolean(taskToDelete)}
                title="Delete this task?"
                confirmLabel="Delete task"
                onConfirm={handleDelete}
                onCancel={() => setTaskToDelete(null)}
            >
                <p>This will permanently delete <strong>{taskToDelete?.title}</strong>.</p>
            </ConfirmDialog>
        </>
    );
};

export default TaskManager;
