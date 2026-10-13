import {configureStore} from '@reduxjs/toolkit';
import tasksReducer from './slice/tasksSlice';

const store = configureStore({
    reducer: {
        tasks: tasksReducer
    },
    devTools: import.meta.env.DEV
});

export default store;
