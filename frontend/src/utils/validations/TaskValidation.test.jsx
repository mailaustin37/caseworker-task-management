import {describe, expect, it} from 'vitest';
import {TaskValidation} from './TaskValidation';

describe('TaskValidation', () => {
    it('accepts a complete future task', async () => {
        const result = await TaskValidation.validate({
            title: 'Review witness statement',
            description: '',
            status: 'TODO',
            dueDateTime: '2035-03-10T12:00'
        });
        expect(result.title).toBe('Review witness statement');
    });

    it('requires a title', async () => {
        await expect(TaskValidation.validate({
            title: '',
            description: '',
            status: 'TODO',
            dueDateTime: '2035-03-10T12:00'
        })).rejects.toThrow('Enter a task title');
    });
});
