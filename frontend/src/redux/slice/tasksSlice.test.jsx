import {describe, expect, it} from 'vitest';
import reducer, {REMOVE_TASK, SET_TASKS, UPSERT_TASK} from './tasksSlice';

const firstTask = {
    taskId: 'one',
    title: 'Review evidence',
    status: 'TODO',
    dueDateTime: '2030-01-02T10:00:00'
};

describe('tasksSlice', () => {
    it('loads tasks into state', () => {
        const state = reducer(undefined, SET_TASKS([firstTask]));
        expect(state.items).toEqual([firstTask]);
    });

    it('updates an existing task', () => {
        const existing = reducer(undefined, SET_TASKS([firstTask]));
        const state = reducer(existing, UPSERT_TASK({...firstTask, status: 'COMPLETED'}));
        expect(state.items[0].status).toBe('COMPLETED');
    });

    it('removes a task', () => {
        const existing = reducer(undefined, SET_TASKS([firstTask]));
        const state = reducer(existing, REMOVE_TASK('one'));
        expect(state.items).toHaveLength(0);
    });
});
