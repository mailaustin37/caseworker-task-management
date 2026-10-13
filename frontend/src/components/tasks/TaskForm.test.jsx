import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import TaskForm from './TaskForm';

describe('TaskForm', () => {
    it('validates and submits a new task', async () => {
        const onSave = vi.fn().mockResolvedValue(undefined);

        render(
            <TaskForm
                task={null}
                isSaving={false}
                onSave={onSave}
                onCancel={vi.fn()}
            />
        );

        fireEvent.change(screen.getByLabelText('Task title'), {
            target: {value: 'Prepare hearing bundle'}
        });
        fireEvent.change(screen.getByLabelText('Description (optional)'), {
            target: {value: 'Check the evidence before the hearing'}
        });
        fireEvent.change(screen.getByLabelText('Due date and time'), {
            target: {value: '2035-03-10T12:00'}
        });
        fireEvent.click(screen.getByRole('button', {name: 'Create task'}));

        await waitFor(() => expect(onSave).toHaveBeenCalledWith({
            title: 'Prepare hearing bundle',
            description: 'Check the evidence before the hearing',
            status: 'TODO',
            dueDateTime: '2035-03-10T12:00:00'
        }));
    });

    it('shows validation errors instead of submitting incomplete data', async () => {
        const onSave = vi.fn();
        render(
            <TaskForm
                task={null}
                isSaving={false}
                onSave={onSave}
                onCancel={vi.fn()}
            />
        );

        fireEvent.click(screen.getByRole('button', {name: 'Create task'}));

        expect(await screen.findByText('Enter a task title')).toBeInTheDocument();
        expect(screen.getByText('Enter a due date and time')).toBeInTheDocument();
        expect(onSave).not.toHaveBeenCalled();
    });
});
