import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
import {REMOVE_TASK, SET_TASKS, UPSERT_TASK} from '../../redux/slice/tasksSlice';
import {REQUEST_METHOD} from '../Constants';
import useApi from './useApi';

const useTasks = () => {
    const dispatch = useDispatch();
    const {httpRequest} = useApi();

    const loadTasks = useCallback(async () => {
        try {
            const response = await httpRequest('tasks', REQUEST_METHOD.GET);
            dispatch(SET_TASKS(response?.data?.tasks || []));
        } catch {
            dispatch(SET_TASKS([]));
        }
    }, [dispatch, httpRequest]);

    const saveTask = useCallback(async (values, taskId) => {
        const response = await httpRequest(
            taskId ? `tasks/${taskId}` : 'tasks',
            taskId ? REQUEST_METHOD.PUT : REQUEST_METHOD.POST,
            values
        );
        dispatch(UPSERT_TASK(response.data.task));
        toast.success(response.message);
        return response.data.task;
    }, [dispatch, httpRequest]);

    const updateTaskStatus = useCallback(async (taskId, status) => {
        const response = await httpRequest(
            `tasks/${taskId}/status`,
            REQUEST_METHOD.PATCH,
            {status},
            false
        );
        dispatch(UPSERT_TASK(response.data.task));
        toast.success(response.message);
    }, [dispatch, httpRequest]);

    const deleteTask = useCallback(async taskId => {
        const response = await httpRequest(`tasks/${taskId}`, REQUEST_METHOD.DELETE);
        dispatch(REMOVE_TASK(taskId));
        toast.success(response.message);
    }, [dispatch, httpRequest]);

    return {loadTasks, saveTask, updateTaskStatus, deleteTask};
};

export default useTasks;
