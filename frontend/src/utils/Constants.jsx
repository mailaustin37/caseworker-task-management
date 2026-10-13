export const REQUEST_METHOD = Object.freeze({
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
});

export const TASK_STATUS = Object.freeze({
    TODO: 'TODO',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED'
});

export const TASK_STATUS_LABEL = Object.freeze({
    [TASK_STATUS.TODO]: 'To do',
    [TASK_STATUS.IN_PROGRESS]: 'In progress',
    [TASK_STATUS.COMPLETED]: 'Completed'
});

export const GENERIC_ERROR_MESSAGE = 'The service could not complete your request. Try again.';
export const NO_SERVER_RESPONSE_MESSAGE = 'The task service is unavailable. Check that it is running and try again.';
