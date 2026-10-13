import dayjs from 'dayjs';
import StatusBadge from '../common/StatusBadge';
import {TASK_STATUS, TASK_STATUS_LABEL} from '../../utils/Constants';

const dueState = task => {
    if (task.status === TASK_STATUS.COMPLETED) return '';
    const due = dayjs(task.dueDateTime);
    if (due.isBefore(dayjs())) return 'Overdue';
    if (due.isBefore(dayjs().add(1, 'day'))) return 'Due soon';
    return '';
};

const TaskTable = ({tasks, onEdit, onDelete, onStatusChange}) => {
    if (!tasks.length) {
        return (
            <div className="empty-state">
                <span className="empty-state__mark" aria-hidden="true">✓</span>
                <h2>No tasks match this view</h2>
                <p>Change the filters or create a task to start tracking casework.</p>
            </div>
        );
    }

    return (
        <div className="task-table-wrap">
            <table className="task-table">
                <caption className="visually-hidden">Caseworker tasks</caption>
                <thead>
                    <tr>
                        <th scope="col">Task</th>
                        <th scope="col">Due</th>
                        <th scope="col">Status</th>
                        <th scope="col"><span className="visually-hidden">Actions</span></th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => {
                        const timing = dueState(task);
                        return (
                            <tr key={task.taskId}>
                                <td data-label="Task">
                                    <button className="task-title" type="button" onClick={() => onEdit(task)}>
                                        {task.title}
                                    </button>
                                    {task.description && <p className="task-description">{task.description}</p>}
                                </td>
                                <td data-label="Due">
                                    <time dateTime={task.dueDateTime}>
                                        {dayjs(task.dueDateTime).format('D MMM YYYY, HH:mm')}
                                    </time>
                                    {timing && <span className={`due-flag due-flag--${timing === 'Overdue' ? 'overdue' : 'soon'}`}>{timing}</span>}
                                </td>
                                <td data-label="Status">
                                    <StatusBadge status={task.status} />
                                    <label className="visually-hidden" htmlFor={`status-${task.taskId}`}>Change status</label>
                                    <select
                                        id={`status-${task.taskId}`}
                                        className="status-select"
                                        value={task.status}
                                        onChange={event => onStatusChange(task.taskId, event.target.value)}
                                    >
                                        {Object.values(TASK_STATUS).map(status => (
                                            <option key={status} value={status}>{TASK_STATUS_LABEL[status]}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="task-actions" data-label="Actions">
                                    <button type="button" className="text-button" onClick={() => onEdit(task)}>Edit</button>
                                    <button type="button" className="text-button text-button--danger" onClick={() => onDelete(task)}>Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TaskTable;
