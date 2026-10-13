import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    items: [],
    isLoading: false,
    searchTerm: '',
    statusFilter: 'ALL'
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        SET_TASKS: (state, action) => {
            state.items = action.payload;
        },
        UPSERT_TASK: (state, action) => {
            const index = state.items.findIndex(task => task.taskId === action.payload.taskId);
            if (index === -1) {
                state.items.push(action.payload);
            } else {
                state.items[index] = action.payload;
            }
            state.items.sort((first, second) =>
                new Date(first.dueDateTime).getTime() - new Date(second.dueDateTime).getTime()
            );
        },
        REMOVE_TASK: (state, action) => {
            state.items = state.items.filter(task => task.taskId !== action.payload);
        },
        SET_LOADING: (state, action) => {
            state.isLoading = action.payload;
        },
        SET_SEARCH_TERM: (state, action) => {
            state.searchTerm = action.payload;
        },
        SET_STATUS_FILTER: (state, action) => {
            state.statusFilter = action.payload;
        }
    }
});

export const {
    SET_TASKS,
    UPSERT_TASK,
    REMOVE_TASK,
    SET_LOADING,
    SET_SEARCH_TERM,
    SET_STATUS_FILTER
} = tasksSlice.actions;

export default tasksSlice.reducer;
