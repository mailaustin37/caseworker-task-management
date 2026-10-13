import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
import axios from '../../config/axios';
import {SET_LOADING} from '../../redux/slice/tasksSlice';
import {GENERIC_ERROR_MESSAGE, NO_SERVER_RESPONSE_MESSAGE} from '../Constants';

const useApi = () => {
    const dispatch = useDispatch();

    const httpRequest = useCallback(async (
        url,
        method,
        values = undefined,
        showLoader = true
    ) => {
        if (showLoader) dispatch(SET_LOADING(true));
        try {
            const response = await axios({method, url, data: values});
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message
                || (error.response ? GENERIC_ERROR_MESSAGE : NO_SERVER_RESPONSE_MESSAGE);
            toast.error(message);
            throw error;
        } finally {
            if (showLoader) dispatch(SET_LOADING(false));
        }
    }, [dispatch]);

    return {httpRequest};
};

export default useApi;
