import {fireEvent, render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import TaskTable from './TaskTable';

const task = {
    taskId: 'task-one',
    title: 'Review witness statement',
    description: 'Check the supporting evidence',
    status: 'TODO',
    dueDateTime: '2035-03-10T12:00:00'
};

describe('TaskTable', () => {
    it('shows task details and exposes update actions', () => {
        const onEdit = vi.fn();
        const onDelete = vi.fn();
        const onStatusChange = vi.fn();

        render(
            <TaskTable
                tasks={[task]}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
            />
        );

        expect(screen.getByRole('table', {name: 'Caseworker tasks'})).toBeInTheDocument();
        expect(screen.getByText(task.description)).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', {name: 'Edit'}));
        fireEvent.change(screen.getByLabelText('Change status'), {
            target: {value: 'COMPLETED'}
        });
        fireEvent.click(screen.getByRole('button', {name: 'Delete'}));

        expect(onEdit).toHaveBeenCalledWith(task);
        expect(onStatusChange).toHaveBeenCalledWith(task.taskId, 'COMPLETED');
        expect(onDelete).toHaveBeenCalledWith(task);
    });

    it('provides a clear empty state', () => {
        render(
            <TaskTable
                tasks={[]}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
                onStatusChange={vi.fn()}
            />
        );

        expect(screen.getByRole('heading', {name: 'No tasks match this view'}))
            .toBeInTheDocument();
    });
});
